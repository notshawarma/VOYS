import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import SinglePrograms from './pages/singleprograms'
import Login from './pages/login'
import Register from './pages/register'
import Header from './pages/header'
import Details from './pages/details'
import About from './pages/about'
import Dashboard from './Admin/Dashboard/Dashboard'
import AddPrograms from './Admin/CRUD/addPrograms'
import AddTestPrograms from './Admin/CRUD/addTestPrograms'
import GetPrograms from './Admin/Dashboard/ProgramsList'
import UpdatePrograms from './Admin/CRUD/updatePrograms'

const App = () => {
  return (
    <BrowserRouter>
      <Header /> {/* Placed outside of the Routes */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/single-programs/:id" element={<SinglePrograms />} exact={true} />
        <Route path="/login" element={<Login />} exact={true} />
        <Route path="/register" element={<Register />} exact={true} />
        <Route path="/details" element={<Details />} exact={true} />
        <Route path="/about" element={<About />} exact={true} />
        <Route path="/dashboard" element={<Dashboard />} exact="true" />
          <Route path="/addProgram" element={<AddPrograms />} exact="true" />
          <Route path="/addTestProgram" element={<AddTestPrograms />} exact="true" />
          <Route path="/getPrograms" element={<GetPrograms />} exact="true" />
          <Route path="/getPrograms/:id" element={<UpdatePrograms />} exact="true" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
