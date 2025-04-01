import { useState,useEffect } from 'react'
import Header from "@/components/Header.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {Flex} from "@chakra-ui/react"
import ProfileInfo from "@/components/ProfileInfo"
import {OrbitProgress} from 'react-loading-indicators'



 
const Profile = () => {
    const {username} = useParams()
    const navigate = useNavigate()
    const [userData,setUserData] = useState(null)

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"))
        if(!isLoggedIn){
            navigate("/Register")
        }
        else{
          fetch(`http://localhost:5006/api/users/getprofiledata/?username=${username}`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            console.log(data)
            setUserData(data)})
          .catch(err => console.error(err))
        }
       

    },[username,navigate])


  if(!userData){
    return(
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <OrbitProgress color="blue" size="medium" text="" textColor="" />
      </Flex>
    )
  }


  return (
    <>
      <Header>
      </Header>
      <ProfileInfo userData={userData}></ProfileInfo>
    </>

    
  )
}

export default Profile