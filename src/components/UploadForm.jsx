import { useState,useEffect } from 'react'
import Header from "@/components/Header.jsx";
import { useNavigate } from "react-router-dom";
import {Button,Flex,FileUpload,Icon,Box,VStack,Input,Textarea,Field} from "@chakra-ui/react"
import { Upload } from 'lucide-react';


 
const UploadForm = () => {

    const[postData, setPostData] = useState({
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



  return (
    <>
      <Header>
      </Header>
       <Flex ml="15%" gap="3rem" pt="5%"  mb="5">
        <VStack width="40%" gap="3">
            <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
                <FileUpload.HiddenInput />
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
            <Field.Root>
                <Field.Label>
                Description <Field.RequiredIndicator />
                </Field.Label>
                <Textarea placeholder="Start typing..." type="description" name="description"  value={postData.description} onChange={handleChange}/>
                <Field.ErrorText>Field is required</Field.ErrorText>
            </Field.Root>
            <Button variant="outline" size="md" rounded="xl">Post</Button>
        </VStack>

            
       </Flex>
    </>

    
  )
}

export default UploadForm