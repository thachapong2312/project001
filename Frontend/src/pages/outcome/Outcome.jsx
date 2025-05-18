import React, { useEffect, useState } from "react";
import "./outcome.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const ENP = "http://localhost:8800/api"

// Shared memory functions
let packedData = null;

export function setPackedData(data) {
  packedData = data;
}
export function getPackedData() {
  return packedData;
}

export default function Outcome() {

  const [data, setData] = useState([]);
  const [weight, setWeight] = useState([])
  const [years, setYears] = useState([])
  const [courses, setCourses] = useState([])
  const [dummy, setDummy] = useState(0)
  const [formInput, setFormInput] = useState({ year: "", course: "", weight: "" });
  const [selectedYear, setSelectedYear] = useState("");
  const [sortedGroupedData, setSortedGroupedData] = useState([]);
  const [submittedYears, setSubmittedYears] = useState([]);
  const [inputWeights, setInputWeights] = useState([]);

  const navigate = useNavigate();
  const location = useLocation()
  const profCode = location.pathname.split("/")[2]
  const piCode = location.pathname.split("/")[3]
  const timestamp = new Date().getTime()
  const bangkokTime = new Date(timestamp)
  const year = bangkokTime.getFullYear()
  const month = bangkokTime.getMonth() + 1
  const start_month = 8
  let startYear, endYear

  if (month >= start_month){
    startYear = year
    endYear = year + 1
  }
  else{
    startYear = year - 1
    endYear = year
  }
    const AcdYear = startYear

  const isSubmitDisabled = () => {
    return sortedGroupedData.length === 0;
  };
    
  useEffect(() => {
    const getData = async () => {
        try{
            const res = await axios.get(`${ENP}/fetchdbs/studentOutcome/${AcdYear}/${profCode}`)
            if (res.data.length > 0 && res.data[0].PI_no_list.length > 0) {
              setDummy(res.data[0].PI_no_list[0]);
          }
            setData(res.data)
        }catch(err){
            console.log(err)
        }
    }
    getData()
}, [AcdYear, profCode])

  useEffect(() => {
    const getWeight = async () => {
        try{
            const wei = await axios.get(`${ENP}/fetchdbs/weight/${AcdYear}/${profCode}`)
            setWeight(wei.data)
        }catch(err){
            console.log(err)
        }
    }
    getWeight()
}, [AcdYear, profCode])

  useEffect(() => {
    fetchYears()
}, [])

  const fetchYears = async () => {
    try {
      const yrs = await axios.get(`${ENP}/fetchdbs/getSingleyear`)
      setYears(yrs.data)
    }catch(err){
      console.log(err)
    }
  }

  const fetchCourses = async (year) => {
    if (!year) {
      setCourses([])
      return
    }
    try{
      const crs = await axios.get(`${ENP}/fetchdbs/courses_list/${profCode}?year=${year}`)
      setCourses(crs.data)
    }catch(err){
      console.log(err)
    }
  }

  const submitAllWeights = async () => {
    const requests = Object.entries(inputWeights)
      .filter(([_, val]) => val !== "")
      .map(async ([year, newWeight]) => {
        try {
          await axios.put(`${ENP}/records/weightUpdate`, {
            resp_year: Number(year),
            prof_id: Number(profCode),
            newweight_data: Number(newWeight),
          });
          console.log(`Updated: ${year} -> ${newWeight}`);
        } catch (err) {
          console.error(`Failed to update ${year}:`, err);
        }
      });
  
    await Promise.all(requests);
  
    // Refresh and clear input
    const wei = await axios.get(`${ENP}/fetchdbs/weight/${AcdYear}/${profCode}`);
    setWeight(wei.data);
    setInputWeights({});
  
    // Pack and send the data
    const packed = [profCode, sortedGroupedData, dummy[2]];
  
    setPackedData(packed);
  
    console.log("Packed and sent:", packed);
  };  

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
    fetchCourses(e.target.value)
  };
  
  const handldCourseChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };
  
  const handldWeightChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleSurveyYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleWeightInputChange = (e, year) => {
    const value = e.target.value;
    setInputWeights(prev => ({
      ...prev,
      [year]: value
    }));
  };

  const handleSubmit = () => {
    const surveyWeight = weight.find(w => Number(w.resp_year) === Number(formInput.year))?.weight || 0;
    // const surveyWeight = weight.weight || 0; // Default to 0 if not available
    
    const remainingWeight = 100 - surveyWeight; // Remaining weight after survey weight
  
    const updatedData = [...data, { year: formInput.year, course: formInput.course }];
  
    // Remove empty or undefined entries before recalculating weights
    const filteredData = updatedData.filter(entry => entry.year && entry.course);
  
    // Group subjects by year and collect courses
    const groupedByYear = {};
    filteredData.forEach(entry => {
      if (!groupedByYear[entry.year]) {
        groupedByYear[entry.year] = { courses: [], count: 0, weight: 0 };
      }
      groupedByYear[entry.year].courses.push(entry.course);
      groupedByYear[entry.year].count += 1;
    });
  
    // Distribute weight evenly per year
    Object.keys(groupedByYear).forEach(year => {
      groupedByYear[year].weight = (remainingWeight / groupedByYear[year].count).toFixed(2);
    });
  
    // Convert object into sorted array
    const sortedGroupedData = Object.entries(groupedByYear)
      .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
      .map(([year, { courses, weight }]) => ({
        year,
        courses: courses.join(", "), // Convert courses array to string
        weight,
      }));
  
    // Log the extracted and grouped data
    console.log("sortedGroupedData", sortedGroupedData);
  
    // Update selected year to be the maximum of previously selected
    const selected = Number(formInput.year);
    if (!selectedYear || Number(selectedYear) < selected) {
      setSelectedYear(formInput.year);  // store only the highest year
    }

    const currentYear = Number(formInput.year);
    if (!submittedYears.length || Number(submittedYears[0]) < currentYear) {
      setSubmittedYears([formInput.year]);
      console.log("Survey Score Year:", formInput.year);
    } else {
      console.log("Survey Score Year:", submittedYears[0]);
    }    
  
    setSortedGroupedData(sortedGroupedData);
    setData(updatedData); // Update state with new weights
    setFormInput({ year: "", course: "", weight: "" }); // Reset form
  };
  
  return (
    <div className="app">
        <div className="content">
      <div className="head">
        <div className="so-box">{"SO"+dummy[2]}</div>
        {/* <button className="edit-btn">Edit</button> */}
      </div>
      <div className="data-display">
        <h3>Course Data</h3>
        {data.length > 0 ? (
          data.map((entry, index) => {
            // Find matching weight from sortedGroupedData based on year
            const matchedWeight = sortedGroupedData.find(item => item.year === entry.year);
            return (
              <div className="data-row" key={index}>
                <div>Year: {entry?.year || ""}</div>
                <div>Course: {entry?.course || ""}</div>
                <div>Weight: {matchedWeight ? matchedWeight.weight : ""}</div>
              </div>
            );
          })
        ) : (
          <div className="data-row">No data available</div>
        )}
      </div>

      <div className="survey-section">
        <div className="survey-header">
          <div className="header-item">Survey Score</div>
          <div className="header-item">Year</div>
          <div className="header-item">Weight</div>
        </div>

        {selectedYear && weight.length > 0 ? (
          [selectedYear].flat().map((year, index) => {
            const weightIndex = weight.findIndex(w => Number(w.resp_year) === Number(year));
            const weightValue = weightIndex !== -1 ? weight[weightIndex].weight : "0";

            return (
              <div className="survey-row" key={index}>
                <div className="row-item">Survey Score</div>
                <div className="row-item">{year}</div>
                <input
                  className="weight-input"
                  type="number"
                  placeholder={weightValue}
                  value={inputWeights[year] || ""}
                  onChange={(e) => handleWeightInputChange(e, year)}
                />
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>

      <div className="form-section">
        <select
          name="year"
          value={formInput.year}
          onChange={handleYearChange}
          className="input-box"
        >
          <option value="">- Year -</option>
          {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
        </select>

        <select
          name="course"
          value={formInput.course}
          onChange={handldCourseChange}
          className="input-box"
        >
          <option value="">- Select Course -</option>
          {courses.map((course) => (
                    <option key={course.subj_id} value={course.subj_id}>{course.course_name}</option>
                ))}
        </select>

        {formInput.year && formInput.course && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
      <button
        className="save-btn"
        disabled={isSubmitDisabled()}
        onClick={async () => {
          await submitAllWeights();
          navigate("/TestData");
        }}
      >
        Submit
      </button>
      </div>
    </div>
  );
};
