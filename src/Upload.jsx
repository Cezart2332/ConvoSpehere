import { useState,useEffect } from 'react'
import Header from "@/components/Header.jsx";
import { useNavigate } from "react-router-dom";
import UploadForm from "@/components/UploadForm"


 
const Upload = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"))
        const user = localStorage.getItem("user")
        if(!isLoggedIn){
            navigate("/Register")
        }

    },[])

  return (
    <>
      <Header>
      </Header>
      <UploadForm></UploadForm>
    </>

    
  )
}

export default Upload