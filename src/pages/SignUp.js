import { React, useState } from 'react'
import Sales from '../dashboards/Sales';
import ExcelReader from '../components/ExcelReader';
import '../styles/SignUp.css'


function SignUp() {


  const [data, setData] = useState([]);
  const filePath = '/reports/mock_sales_data.xlsx'; // Specify the path to your Excel file

  return (
    <div className='signUp'>
      <ExcelReader filePath={filePath} onDataRead={setData} />
      {data.length > 0 ? (
            <>
              <Sales data={data} />
            </>
          ) : (
            <p>Loading data...</p>
          )}
    </div>
  )
}

export default SignUp