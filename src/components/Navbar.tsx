import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import {Stack,Offcanvas, Button, Container} from 'react-bootstrap';
import { useUserContext } from '../Context/userContext';
import Chat from './Chat';
import FoundUser from './FoundUser';
import GroupChat from './GroupChat';

interface IUser{
    username:string,
    email:string,
    _id:string
}

function Navbar() {

    const {user,chats,groupChats,addGroupChat,updateGroupChat} = useUserContext()

    const [foundUsers,setFoundUsers] = useState<IUser[]>([])


    const [findUser,setFindUser] = useState<string>('')
    const [showCanvas,setShowCanvas] = useState(false)
    const [addUser,setAddUser] = useState<string | null>(null)

    function handleGroupCreate(){
        axios.post('/groupChat',{
            creator:user
        }).then(res=>{
            addGroupChat(res.data)
        }).catch(e=>console.log(e))
    }

    function handleUserSearch(e:React.KeyboardEvent){
        if(e.key==='Enter' && findUser.length > 2){
            axios.post(`/users/find`,{
                requester: user?.username,
                searchTerm: findUser
            })
            .then(res=>{
                setFoundUsers(res.data.users)
                setShowCanvas(true)
            }).catch(e=>{
                console.log(e)
            })
        }
    }

    function handleAddUserToGroupChat(groupChatId:string){
        if(addUser && groupChatId){
            axios.put(`/groupChat/${groupChatId}/members/add`,{
                userId:addUser
            })
            .then(res=>{
                console.log(res.data)
                updateGroupChat(res.data)
            }).catch(e=>console.log(e))
            setAddUser(null)
        }
    }

    return ( 
        <div className='h-100 d-flex flex-column' style={{
            backgroundColor:'#222831',
            width:'20rem'
        }}>

        <Stack gap={3} style={{
            height:'100%',
            marginBottom:'2rem'
        }}>
            <h1 className='text-center' style={{color:'#fff'}}>Chattr</h1>
            <input value={findUser} onChange={(e)=>setFindUser(e.target.value)} onKeyDown={(e)=>handleUserSearch(e)} type="text" placeholder='Find a user...' />
            <h3 className='ms-2' style={{color:'#fff'}}>Chats :</h3>
            {chats.map((chat,index)=>(
                <Chat key={chat._id} chatId={chat._id} chatName={chat.members.filter(usr=>usr.username!==user?.username)[0].username} />
            ))}
            <h3 className='ms-2' style={{color:'#fff'}}>Group Chats :</h3>
            {groupChats.map((group,index)=>(
                <GroupChat key={group._id} groupId={group._id} groupName={group.groupName} />
            ))}
        </Stack>
        <Offcanvas show={showCanvas} onHide={()=>setShowCanvas(false)} >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Results for {findUser}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {foundUsers.map(user=>(
                        <FoundUser key={user._id} id={user._id} username={user.username} email={user.email}
                        AddUser={(id:string)=>setAddUser(id)}
                        />
                    ))}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
        <Button onClick={()=>handleGroupCreate()}>
            Create group chat
        </Button>
        {addUser &&
        <Container style={{
            position:'fixed',
            overflowY:'scroll',
            width:'50%',
            left:'25%',
            top:'10%',
            zIndex:'10000'
        }}>
            <Stack gap={2} style={{
                backgroundColor:'black',
                padding:'1rem',
                maxHeight:'75%',
                borderRadius:'5px'
            }}>
                <Button onClick={()=>setAddUser(null)}>
                    X
                </Button>
                {groupChats.map(gc=>(
                    <Button variant='light' onClick={()=>handleAddUserToGroupChat(gc._id)} >
                        {gc.groupName}
                    </Button>
                ))}
            </Stack>

        </Container>}
        </div>
     );
}

export default Navbar;