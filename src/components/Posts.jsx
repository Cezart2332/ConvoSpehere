import { useState } from 'react'
import { Button, Flex,IconButton,Text,SimpleGrid,Image,Box,Icon,Separator, VStack, HStack } from "@chakra-ui/react"
import { User, Heart, MessageCircle, Share } from 'lucide-react';



const Posts = () =>{
    const posts = [
        {
            id:"1",
            user:"Cezar",
            image:"src/imgs/1.jpg",
            likes:"100",
            comms:"10"
        },
        {
            id:"2",
            user:"Cezar",
            image:"src/imgs/2.jpg",
            likes:"200",
            comms:"5"
        }
    ]
    const postItems = posts.map(post => 
        <Flex key={post.id} p={5} flexDirection="column" align="center" justify="center" background="purple.600" rounded="md" boxShadow="sm" >
            <Flex width="100%" justifyContent="space-between">
                <HStack>
                    <Icon size="lg" color="black"><User></User></Icon>
                    <Text textAlign="center" fontWeight="semibold" textStyle="xl" color="black">{post.user}</Text>
                </HStack>
                <Text fontWeight="light" textAlign="center" color="black">2 days ago</Text>
            </Flex>
                <Image 
                    src= {post.image}
                    width="100%" 
                    height="400px" 
                    objectFit="cover" 
                    alt="Post image"
                    overflow="hidden"
                    mt={4}
                    rounded="sm"
                    />
            <Flex width="100%" flexDirection="row" color="black" justify="flex-start" spaceX="4" mt="1">
                <IconButton variant="plain" textAlign="center" fontWeight="light"><Icon><Heart /></Icon>{post.likes}</IconButton>
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><MessageCircle /></Icon>{post.comms}</IconButton>
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><Share /></Icon></IconButton>
            </Flex>
        </Flex>
    )
    return(
        <Flex ml="12%" width="90%" gap="3rem" pt="5%" align="center" justify="center">
            <SimpleGrid columns={1} p="3" gap={5}>
             {postItems}
            </SimpleGrid>
        </Flex>

    )
}





export default Posts