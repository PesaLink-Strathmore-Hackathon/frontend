import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import './file_upload.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results.errors.length > 0) {
            alert('There was an error processing the file. Please choose another one.');
            e.target.value = '';
            return;
          }
          setCsvData(results.data);
          setResults([]);
        },
        error: function (error) {
          alert('Error parsing the file. Please choose another one.');
          console.error('File Parsing Error:', error);
          e.target.value = '';
        }
      });
    } else {
      alert('No file selected. Please choose a valid CSV file.');
    }
  };

  const validateAccounts = async () => {
    setLoading(true);
    try {
      const { data: keyData } = await axios.get(
        'https://account-validation-service.dev.pesalink.co.ke/api/key'
      );
      const apiKey = keyData.apiKey;

      const validations = await Promise.all(
        csvData.map(async (record) => {
          try {
            const response = await axios.post(
              'https://account-validation-service.dev.pesalink.co.ke/api/validate',
              {
                accountNumber: record.accountNumber,
                bankCode: record.bankCode,
              },
              {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            return {
              ...record,
              status: response.data.status === 'Valid' ? 'Valid' : 'Invalid',
              accountHolder: response.data.accountHolderName || '-',
              errorReason:
                response.data.status !== 'Valid' ? 'Failed API Validation' : null,
            };
          } catch (error) {
            let reason = 'Unknown error';
            if (error.response?.data?.message) {
              reason = error.response.data.message;
            } else if (error.code === 'ECONNABORTED') {
              reason = 'Network timeout';
            } else if (error.response?.status === 404) {
              reason = 'Account Does Not Exist';
            } else if (error.response?.status === 400) {
              reason = 'Invalid Format';
            } else if (error.response?.status === 403) {
              reason = 'Account Blocked';
            } else if (error.response?.status === 410) {
              reason = 'Account Closed';
            }

            return {
              ...record,
              status: 'Invalid',
              accountHolder: '-',
              errorReason: reason,
            };
          }
        })
      );

      setResults(validations);
    } catch (err) {
      alert('Error fetching API Key or validating account.');
      console.error(err);
    }
    setLoading(false);
  };

  const getErrorSummary = () => {
    return results.reduce((acc, row) => {
      if (row.status === 'Invalid') {
        acc[row.errorReason] = (acc[row.errorReason] || 0) + 1;
      }
      return acc;
    }, {});
  };

  return (
    <div className="container">
      <h1>Pesalink Account Validator</h1>

      <div className="upload-section">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      {csvData.length > 0 && (
        <button className="validate-btn" onClick={validateAccounts} disabled={loading}>
          {loading ? 'Validating...' : 'Validate Account'}
        </button>
      )}

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Hold on... Validating accounts</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Bank Code</th>
                <th>Status</th>
                <th>Account Holder</th>
                <th>Error Reason</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index} className={row.status === 'Valid' ? 'valid-row' : 'invalid-row'}>
                  <td>{row.accountNumber}</td>
                  <td>{row.bankCode}</td>
                  <td>{row.status}</td>
                  <td>{row.accountHolder}</td>
                  <td>{row.errorReason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results.length > 0 && (
        <div className="summary-report">
          <h3>Validation Summary</h3>
          <ul>
            {Object.entries(getErrorSummary()).map(([reason, count]) => (
              <li key={reason}>{reason}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
