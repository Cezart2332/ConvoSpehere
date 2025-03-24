import { useState } from "react"
import { Flex,Field,Input,InputGroup,Text,Button } from "@chakra-ui/react"
import {AtSign,KeyRound,User} from "lucide-react"
import {Link, useNavigate} from "react-router-dom"

const RegisterForm = () => {
    const navigate = useNavigate()
    const [registerData, setRegisterData] = useState({
        email: "",
        username: "",
        password: ""
      });
    const handleChange = (e) =>{
        setRegisterData({
            ...registerData,
            [e.target.name] : e.target.value
        })
        console.log(e.target.value)
    }
    const handleSumbit = async () => {
        if(!registerData.email || !registerData.username || !registerData.password){
            return alert("All fields are required!");
        }
        try{
            const response = await fetch("http://localhost:5006/api/users",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData)
            })
    
            if(!response.ok){
                throw Error("Network Error")
            }
    
            const data = await response.json()
            console.log(`Succes: ${data}`)
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/Profile")
    
        }
        catch(err){
            console.log(`Failed: ${err}`)
        }
    }
    
    return(
        <Flex width="20%" alignContent="center" flexDirection="column" justify="center" mx="auto" mt="8%" spaceY="4">
            <Field.Root required>
                <Field.Label>
                    Email <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup startElement={  <AtSign size={16} />}>
                    <Input background="gray.900" rounded="lg" type="email" name="email" value={registerData.email} onChange={handleChange} placeholder="Enter your email" />
                </InputGroup>
            </Field.Root>
            <Field.Root required>
                <Field.Label>
                    Username <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup startElement={  <User size={16} />}>
                    <Input background="gray.900" rounded="lg" type="username" name="username" value={registerData.username} onChange={handleChange} placeholder="Enter your username" />
                </InputGroup>
            </Field.Root>
            <Field.Root required>
                <Field.Label>
                    Password <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup startElement={  <KeyRound size={16} />}>
                    <Input type="password" name="password" background="gray.900" rounded="lg" value={registerData.password} onChange={handleChange} placeholder="Enter your password" />
                </InputGroup>
            </Field.Root>
            <Text fontWeight="bold">Have an already an account? <Link to="/Login"><Button size="sm" href="/Login" variant="ghost"> Sign In</Button></Link></Text>
            <Button rounded="2xl" variant="outline" colorPalette="blue" onClick={handleSumbit}>Register</Button>
        </Flex>
    )
}


export default RegisterForm