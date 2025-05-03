import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data);
      },
    });
  };

  const validateAccounts = async () => {
    setLoading(true);
    try {
      const { data: keyData } = await axios.get('https://account-validation-service.dev.pesalink.co.ke/api/key');
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
            return { ...record, status: response.data.status, accountHolder: response.data.accountHolderName };
          } catch (error) {
            return { ...record, status: 'Invalid', error: error.response?.data?.message || 'Validation error' };
          }
        })
      );

      setResults(validations);
    } catch (err) {
      alert('Error fetching API Key or validating accounts.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Pesalink Bulk Account Validator</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <br /><br />
      {csvData.length > 0 && <button onClick={validateAccounts}>Validate Accounts</button>}
      <br /><br />
      {loading && <p>Validating... Please wait.</p>}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Bank Code</th>
            <th>Status</th>
            <th>Account Holder</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index}>
              <td>{row.accountNumber}</td>
              <td>{row.bankCode}</td>
              <td>{row.status}</td>
              <td>{row.accountHolder || row.error || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
