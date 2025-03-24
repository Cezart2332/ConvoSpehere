import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import Profile from "./Profile"
import Upload from './Upload'

const App = () => {
  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Upload" element={<Upload />} />
        </Routes>   
    </>

    
  )
}

export default App
