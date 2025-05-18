import React, { useEffect, useRef, useState } from "react";
import Upload from "../../components/upload/Upload";
import "./evaluation.css";
import { CSVLink } from "react-csv";
import { useLocation } from "react-router-dom";
import axios from "axios";
const ENP = "http://localhost:8800/api"

export default function Evaluation() {

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const profCode = location.pathname.split("/")[2]
    const subjParam = queryParams.get('subj');
    const courseCode = subjParam ? subjParam.split('_')[0] : null;
    const yearCode = subjParam ? subjParam.split('_')[1] : null;
    const [ data, setData ] = useState([])
    const [updatedData, setUpdatedData] = useState(null)
    
    useEffect(() => {
        const getData = async () => {
            try{
                const timestamp = new Date().getTime()
                const res = await axios.get(`${ENP}/fetchdbs/tests/subjects/${courseCode}?timestamp=${timestamp}`)
                const bangkokTime = new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
                const dateObj = new Date(bangkokTime)
                const isoData = dateObj.toISOString()
                
                setUpdatedData({
                    course_name: courseCode,
                    year: yearCode,
                    prof_id: profCode,
                    update_data: isoData
                })

                setData(res.data)
            }catch(err){
                console.log(err)
            }
        }
        getData()
    }, [courseCode, profCode, yearCode])

    useEffect(() => {
        if (data && data[0]?.subj_name) {
            // console.log(subjName);
        } else if (data) {
            // console.log("No subject name found.");
        }
    }, [data]);

    const [outputs, setOutputs] = useState([[], [], [], []]);
    const [weights, setWeights] = useState([100, 100, 100, 100]);
    const [submitted, setSubmitted] = useState(false);
    const [numFiles, setNumFiles] = useState(1);

    const handleOutputChange = (newOutput, weight, index, numFilesSelected) => {
        const newOutputs = [...outputs];
        const newWeights = [...weights];
        newOutputs[index] = newOutput;
        newWeights[index] = weight;
        setOutputs(newOutputs);
        setWeights(newWeights);
        setNumFiles(numFilesSelected);
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        const totalWeightedScore = calculateTotalWeightedScore();
        try {
            const postRes = await axios.post(`${ENP}/score/fillPiSum/${profCode}/${yearCode}/${courseCode}`, totalWeightedScore);
            console.log("Server Response:", postRes);
        } catch (err) {
            console.error("Error submitting data:", err);
        }
    };

    const calculateTotalWeightedScore = () => {
        const totalWeightedData = {};
    
        outputs.slice(0, numFiles).forEach((data, index) => {
            const weightFactor = weights[index] / 100;
    
            for (const indicator in data) {
                const indicatorData = data[indicator];
                const totalScoreSum = Object.values(indicatorData).reduce((sum, score) => sum + parseFloat(score || 0), 0);
    
                if (!totalWeightedData[indicator]) {
                    totalWeightedData[indicator] = { weightedScores: [0, 0, 0, 0, 0], totalWeightedSum: 0, totalRows: 0 };
                }
    
                let weightedSum = 0;
                let totalRows = 0;
    
                [1, 2, 3, 4, 5].forEach((level, i) => {
                    const scoreValue = parseFloat(indicatorData[level] || 0);
                    const weightedPercentage = (totalScoreSum > 0 ? (scoreValue / totalScoreSum) * 100 : 0) * weightFactor;
                    totalWeightedData[indicator].weightedScores[i] += weightedPercentage;
                    weightedSum += scoreValue * level;
                    totalRows += scoreValue;
                });
    
                totalWeightedData[indicator].totalWeightedSum += weightedSum;
                totalWeightedData[indicator].totalRows += totalRows;
            }
        });
    
        return Object.entries(totalWeightedData).map(([indicator, { weightedScores, totalWeightedSum, totalRows }]) => {
            const percentages = weightedScores.map(score => Math.round(score));
            let totalRoundedPercentage = percentages.reduce((sum, percent) => sum + percent, 0);
    
            let difference = 100 - totalRoundedPercentage;
            if (difference !== 0) {
                const adjustIndex = percentages.findIndex(percent => difference > 0 ? percent > 0 : percent > 1);
                if (adjustIndex !== -1) {
                    percentages[adjustIndex] += difference;
                }
            }
    
            const targetPointsSum = percentages[3] + percentages[4];
            const result = targetPointsSum > 60 ? "Pass" : "Failed";
            const averageScore = totalRows > 0 ? (totalWeightedSum / totalRows).toFixed(1) : "0.00";
    
            return {
                indicator,
                Avg: averageScore,
                Score1: percentages[0] + "%",
                Score2: percentages[1] + "%",
                Score3: percentages[2] + "%",
                Score4: percentages[3] + "%",
                Score5: percentages[4] + "%",
                Target: targetPointsSum + "%",
                Result: result,
            };
        });
    };

    const totalWeightedScore = submitted ? calculateTotalWeightedScore() : [];

    return (
        <div className="App">
            <div className="container">
                <div className="subject-container">{data ? `Subject: ${data[0]?.subj_name || "No Data"}` : "Loading..."}</div>
                    <div className="upload-section">
                        <Upload onOutputChange={handleOutputChange} onSubmit={handleSubmit} upData={updatedData}/>
                    </div>
                {submitted && (
                    <div className="outcome-section">
                        <div className="example-outcome"><b>Total Weighted Outcome</b></div>
                        <DataTable data={totalWeightedScore} />
                    </div>
                )}
            </div>
        </div>
    );
}

const DataTable = ({ data }) => {
    const tableRef = useRef(null);

    if (!data || data.length === 0) {
        return <div>No data to display</div>;
    }
    const columns = ["Avg", "Score5", "Score4", "Score3", "Score2", "Score1", "Score 4+5", "Result"];
    // Function to clean percentage signs for CSV export
    const prepareDataForCSVExport = (data) => {
        return data.map((row) => ({
            indicator: row.indicator,
            Avg: row.Avg,
            Score5: row.Score5.replace("%", ""),
            Score4: row.Score4.replace("%", ""),
            Score3: row.Score3.replace("%", ""),
            Score2: row.Score2.replace("%", ""),
            Score1: row.Score1.replace("%", ""),
            "Score 4+5": row.Target.replace("%", ""),
            Result: row.Result,
        }));
      };
      
    // Data to export without the % symbol
    const exportData = prepareDataForCSVExport(data);

    return (
        <div>
            <table className="data-table" ref={tableRef}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center'}}>LOs</th>
                        {columns.map((col, index) => (
                            <th style={{ textAlign: 'center'}} key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center'}}>PI: {item.indicator}</td>
                            {columns.map((col, colIndex) => {
                                const key = col === "Score 4+5" ? "Target" : col;
                                return (
                                    <td
                                    style={{ textAlign: 'center'}}
                                    key={colIndex}
                                    className={key === "Result" ? (item[key] === "Pass" ? "pass" : "failed") : ""}
                                    >
                                    {item[key]}
                                    </td>
                                );
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bg-white">
                <CSVLink className="export" data={exportData} filename="total_score.csv">
                    <b>Export Score</b>
                </CSVLink>
            </div>
        </div>
    );
};