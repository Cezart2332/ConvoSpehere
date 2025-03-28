import { useState,useEffect } from 'react'
import Header from "@/components/Header.jsx";
import { useNavigate } from "react-router-dom";
import {Button} from "@chakra-ui/react"
import ProfileInfo from "@/components/ProfileInfo"



 
const Profile = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"))
        const user = localStorage.getItem("user")
        if(!isLoggedIn){
            navigate("/Register")
        }
        else{
            setUserData(JSON.parse(user))
        }

    },[navigate])


  return (
    <>
      <Header>
      </Header>
      <ProfileInfo></ProfileInfo>
    </>

    
  )
}

export default Profile