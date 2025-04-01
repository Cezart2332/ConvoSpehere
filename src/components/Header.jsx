import { useState } from 'react'
import { Button, Flex,IconButton,Text,SimpleGrid,Image,Box,Icon,Separator } from "@chakra-ui/react"
import {House,Search,Send,BadgePlus, CircleUserRound  } from 'lucide-react';
import {Link} from "react-router-dom"

const Header = () => {


  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false; 
  const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) || {} : {}; 


  return (
    <>
      <Flex 
      as="header"
      position="fixed"
      top="0"
      left="0"
      height="100%"
      width="12%"
      p={2}
      zIndex="1000"
      boxShadow="sm" 
      background="blue" 
      justify="space-between"
      textAlign="center"
      flexDirection="column"
      >
          <Text textStyle="xl" fontWeight="bold">ConvoSphere</Text>
          <Flex flexDirection="column" gap="3">
          <Link to="/"><Button variant="ghost"><Icon><House /></Icon>Home</Button></Link>
            <Link to="/Search"><Button variant="ghost"><Icon><Search /></Icon>Search</Button></Link>
            <Button variant="ghost"><Icon><Send /></Icon>Messages</Button>
            <Link to="/Upload"><Button variant="ghost"><Icon><BadgePlus /></Icon>Post</Button></Link>
          </Flex>
          <Button variant="ghost">Settings</Button>
      </Flex>
      <Flex
        as="section"
        position="fixed"
        p={2}
        top="0"
        width="100%"
        justify="flex-end"
        align="center"
        backgroundColor="blue"
        boxShadow="sm" 
        zIndex="999"
      >
        <Link to={`/Profile/${user.username}`}><IconButton variant="ghost"><CircleUserRound></CircleUserRound></IconButton></Link> 
      </Flex>
    </>
  )
}

export default Header
