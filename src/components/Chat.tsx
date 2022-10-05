import * as React from 'react';
import { Component } from 'react';
import {Stack,Button} from 'react-bootstrap';
import ProfilePic from './ProfilePic';
import { useUserContext } from '../Context/userContext';
import axios from 'axios';
import {FiDelete} from 'react-icons/fi';

interface IChat{
    chatName:string,
    chatId:string
}
function Chat({chatName,chatId}:IChat) {

    const {user,getMessages} = useUserContext()

    function joinChat(){
        // socket.emit('join-chat',chatId)
        getMessages(chatId)
    }

    return ( 
        <Button onClick={()=>joinChat()}
         variant='dark' className='d-flex justify-content-start align-items-center'
         style={{
            marginLeft:'1rem',
            marginRight:'1rem',
            position:'relative',
        }}>
        <ProfilePic/>
        <div className="username-c" style={{
            color:'#fff',
            marginLeft:'1rem'
        }}>
            {chatName}
        </div>
        </Button>
     );
}

export default Chat;