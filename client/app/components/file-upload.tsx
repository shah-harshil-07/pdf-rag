"use client";

import * as React from "react";
import { Upload } from "lucide-react";

const FileUploadComponent: React.FC = () => {
  const handleFileUpload = () => {
    const fileInputEl = document.createElement("input");
    fileInputEl.setAttribute("type", "file");
    fileInputEl.setAttribute("accept", "application/pdf");

    fileInputEl.addEventListener("change", async () => {
      const file = fileInputEl.files?.[0];
      const formData = new FormData();

      if (file) {
        formData.append("pdf", file);
        await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        alert("File uploaded successsfuly!");
      }
    });

    fileInputEl.click();
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded">
      <div
        onClick={handleFileUpload}
        className={"flex flex-col justify-center items-center"}
      >
        <h3>Upload PDF file</h3>
        <Upload />
      </div>
    </div>
  );
};

export default FileUploadComponent;
