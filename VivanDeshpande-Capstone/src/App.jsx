import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function FinanceDashboard() {
  return (
    <>
      <h2>Finance Dashboard</h2>
      <input type="text" placeholder="Stock Symbol" value=""></input>
      <input type="number" placeholder="Quantity" value=""></input>
      <input type="number" placeholder="Price" value=""></input>
      <button>Submit</button>
    </>
  )
}

function StockList() {
  return (
    <>
      <h4>Stock List</h4>
      <p>No stocks added yet.</p>
    </>
  )
}


function App() {
  return (
  <>
    <FinanceDashboard />
    <StockList />
  </>
  )
}



export default App
