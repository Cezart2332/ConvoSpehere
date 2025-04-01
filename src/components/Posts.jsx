import { useEffect, useState } from 'react'
import { Button, Flex,IconButton,Text,SimpleGrid,Image,Box,Icon,Separator, VStack, HStack } from "@chakra-ui/react"
import { User, Heart, MessageCircle, Share } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {OrbitProgress} from 'react-loading-indicators'




const Posts = () =>{
    const navigate = useNavigate()
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;

    const loggedUser = (() => {
        try {
            const user = localStorage.getItem("user");
            if (!user) {
                console.warn("No user data found in localStorage.");
                return {}; 
            }
            return JSON.parse(user); 
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return {}; 
        }
    })();

    
    const username = loggedUser.username
    const [posts,setPostsData] = useState([])
    const [liked, setLiked] = useState([])

    
    useEffect(() => {

        const getFeed = async () => {
            try {
               await fetch(`http://localhost:5006/api/posts/feed/?username=${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error fetching posts");
                    }
                    return response.json();
                })
                .then(data => {
                    setPostsData(data);
                });                
            } catch (err) {
                console.error('Error fetching posts:', err);
            }
        };
        const getLiked = async () => {
            try {
               await fetch(`http://localhost:5006/api/posts/liked/?username=${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error fetching posts");
                    }
                    return response.json();
                })
                .then(data => {
                    setLiked(data);
                });                
            } catch (err) {
                console.error('Error fetching posts:', err);
            }
        };

        getFeed();
        getLiked();
    }, [isLoggedIn, username]);

    const like = async (postId) =>{
        const response = await fetch("http://localhost:5006/api/posts/like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: postId,username:loggedUser.username})
        })
        if(!response.ok){
            throw Error("Network Error")
        }
        try{
            let data = await response.json()
            setPostsData((prevPosts) => 
                prevPosts.map((post) => {
                   return post.id === postId ? { ...post, likes: post.likes + 1 } : post;
                })
            )
            setLiked((prevLiked) => [...prevLiked, { id: postId }])
            console.log(data)
        }
        catch(err){
            console.log(`Failed: ${err}`)
        }

    }
    
    const unlike = async (postId) =>{
        const response = await fetch("http://localhost:5006/api/posts/unlike", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: postId, username:loggedUser.username})
        })
        if(!response.ok){
            throw Error("Network Error")
        }
        try{
            let data = await response.json()
            setPostsData((prevPosts) => 
                prevPosts.map((post) => {
                   return post.id === postId ? { ...post, likes: post.likes - 1 } : post;
                })
            )
            setLiked((prevLiked) => prevLiked.filter((likedPost) => likedPost.id !== postId))
            console.log(data)
        }
        catch(err){
            console.log(`Failed: ${err}`)
        }

    }

    if (!isLoggedIn) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Text color="red.500" fontSize="lg">
                    You must be logged in to view posts.
                </Text>
            </Flex>
        );
    }
    if(!posts || posts.length === 0) {
        return(
            <Flex justifyContent="center" alignItems="center" height="100vh">
              <OrbitProgress color="blue" size="medium" text="" textColor="" />
            </Flex>
          )
    }

    const postItems = posts.map((post) =>{
        const isLiked = liked.some((likedPost) => likedPost.id === post.id);
        
        return(
            <Flex key={post.id} p={5} flexDirection="column" align="center" justify="center" background="purple.600" rounded="md" boxShadow="sm" >
            <Flex width="100%" justifyContent="space-between">
                <HStack>
                    <Icon size="lg" color="black"><User></User></Icon>
                    <Text textAlign="center" fontWeight="semibold" textStyle="xl" color="black">{post.user}</Text>
                </HStack>
                <Text fontWeight="light" textAlign="center" color="black">2 days ago</Text>
            </Flex>
                <Image 
                    src= {`data:image/jpg;base64,${post.image}`}
                    width="100%" 
                    height="400px" 
                    objectFit="cover" 
                    alt="Post image"
                    overflow="hidden"
                    mt={4}
                    rounded="sm"
                    />
            <Flex width="100%" flexDirection="row" color="black" justify="flex-start" spaceX="4" mt="1">
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><Heart onClick={() => (isLiked ? unlike(post.id) : like(post.id))} color={isLiked ? "red" : "white"} fill={isLiked ? "red" : "none"}/></Icon>{post.likes}</IconButton>
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><MessageCircle /></Icon>{post.comms}</IconButton>
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><Share /></Icon></IconButton>
            </Flex>
        </Flex>
        )
     
        }
    )
    if(!postItems || postItems.length === 0) {
        return(
            <Flex justifyContent="center" alignItems="center" height="100vh">
              <OrbitProgress color="blue" size="medium" text="" textColor="" />
            </Flex>
          )
    }

    return(
        <Flex ml="12%" width="90%" gap="3rem" pt="5%" align="center" justify="center">
            <SimpleGrid columns={1} p="3" gap={5}>
             {postItems}
            </SimpleGrid>
        </Flex>

    )
}





export default Posts