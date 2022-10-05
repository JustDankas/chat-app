import axios from 'axios';
import * as React from 'react';
import { useState,useEffect } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import {RiEditBoxLine} from 'react-icons/ri'
import { useUserContext } from '../Context/userContext';
import {GrLogout} from 'react-icons/gr'
import {useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom';

function Account() {

    const {user} = useUserContext()
    const [usernameInput,setUsernameInput] = useState('')
    const [showError,setShowError] = useState<string | null>(null)

    const [cookies,setCookies,removeCookies] = useCookies(['session'])

    const navigate = useNavigate()

    useEffect(()=>{
        if(user){
            setUsernameInput(user.username)
        }
    },[user])

    function handleUsernameChange(){
        if(usernameInput.length>3){
            axios.put(`${process.env.REACT_APP_API_URL}/users/${user?._id}`,{
                newUsername:usernameInput
            })
            .then(res=>{
                // console.log(res.data)
                window.location.reload()
            })
            .catch(e=>setShowError(e.response.data))
        }
    }

    function handleLogout(){
        removeCookies('session')
        window.location.reload()
    }

    return ( 
        <Container>
            <h2 className='text-center' style={{
                color:'#fff'
            }}>
                Account
            </h2>
            <h3 style={{
                color:'#fff'
            }}>Username: </h3>
                    <div className='d-flex justify-content-center align-items-center' style={{
                        width:'100%',
                        paddingBottom:'1rem'
                    }}>
                        <input type="text" value={usernameInput} onChange={(e)=>setUsernameInput(e.target.value)} />
                        <Button onClick={()=>handleUsernameChange()}
                         style={{
                            outline:'none',
                            border:'none',
                            backgroundColor:'transparent'
                        }}>
                            <RiEditBoxLine/>
                        </Button>
                    </div>
                    <Alert onClick={()=>setShowError(null)} show={showError?true:false} variant="warning">
                            <h5>
                                {showError}
                            </h5>
                    </Alert>
                    <Button onClick={()=>handleLogout()}
                    variant='danger' style={{
                        width:'100%'
                    }}>
                        Logout <GrLogout/>
                    </Button>
        </Container>
     );
}

export default Account;