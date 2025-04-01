import { useEffect, useState } from 'react'
import Header from "@/components/Header.jsx";
import Posts from "@/components/Posts.jsx"
import {OrbitProgress} from 'react-loading-indicators'
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate()
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Register"); 
    }
  }, [isLoggedIn, navigate]); 

  
  return (
    <>
      <Header>
      </Header>
      <Posts>
        
      </Posts>
      
    </>

    
  )
}

export default Home