import { useState,useEffect } from 'react'
import Header from "@/components/Header.jsx";
import { useNavigate } from "react-router-dom";
import {Button,Flex,FileUpload,Icon,Box,VStack,Input,Textarea,Field} from "@chakra-ui/react"
import { Upload } from 'lucide-react';


 
const Edit = () => {

    const user =  JSON.parse(localStorage.getItem("user"))

    const[editData, setEditData] = useState({
        username:user.username,
        firstName:"",
        lastName:"",
        profilePhoto:"",
        description:"",

    })

    const handleChange = (e) =>{
        setEditData({
            ...editData,
            [e.target.name] : e.target.value
        })
        console.log(e.target.value)
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({
                    ...editData,
                    profilePhoto: reader.result 
                });
                console.log(reader.result)
            };
            reader.readAsDataURL(file); 
        }
    };

    const handleSumbit = async (e) => {
        const response = await fetch("http://localhost:5006/api/users/editprofiledata",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editData)
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
            <FileUpload.Root>
                <FileUpload.HiddenInput onChange={handleFileChange} />
                <FileUpload.Trigger asChild>
                    <Button variant="outline" size="sm">
                    <Upload /> Upload Profile Picture
                    </Button>
                </FileUpload.Trigger>
                <FileUpload.List />
            </FileUpload.Root>
            <Field.Root>
                <Field.Label>
                First Name <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="First Name" size="sm" type="firstName" name="firstName"  value={editData.firstName} onChange={handleChange}/>
                <Field.ErrorText>Field is required</Field.ErrorText>
            </Field.Root>
            <Field.Root>
                <Field.Label>
                Description <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="Last Name" size="sm" type="lastName" name="lastName"  value={editData.lastName} onChange={handleChange}/>
                <Field.ErrorText>Field is required</Field.ErrorText>
            </Field.Root>
            <Field.Root>
                <Field.Label>
                Description <Field.RequiredIndicator />
                </Field.Label>
                <Textarea placeholder="Start typing..." type="description" name="description"  value={editData.description} onChange={handleChange}/>
                <Field.ErrorText>Field is required</Field.ErrorText>
            </Field.Root>
            <Button variant="outline" size="md" rounded="xl" onClick={handleSumbit}>Edit</Button>
        </VStack>

            
       </Flex>
    </>

    
  )
}

export default Edit