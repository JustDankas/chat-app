import axios from 'axios';
import * as React from 'react';
import { useState,useEffect } from 'react';
import {Form,Button,Card, Alert, ListGroup} from 'react-bootstrap';
import { Link,Navigate,useNavigate } from 'react-router-dom';
import { useUserContext } from '../Context/userContext';
import {TiTickOutline,TiTick} from 'react-icons/ti'

const {Group,Label,Control} = Form
const {Item} = ListGroup

function Register() {

    const {windowSize} = useUserContext();

    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const [conditions,setConditions] = useState([false,false,false,false])
    const [showWarning,setShowWarning] = useState<string | null>(null)

    const navigate = useNavigate()
    const {user,login} = useUserContext()

    function handleRegister(e:React.FormEvent){
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_URL}/users/register`,{
            username,
            email,
            password
        }).then(res=>{
            login(res.data.user)
            navigate('/')
        }).catch(e=>setShowWarning(e.response.data))
        
    }

    useEffect(()=>{
        const numberRgx = new RegExp(/\d/,'g')
        const capsRgx = new RegExp(/[A-Z]/,'g')
        const lowsRgx = new RegExp(/[a-z]/,'g')
        const validation = [false,false,false,false]
        if(password.length>=8){
            validation[0] = true
        }
        if(numberRgx.test(password)){
            validation[1] = true
        }
        if(capsRgx.test(password)){
            validation[2] = true
        }
        if(lowsRgx.test(password)){
            validation[3] = true
        }
        setConditions(validation)
    },[password])

    // if(!user) return <h1>Loading...</h1>
    if(user) return <Navigate to={'/'} />
    return ( 
        <div className='d-flex flex-column align-items-center justify-content-center h-100'>
            <Card style={{
                width:windowSize>1000?'25rem':'100%'
            }}>
                <Card.Header className='text-center'>Register</Card.Header>
                <Form onSubmit={(e)=>handleRegister(e)}>
                    <Group className='mb-4 mt-3' controlId='formUsername'>
                        <Label className='ms-3'>Username</Label>
                        <Control value={username} onChange={(e)=>setUsername(e.target.value)} type='text' placeholder='Enter username' />
                    </Group>
                    <Group className='mb-4' controlId='formEmail'>
                        <Label className='ms-3'>Email Adress</Label>
                        <Control value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Enter your email' />
                    </Group>
                    <Group className='mb-4' controlId='formPassword'>
                        <Label className='ms-3'>Password</Label>
                        <Control value={password} onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Enter a password' />
                    </Group>
                    <Button type='submit' className='m-2'>Register</Button>
                    <p className='m-2'>Already registered? <Link to={'/login'}>Sign in here!</Link></p>
                </Form>
            </Card>
            <ListGroup style={{
                width:windowSize>1000?'25rem':'100%'
            }}>
                <Item style={{
                    backgroundColor:conditions[0]?'#7dd87d':'#fbff7c'
                }}>
                    {!conditions[0]?<TiTickOutline/>:<TiTick/>} Must be atlast 8 characters long
                </Item>
                <Item style={{
                    backgroundColor:conditions[1]?'#7dd87d':'#fbff7c'
                }}>
                    {!conditions[1]?<TiTickOutline/>:<TiTick/>} Must contain atleast one number
                </Item>
                <Item style={{
                    backgroundColor:conditions[2]?'#7dd87d':'#fbff7c'
                }}>
                    {!conditions[2]?<TiTickOutline/>:<TiTick/>} Must contain atleast one capital letter
                </Item>
                <Item style={{
                    backgroundColor:conditions[3]?'#7dd87d':'#fbff7c'
                }}>
                    {!conditions[3]?<TiTickOutline/>:<TiTick/>} Must contain atleast 1 lowercase letter
                </Item>
            </ListGroup>
            <Alert className='text-center' show={showWarning?true:false} variant='warning' style={{
                width:windowSize>1000?'25rem':'100%',
                marginTop:'1rem'
            }}>
                {showWarning}
            </Alert>
        </div>
     );
}

export default Register;