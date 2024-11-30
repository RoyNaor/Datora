import { useEffect } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ filePath, onDataRead }) => {
  useEffect(() => {
    // Ensure that filePath is provided before fetching
    if (!filePath) {
      console.error('No file path provided.');
      return;
    }

    // Load the Excel file programmatically from the provided path
    const fetchData = async () => {
      try {
        console.log('Fetching Excel file from:', filePath);
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to fetch the Excel file. Status: ${response.status}`);
        }

        console.log('Excel file fetched successfully.');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        if (!workbook.SheetNames.length) {
          throw new Error('The Excel file contains no sheets.');
        }

        const worksheetName = workbook.SheetNames[0];
        console.log(`Reading worksheet: ${worksheetName}`);
        const worksheet = workbook.Sheets[worksheetName];

        if (!worksheet) {
          throw new Error(`Failed to find the worksheet: ${worksheetName}`);
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          throw new Error('The worksheet is empty.');
        }

        // Log the raw data for debugging
        console.log('Raw JSON Data:', jsonData);

        // Map the JSON data to an array of objects (assuming the first row is the header)
        const keys = jsonData[0];
        if (!keys || keys.length === 0) {
          throw new Error('Header row is missing or empty.');
        }

        const formattedData = jsonData.slice(1).map((row, rowIndex) => {
          if (row.length !== keys.length) {
            console.warn(`Row ${rowIndex + 1} has inconsistent column count.`);
          }
          return keys.reduce((acc, key, i) => {
            acc[key] = row[i] !== undefined ? row[i] : null; // Handle missing values
            return acc;
          }, {});
        });

        console.log('Formatted Data:', formattedData);
        onDataRead(formattedData);
      } catch (error) {
        console.error('Error fetching or reading the Excel file:', error);
      }
    };

    fetchData();
  }, [filePath, onDataRead]);

  return null; // No UI is needed for this component
};

export default ExcelReader;
