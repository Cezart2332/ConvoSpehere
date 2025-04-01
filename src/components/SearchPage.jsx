import React from 'react';
import { useState } from 'react';
import { Button, Flex, Input, InputGroup,HStack,Image,Text,VStack } from "@chakra-ui/react";
import { Search } from 'lucide-react';
import { data, Link } from 'react-router-dom';

const SearchPage = () => {

    const [users, setUsers] = useState([]);

    const handleChange = async (e) => {
        const query = e.target.value;
    
        if (!query.trim()) {
            setUsers([]); // Clear users if the input is empty
            return;
        }
        console.log(query)
        await fetch(`http://localhost:5006/api/users/search/?input=${query}`)
        .then((response) => response.json())
        .then((data) => {
            setUsers(data);
            console.log(data)
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
        });

    };

    const usersToDisplay = users.map(user => {
        const hasPicture = user.profilePhoto != "";
        return (
        <Link to={`/profile/${user.username}`} style={{textDecoration:"none"}}>
            <HStack key={user.id} width="350px" height="50px" cursor="pointer" borderRadius="lg" background="gray.800" transition="0.4s" _hover={{opacity:"0.7"}} alignItems="center" p="2" gap="4">
            <Image width="40px" height="40px" fit="cover" borderRadius="full" src= {hasPicture ? `data:image/jpg;base64,${user.profilePhoto}` : "/src/imgs/3.jpg"}></Image>
            <Flex flexDirection={"column"} alignItems="start">
                <Text fontWeight="semibold">{user.username}</Text>
                <Text fontWeight="light" color="gray" textStyle="sm">{user.firstName} {user.lastName}</Text>
            </Flex>
            </HStack>
        </Link>
        )
})

    if(!usersToDisplay || usersToDisplay.length === 0) {
        return(
          <Flex justifyContent="center" alignItems="center" height="100vh">
            <OrbitProgress color="blue" size="medium" text=""/>
          </Flex>
        )
      }
    return (
        <Flex  ml="12%" mt="5%" width="100%"  flexDirection="column"  mb="5"  mx="auto">
            <Flex alignItems="center" justifyContent="center"spaceY="5" flexDirection="column" width="100%">
                <InputGroup endElement={<Button variant="plain" size="sm"><Search/></Button>} width="30%">
                    <Input variant="subtle" onChange={handleChange} size="sm" placeholder='Enter the username' background="gray.700" borderRadius="lg" _placeholder={{color:"white"}} color="white"/>
                </InputGroup>
                <Flex alignItems="center"  spaceY="5" flexDirection="column" width="100%">
                    {usersToDisplay}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default SearchPage;