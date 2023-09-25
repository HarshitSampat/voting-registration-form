import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Test from './components/Test.jsx'
import Table from './components/Table.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='test' element={<Test />} />
      <Route path='userdata' element={<Table></Table>}></Route>
      <Route path='edit/userdata/:index' element={<App></App>}></Route>
    </Routes>
  </BrowserRouter>,
)
