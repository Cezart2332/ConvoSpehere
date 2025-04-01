import { useEffect, useState } from 'react'
import { Button, Flex,IconButton,Text,SimpleGrid,Image,Box,Icon,Separator, VStack, HStack,Tabs } from "@chakra-ui/react"
import { OrbitProgress } from 'react-loading-indicators'
import { Pencil,StickyNote,MessageCircle,Heart, LogOut, UserRoundPlus } from 'lucide-react';
import { useNavigate,Link } from "react-router-dom";



const ProfileInfo = ({userData}) =>{

    const navigate = useNavigate()
    const username = userData.username
    const loggedUser = JSON.parse(localStorage.getItem("user"))
    const isOwnProfile = loggedUser.username === username
    const [isFollowing, setIsFollowing] = useState(false)
    const hasPicture = userData.profilePhoto != ""
    const[posts,setPostsData] = useState([])
    const[loading,setLoading] = useState(true)

    useEffect(() =>{
        const getData = async () => {
            const response = await fetch("http://localhost:5006/api/posts/getposts",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(username)
            })
            if(!response.ok)
            {
                throw new Error("Eroarea la get");
            }
            try{
                let data = await response.json()
                setPostsData(data)
            }
            catch(err){
                console.log(err)
            }  
        }
        const checkFollowing = async () => {
            const response = await fetch("http://localhost:5006/api/users/isfollowing",{
                 method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username:loggedUser.username, toFollow: username})
            })
            if(!response.ok){
                throw new Error("Eroarea la get");
            }
            try{
                let data = await response.json()
                setIsFollowing(data.isFollowing)
            }
            catch(err){ 
                console.log(err)
            }
            finally{
                setLoading(false)
            }
        }
        getData()
        checkFollowing()
        console.log(isFollowing)
        
    },[username,loggedUser.username])

    const postItems = posts.map(post => 
        <Flex key={post.id} flexWrap="wrap" _hover={{opacity:0.5, transition:"all,0.35s"}} cursor="pointer" flexDirection="column" background="purple" rounded="lg" p="2">
            <Image 
                src= {`data:image/jpg;base64,${post.image}`}
                width="100%" 
                height="300px" 
                objectFit="cover" 
                alt="Post image"
                rounded="sm"
            />  
            <Flex width="100%" flexWrap="wrap" flexDirection="row" color="black"  justify="flex-start" spaceX="4" mt="1">
                <IconButton variant="plain" textAlign="center" fontWeight="light"><Icon><Heart /></Icon>{post.likes}</IconButton>
                <IconButton variant="plain"  textAlign="center" fontWeight="light"><Icon><MessageCircle /></Icon>{post.comments}</IconButton>
            </Flex>
        </Flex>
    )


    const signOut = () =>{
        localStorage.setItem("isLoggedIn","false")
        localStorage.setItem("user", "")
        navigate("/")
    }
    const  follow = async () =>{
        const response = await fetch("http://localhost:5006/api/users/follow",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username:loggedUser.username, toFollow: username})
        })
        if(!response.ok){
            throw new Error("Eroare la follow")
        }
        try {
            let data = response.json();
            console.log(data);
            userData.followers += 1
            loggedUser.following += 1
            localStorage.setItem("user", JSON.stringify(loggedUser))
            console.log(loggedUser.following)
            setIsFollowing(true)
        } catch (err) {
            console.error("Error during follow request:", err);
        }
    }
    const  unfollow = async () =>{
        const response = await fetch("http://localhost:5006/api/users/unfollow",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username:loggedUser.username, toFollow: username})
        })
        if(!response.ok){
            throw new Error("Eroare la follow")
        }
        try {
            let data = response.json();
            console.log(data);
            userData.followers -= 1
            loggedUser.following -= 1
            localStorage.setItem("user", JSON.stringify(loggedUser))
            console.log(loggedUser.following)
            setIsFollowing(false)
        } catch (err) {
            console.error("Error during follow request:", err);
        }
    }

    if(loading){
        return(
            <Flex justifyContent="center" alignItems="center" height="100vh">
            <OrbitProgress color="blue" size="medium" text="" textColor="" />
          </Flex>
        )
    }

    return(
        <Flex ml="12%" gap="3rem" pt="5%" flexDirection="column" mb="5">
            <Flex mt="6%" ml="6%" spaceX="10" align="flex-start">
                <Image
                    src= {hasPicture ? `data:image/jpg;base64,${userData.profilePhoto}` : `/src/imgs/3.jpg`}
                    boxSize="150px"                    
                    borderRadius="full"
                />

                    <VStack gap="3" align="start" >
                        <HStack gap="4">
                            <Text textStyle="xl" fontWeight="semibold">{userData.username}</Text>
                            {isOwnProfile ? (
                                <>
                                    <Link to="/EditProfile"><Button size="xs" textStyle="sm" rounded="lg" colorPalette="blue" variant="outline"><Pencil></Pencil>Edit your profile</Button></Link>
                                    <Button size="xs" textStyle="sm" rounded="lg" colorPalette="red" variant="outline" onClick={signOut}><LogOut></LogOut>Sign out</Button>
                                </>
                                
                            ):
                            (
                            <Button size="xs" textStyle="sm" rounded="lg" colorPalette="purple" variant="outline" onClick={isFollowing ? unfollow : follow}><UserRoundPlus></UserRoundPlus>{isFollowing ? "Unfollow" : "Follow"}</Button>
                        )}
                            
                        </HStack>
                        <HStack gap="4">
                            <Text textStyle="lg" fontWeight="semibold">{userData.firstName} {userData.lastName}</Text>
                            <Box></Box><Text textStyle="lg" fontWeight="semibold">{userData.followers} followers</Text>
                            <Text textStyle="lg" fontWeight="semibold">{userData.following} following</Text>
                        </HStack>
                        <VStack align="start" maxWidth="50%">
                            <Text fontWeight="light" color="gray.500">Description</Text>
                            <Text>{userData.description}</Text>
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