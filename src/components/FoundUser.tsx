import * as React from 'react';
import { useState } from 'react';
import {Stack,Button, Dropdown, Container, Card} from 'react-bootstrap';
import ProfilePic from './ProfilePic';
import { useUserContext } from '../Context/userContext';
import axios from 'axios';


interface IUser{
    username:string,
    email:string,
    id:string,
    AddUser:(id:string)=>void
}
function FoundUser({username,email,id,AddUser}:IUser) {

    const {user,emitChatCreation} = useUserContext()
    const [showDropbox,setShowDropbox] = useState(false) 
    const [showGroupList,setShowGroupList] = useState(false) 

    function handleRoomCreation(){
        axios.post(`${process.env.REACT_APP_API_URL}/chat`,{member1:user?._id,member2:id})
        .then(res=>{
            emitChatCreation(res.data)
        }).catch(e=>console.log(e))
    }
    return ( 
        <>
        <Dropdown drop='end'>
            <Dropdown.Toggle
            variant='dark' className='d-flex justify-content-start align-items-center'
            style={{
                marginLeft:'1rem',
                marginRight:'1rem',
                width:'10rem'
            }}>
            <ProfilePic/>
            <div className="username-c" style={{
                color:'#fff',
                marginLeft:'1rem'
            }}>
                {username}
            </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>handleRoomCreation()}>Chat</Dropdown.Item>
                <Dropdown.Item onClick={()=>AddUser(id)}>Add to Group</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </>
     );
}

export default FoundUser;