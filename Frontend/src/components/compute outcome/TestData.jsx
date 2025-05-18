import React, { useState } from "react";
import fetchAndCombineData from "./Compute";
import { getPackedData } from "../../pages/outcome/Outcome";
import axios from "axios";
import "./TestData.css"
import { CSVLink } from "react-csv";

const ENP = "http://localhost:8800/api";

function ScoreComponent() {

  const packed = getPackedData();
  const profCode = packed?.[0] || "";
  const courses = packed?.[1] || [];
  const surveyId = packed?.[2] || "";

  console.log("sortedGroupedData", courses)
  console.log("surveyid", surveyId)

  console.log("✅ Received from Outcome:", packed);

  // const [surveyId, setSurveyId] = useState("2");
  const [combinedScores, setCombinedScores] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(true); // Track button visibility
  const prepareCSVData = () => {
    if (!combinedScores) return [];
  
    return Object.entries(combinedScores).map(([piId, scores], index) => ({
      PI: `PI ${surveyId}.${index + 1}`,
      Final_Score1: scores["Final_score1"].toFixed(2),
      Final_Score2: scores["Final_score2"].toFixed(2),
      Final_Score3: scores["Final_score3"].toFixed(2),
      Final_Score4: scores["Final_score4"].toFixed(2),
      Final_Score5: scores["Final_score5"].toFixed(2),
    }));
  };
  
  // Example weight array for multiple years
  // const courses = [
  //   { year: "2024", courses: "ENE341, ENE322, ENE330", weight: "80.00" },
  //   { year: "2025", courses: "ENE324", weight: "80.00" },
  //   // { year: "2026", courses: "ENE612", weight: "80.00" },
  // ];

  const handleFetchData = async () => {
    setButtonVisible(false);
  
    let finalScores = {};
    let totalCounts = {};
    let surveyTotals = {};
    let globalSurveyWeight = null;

    // 🟢 Process all years and accumulate course scores
    for (const courseObj of courses) {
      const result = await fetchAndCombineData(courseObj.year, courses, surveyId, profCode);
      if (!result) continue;

      const { courseScores, courseCount,  surveyWei} = result;
      if (globalSurveyWeight === null) {
        globalSurveyWeight = surveyWei;
      }

      for (const piId in courseScores) {
        if (!finalScores[piId]) finalScores[piId] = {};
        if (!totalCounts[piId]) totalCounts[piId] = 0;

        for (let i = 1; i <= 5; i++) {
          const key = `Final_score${i}`;
          finalScores[piId][key] = (finalScores[piId][key] || 0) + (courseScores[piId][key] || 0);
        }

        totalCounts[piId] += courseCount[piId] || 0;
      }
    }
  
    // 🟡 Fetch and apply survey scores once (only 1 fetch!)
    const surveyYear = courses[0].year; // Pick any year; API uses year for fetching config
    const surveyRes = await axios.get(`${ENP}/score/piSurveyFetching/${surveyId}/${surveyYear}`);
    // const surveyWeight = await axios.get()
    const surveyData = surveyRes.data;
    console.log(surveyData)

    for (const entry of surveyData) {
      const piId = entry.PI_id;
      if (!surveyTotals[piId]) surveyTotals[piId] = {};

      for (let i = 1; i <= 5; i++) {
        const key = `Final_score${i}`;
        surveyTotals[piId][key] = entry[`PIS_score${i}`] * (globalSurveyWeight / 100);
      }
    }

    // ✅ Final computation
    for (const piId in finalScores) {
      const count = totalCounts[piId] || 1;
      for (let i = 1; i <= 5; i++) {
        const key = `Final_score${i}`;
        const coursePart = finalScores[piId][key] / count;
        const surveyPart = surveyTotals[piId]?.[key] || 0;
        finalScores[piId][key] = coursePart + surveyPart;
      }
    }

    setCombinedScores(finalScores);
  };

  return (
    <div className="score-app">
      <div className="score-container">
        <h2>Final Scores</h2>
  
        {buttonVisible && <button className="score-button" onClick={handleFetchData}>Fetch & Combine Scores</button>}
  
        {combinedScores && (
          <>
          <table className="score-table">
            <thead>
              <tr>
                <th>PI ID</th>
                <th>Final Score 1</th>
                <th>Final Score 2</th>
                <th>Final Score 3</th>
                <th>Final Score 4</th>
                <th>Final Score 5</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(combinedScores).map(([piId, scores], index) => (
                <tr key={piId}>
                  <td>{`PI ${surveyId}.${index + 1}`}</td>
                  {[1, 2, 3, 4, 5].map(i => (
                    <td key={i}>{scores[`Final_score${i}`].toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="export-section">
          <CSVLink
            data={prepareCSVData()}
            filename={`final_PI_scores_${surveyId}.csv`}
            className="score-button"
          >
            Export Scores to CSV
          </CSVLink>
          </div>
          </>
        )}
      </div>
    </div>
  );
  
}

export default ScoreComponent;