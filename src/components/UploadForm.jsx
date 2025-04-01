import { useState,useEffect } from 'react'
import Header from "@/components/Header.jsx";
import { useNavigate } from "react-router-dom";
import {Button,Flex,FileUpload,Icon,Box,VStack,Input,Textarea,Field} from "@chakra-ui/react"
import { Upload } from 'lucide-react';


 
const UploadForm = () => {

    const user =  JSON.parse(localStorage.getItem("user"))

    const[postData, setPostData] = useState({
        email:`${user.email}`,
        image:"",
        description:""
    })

    const handleChange = (e) =>{
        setPostData({
            ...postData,
            [e.target.name] : e.target.value
        })
        console.log(e.target.value)
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostData({
                    ...postData,
                    image: reader.result 
                });
            };
            reader.readAsDataURL(file); 
        }
    };

    const handleSumbit = async (e) => {
        const response = await fetch("http://localhost:5006/api/posts/upload",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData)
        })

        if(!response.ok){
            throw Error("Network Error")
        }
        try{
            let data = await response.json()
            console.log(data)
        }catch(err){
            console.log(`Error ${err}`)
        }
    }



  return (
    <>
      <Header>
      </Header>
       <Flex ml="15%" gap="3rem" pt="5%"  mb="5">
        <VStack width="40%" gap="3">
            <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                <FileUpload.HiddenInput onChange={handleFileChange} />
                <FileUpload.Dropzone>
                    <Icon size="md" color="fg.muted">
                        <Upload></Upload>
                    </Icon>
                    <FileUpload.DropzoneContent>
                    <Box>Drag and drop photo here</Box>
                    <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                <FileUpload.List />
            </FileUpload.Root>
            {postData.image && (
                <Box mt="3">
                    <img src={postData.image} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                </Box>
            )}
            <Field.Root>
                <Field.Label>
                Description <Field.RequiredIndicator />
                </Field.Label>
                <Textarea placeholder="Start typing..." type="description" name="description"  value={postData.description} onChange={handleChange}/>
                <Field.ErrorText>Field is required</Field.ErrorText>
            </Field.Root>
            <Button variant="outline" size="md" rounded="xl" onClick={handleSumbit}>Post</Button>
        </VStack>
        

            
       </Flex>
    </>

    
  )
}

export default UploadForm