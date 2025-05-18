import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './upload.css';
import axios from 'axios';
const ENP = "http://localhost:8800/api"

function transformData(input) {
  const output = {};

  input.forEach(obj => {
    Object.entries(obj).forEach(([key, value]) => {
      output[key] = output[key] || {};
      output[key][value] = (output[key][value] || 0) + 1;
    });
  });

  return output;
}

function Upload({ onOutputChange, onSubmit, upData }) {
  const [fileData, setFileData] = useState([[]]);
  const [headers, setHeaders] = useState([[]]);
  const [filesUploaded, setFilesUploaded] = useState([false]); 
  const [submitted, setSubmitted] = useState(false); 
  const keysToRemove = ["Student Name", "Seq No.", "Student Code"];

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const fileHeaders = jsonData[0];
      const filteredData = XLSX.utils.sheet_to_json(sheet).map((obj) => {
        for (const key of keysToRemove) {
          delete obj[key];
        }
        return obj;
      });
  
      setFileData([jsonData.slice(1)]);
      setHeaders([fileHeaders]);  
      setFilesUploaded([true]);
  
      onOutputChange(transformData(filteredData), 100, 0, 1);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const isSubmitDisabled = () => {
    return !filesUploaded[0];
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    onSubmit();
    try {
      if( upData.year === null ){
        console.log("NULL upData")
      }
      else{
        const response = await axios.put(`${ENP}/records/timestamp`, upData);
        console.log('Data record successfully:', response.data);
      }
    }catch(err){
      console.log(err)
    }
  };

  return (
    <div className="form-container">
      <h2>
        <b>Score Sheet</b>
      </h2>

      <div className="upload-section">
        <label htmlFor="file1">Upload Excel File:</label>
        <input
          type="file"
          id="file1"
          className={filesUploaded[0] ? 'uploaded-file' : ''}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>

      {!submitted && (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default Upload;
