import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { ExpenseInput } from "./components/ExpenseInput";
import { ExpenseProvider } from "./state/expenseContext";
import ExpenseList from "./components/ExpenseList";
import { ExpenseFilters } from "./components/ExpenseFilters";
import { ExpenseCharts } from "./components/ExpenseCharts";

function App() {
  return (
    <ExpenseProvider>
      <div className="App">
        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
        <h1>Finance Tracker</h1>
        <ExpenseInput />
        <ExpenseFilters />
        <ExpenseList />
        <ExpenseCharts chartName={"Expense Charts"} />
      </div>
    </ExpenseProvider>
  );
}

export default App;
