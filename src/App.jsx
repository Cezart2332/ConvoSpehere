import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import Profile from "./Profile"

const App = () => {
  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>   
    </>

    
  )
}

export default App
