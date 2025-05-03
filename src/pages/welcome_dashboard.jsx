import React from "react";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import "./welcome_dashboard.css";

const pieData = [
  { name: "Valid", value: 70 },
  { name: "Invalid", value: 30 },
];

const barData = [
  { name: "Accounts", Valid: 700, Invalid: 300 },
];

const groupedBarData = [
  { bank_code: "KCB", Valid: 200, Invalid: 100 },
  { bank_code: "ABSA", Valid: 150, Invalid: 50 },
  { bank_code: "Equity", Valid: 350, Invalid: 150 },
];

const COLORS = ["#00C49F", "#FF8042"];

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>My Dashboard</h2>
        <ul>
          <li><Link to="/file_upload">Start Transaction</Link></li>
          <li>Overview</li>
          <li>Users</li>
          <li>Sales</li>
          <li>Reports</li>
        </ul>
      </aside>

      <div className="main">
        <header className="navbar">
          <h1>Dashboard Overview</h1>
        </header>

        <div className="cards">
          <div className="card">
            <p className="label">Users</p>
            <p className="value">1,234</p>
          </div>
          <div className="card">
            <p className="label">Sales</p>
            <p className="value">$8,900</p>
          </div>
          <div className="card">
            <p className="label">Active</p>
            <p className="value">76%</p>
          </div>
          <div className="card">
            <p className="label">Growth</p>
            <p className="value">+12%</p>
          </div>
        </div>

        <div className="charts">
          {/* Three Columns Layout */}
          <div className="charts-container">
            {/* Pie Chart */}
            <div className="chart-column">
              <h3>Valid vs Invalid (Pie Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="chart-column">
              <h3>Valid vs Invalid (Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Valid" fill="#00C49F" />
                  <Bar dataKey="Invalid" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stacked Bar Chart */}
            <div className="chart-column">
              <h3>Valid/Invalid per Bank (Stacked Bar)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={groupedBarData}>
                  <XAxis dataKey="bank_code" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Valid" stackId="a" fill="#00C49F" />
                  <Bar dataKey="Invalid" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
