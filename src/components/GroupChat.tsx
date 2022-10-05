import * as React from 'react';
import { Component } from 'react';
import { Button } from 'react-bootstrap';
import { useUserContext } from '../Context/userContext';
import ProfilePic from './ProfilePic';


interface IGroupChat{
    groupName:string,
    groupId:string,
}

function GroupChat({groupName,groupId}:IGroupChat) {

    const {getMessages} = useUserContext();

    function joinChat(){
        getMessages(groupId)
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
            {groupName}
        </div>
        </Button>
     );
}

export default GroupChat;