import { useState } from "react"
import { Flex,Field,Input,InputGroup,Text,Button } from "@chakra-ui/react"
import {AtSign,KeyRound,User} from "lucide-react"
import {Link, useNavigate} from "react-router-dom"


const LoginForm = () => {
    const navigate = useNavigate()
    const [loginData, setloginData] = useState({
        email: "",
        password: ""
      });
    const handleChange = (e) =>{
        setloginData({
            ...loginData,
            [e.target.name] : e.target.value
        })
        console.log(e.target.value)
    }
    const handleSumbit = async () => {
        if(!loginData.email  || !loginData.password){
            return alert("All fields are required!");
        }
        try{
            const response = await fetch("http://localhost:5006/api/users/login",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
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
                    <Input background="gray.900" rounded="lg" type="email" name="email" value={loginData.email} onChange={handleChange} placeholder="Enter your email" />
                </InputGroup>
            </Field.Root>
            <Field.Root required>
                <Field.Label>
                Password <Field.RequiredIndicator />
            </Field.Label>
                <InputGroup startElement={  <KeyRound size={16} />}>
                    <Input type="password" name="password" background="gray.900" rounded="lg" value={loginData.password} onChange={handleChange} placeholder="Enter your password" />
                </InputGroup>
            </Field.Root>
           <Text fontWeight="bold">Don't have an account?  <Link to="/Register"><Button size="sm" href="/Register" variant="ghost"> Sign Up</Button></Link></Text>
            <Button rounded="2xl" variant="outline" colorPalette="blue" onClick={handleSumbit}>Login</Button>
        </Flex>
    )
}


export default LoginForm