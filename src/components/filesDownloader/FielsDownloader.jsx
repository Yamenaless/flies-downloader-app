import React, { useState, useEffect } from "react";

const Example = () => {
  const [data, setData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const DATA_URL = "http://localhost:1337/api/programs?populate=*";
  const BASE_URL = "http://localhost:1337";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(DATA_URL);
        const responseData = await res.json();
        setData(responseData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setSelectedFiles((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedFiles((prevSelected) =>
        prevSelected.filter((file) => file !== value)
      );
    }
  };

  const handleDownload = async () => {
    // Example: Trigger download for each selected file
    selectedFiles.forEach(async (fileUrl) => {
      try {
        if (!fileUrl.startsWith("/")) {
          throw new Error("Invalid file URL format");
        }

        const response = await fetch(BASE_URL + fileUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileUrl.split("/").pop(); // Set the file name for download
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    });
  };

  return (
    <div className="p-5">
      {data.length !== 0 ? (
        data?.map((item, i) => (
          <div key={i} className="flex flex-row-reverse w-[100px] gap-3">
            <label htmlFor={`checkbox-${i}`}>{item.attributes.title}</label>
            <input
              type="checkbox"
              id={`checkbox-${i}`}
              name={item.attributes.title}
              value={item.attributes.files?.data.map(
                (cell) => cell.attributes.url
              )}
              onChange={handleCheckboxChange}
            />
          </div>
        ))
      ) : (
        <p>loading...</p>
      )}

      <button
        onClick={handleDownload}
        className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={selectedFiles.length === 0}
      >
        {selectedFiles.length === 0
          ? "Slect Files Please"
          : "Download Selected Files"}
      </button>
    </div>
  );
};

export default Example;
