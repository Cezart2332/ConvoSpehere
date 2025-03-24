import { useState } from 'react'
import { Button, Flex,IconButton,Text,SimpleGrid,Image,Box,Icon,Separator, VStack, HStack,Tabs } from "@chakra-ui/react"
import { Pencil,StickyNote,MessageCircle,Heart, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Posts from './Posts';



const ProfileInfo = () =>{
    const navigate = useNavigate()
    const posts = [
        {
            id:"1",
            image:"src/imgs/1.jpg",
            likes:"100",
            comms:"10"
        },
        {
            id:"2",
            image:"src/imgs/2.jpg",
            likes:"200",
            comms:"5"
        }
    ]

    const postItems = posts.map(post => 
        <Flex key={post.id} _hover={{opacity:0.5, transition:"all,0.35s"}} cursor="pointer" flexDirection="column" background="purple" rounded="lg" p="2">
            <Image 
                src= {post.image}
                width="100%" 
                height="300px" 
                objectFit="cover" 
                alt="Post image"
                rounded="sm"
            />  
            <Flex width="100%" flexDirection="row" color="black"  justify="flex-start" spaceX="4" mt="1">
                <IconButton variant="plain" textAlign="center" fontWeight="light"><Icon><Heart /></Icon>{post.likes}</IconButton>
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><MessageCircle /></Icon>{post.comms}</IconButton>
            </Flex>
        </Flex>
    )
    const signOut = () =>{
        localStorage.setItem("isLoggedIn","false")
        localStorage.setItem("user", "")
        navigate("/")
    }


    return(
        <Flex ml="12%" gap="3rem" pt="5%" flexDirection="column" mb="5">
            <Flex mt="6%" ml="6%" spaceX="10" align="flex-start">
                <Image
                    src="src/imgs/3.jpg"
                    boxSize="180px"
                    borderRadius="full"
                    mr="5%"
                />
                    <VStack gap="6" align="start" >
                        <HStack gap="4">
                            <Text textStyle="xl" fontWeight="semibold">turliucezar</Text>
                            <Button size="xs" textStyle="sm" rounded="lg" colorPalette="blue" variant="outline"><Pencil></Pencil>Edit your profile</Button>
                            <Button size="xs" textStyle="sm" rounded="lg" colorPalette="red" variant="outline" onClick={signOut}><LogOut></LogOut>Sign out</Button>
                        </HStack>
                        <HStack gap="4">
                            <Text textStyle="lg" fontWeight="semibold">Turliu Cezar</Text>
                            <Box></Box><Text textStyle="lg" fontWeight="semibold">200 followers</Text>
                            <Text textStyle="lg" fontWeight="semibold">100 following</Text>
                        </HStack>
                        <VStack align="start" maxWidth="50%">
                            <Text fontWeight="light" color="gray.500">Description</Text>
                            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt praesentium numquam distinctio, animi inventore architecto unde earum voluptates deleniti. Modi.</Text>
                        </VStack>
                    </VStack>
            </Flex>
            <Tabs.Root defaultValue="posts"  justify="center" mx="auto"  width="80%">
                <Tabs.List>
                    <Tabs.Trigger value="posts">
                       <StickyNote size="16"></StickyNote> Posts
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="posts">
                    <SimpleGrid columns={4} gap={6}>
                        {postItems}
                    </SimpleGrid>
                </Tabs.Content>
            </Tabs.Root>
        </Flex>
        

    )
}





export default ProfileInfo