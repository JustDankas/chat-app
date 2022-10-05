import * as React from 'react';
import { useState,useEffect } from 'react';
import { Alert, Button, Col, Container, Row, Stack } from 'react-bootstrap';
import { useUserContext } from '../Context/userContext';
import {AiOutlineUserDelete} from 'react-icons/ai'
import {RiEditBoxLine} from 'react-icons/ri'
import axios from 'axios';

function ChatOptions() {

    const {currentGroupChat,user,updateGroupChat,emitGroupDelete} = useUserContext();
    
    const [groupTitleInput,setGroupTitleInput] = useState('')
    
    const [showAlert,setShowAlert] = useState(false)


    useEffect(()=>{
        if(currentGroupChat){
            setGroupTitleInput(currentGroupChat.groupName)
        }
    },[currentGroupChat])

    // Only letters no symbols etc...
    function handleGroupNameChange(){
        const rgx = new RegExp(/[^a-zA-Z0-9]/,'gi')
        if(groupTitleInput.length>3 && !rgx.test(groupTitleInput)){
            axios.put(`${process.env.REACT_APP_API_URL}/groupChat/groupName`,{
                groupName:groupTitleInput,
                _id:currentGroupChat?._id
            })
            .then(res=>{
                updateGroupChat(res.data)
            }).catch(e=>console.log(e))
        }
    }

    function RemoveMember(userId:string){
        if(userId && currentGroupChat){
            axios.put(`${process.env.REACT_APP_API_URL}/groupChat/${currentGroupChat._id}/members/remove`,{
                userId
            })
            .then(res=>{
                updateGroupChat(res.data)
            }).catch(e=>console.log(e))
        }
    }

    function DeleteGroupChat(){
        if(currentGroupChat){
            const gcId = currentGroupChat._id
            axios.delete(`${process.env.REACT_APP_API_URL}/groupChat/${gcId}`)
            .then(res=>{
                emitGroupDelete(gcId)
            }).catch(e=>console.log(e))
        }
        setShowAlert(false)
    }
    
    return ( 
        <Container style={{
            height:'100%',
            overflow:'hidden'
        }}>
                <div style={{
                    maxHeight:'85%',
                    marginBottom:'5%'
                }}>
                    <h2 style={{
                        color:'#fff'
                    }}>
                        Users
                    </h2>
                    <Stack>
                        {currentGroupChat?.members.map(member=>(
                            <Stack gap={2} direction='horizontal' style={{
                                backgroundColor:'#455d7a',
                                margin:'1rem',
                                padding:'0 1rem',
                                width:'75%',
                                
                            }}>
                                <div style={{
                                    color:'#fff',
                                    fontSize:'1.2rem'
                                }}>{member.username}</div>
                                {currentGroupChat?.admin?._id === user?._id && member._id !== user?._id &&
                                <Button onClick={()=> RemoveMember(member._id)} 
                                style={{
                                    outline:'none',
                                    border:'none',
                                    backgroundColor:'transparent'
                                }}>
                                        <AiOutlineUserDelete style={{
                                        color:'red',
                                        fontSize:'1.2rem'
                                    }}/>
                                </Button>
                            }
                            </Stack>
                        ))}
                    </Stack>
                </div>
                <div>
                    <h2 style={{
                        color:'#fff'
                    }}>
                        Options
                    </h2>
                    <div className='d-flex justify-content-center align-items-center' style={{
                        width:'100%',
                        paddingBottom:'1rem'
                    }}>
                        <input type="text" value={groupTitleInput} onChange={(e)=>setGroupTitleInput(e.target.value)} />
                        <Button onClick={()=>handleGroupNameChange()}
                         style={{
                            outline:'none',
                            border:'none',
                            backgroundColor:'transparent'
                        }}>
                            <RiEditBoxLine/>
                        </Button>
                    </div>
                    {currentGroupChat?.admin?._id === user?._id &&
                        <Button onClick={()=>setShowAlert(true)} 
                    variant='danger' 
                    style={{
                        width:'100%',
                        marginBottom:'1rem'
                    }}>
                        Delete Group Chat
                    </Button>}
                    <Alert show={showAlert} variant='danger'>
                        <div className='d-flex flex-column'>
                            <h4>Are you sure?</h4>
                            <div>
                                <Button onClick={()=> DeleteGroupChat()}>Yes</Button>
                                <Button onClick={()=>setShowAlert(false)}>No</Button>
                            </div>
                        </div>
                    </Alert>
                </div>
        </Container>
     );
}

export default ChatOptions;