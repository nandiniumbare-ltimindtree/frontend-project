import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [fileContent, setFileContent] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const json = convertTextToJson(content);
      setFileContent(content);
      saveJsonToFile(json);
    };

    reader.readAsText(file);
  };

  const convertTextToJson = (text) => {
    const lines = text.split("\n");
    const keys = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/"/g, ""));

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      // Only process the first two lines
      const obj = {};
      const currentLine = lines[i]
        .split(",")
        .map((value) => value.trim().replace(/"/g, ""));
      keys.forEach((header, index) => {
        if (index === 1 || index === 3) {
          obj[header] = currentLine[index];
        }
      });
      result.push(obj);
    }
    return result;
  };

  const saveJsonToFile = async (json) => {
    console.log(json);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/save-json",
        json
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error saving JSON to file:", error);
    }
  };
  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUpload;
