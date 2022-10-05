import * as React from 'react';
import { useState,useEffect } from 'react';
import { Container, Stack,Button } from 'react-bootstrap';
import Message from './Message';
import { useUserContext } from '../Context/userContext';
import axios from 'axios';
import {BiSend} from 'react-icons/bi';
import {BsThreeDotsVertical} from 'react-icons/bs'
import {SiSublimetext} from 'react-icons/si'

interface IChatMain{
    enableSettings:()=>void
}
function ChatMain({enableSettings}:IChatMain) {

    const {user,currentChat,messages,emitMessage,deleteCurrentChat} = useUserContext();

    const [textInput,setTextInput] = useState('');
    const cardElement = React.useRef<HTMLDivElement>(null)

    useEffect(()=>{
        cardElement.current?.scrollBy({
            top:cardElement.current.scrollHeight,
            behavior:'smooth'
        })
    },[messages])

    function sendMessage(){
        if(textInput.length>0){

            axios.post(`${process.env.REACT_APP_API_URL}/message`,{
                content:textInput,
                sender:user,
                chatId:currentChat
            })
            .then(res=>{
                emitMessage(res.data)
            })
            .catch(e=>console.log(e))
            setTextInput('')
        }
    }

    function handleKeyDown(event:React.KeyboardEvent){
        if(event.key==='Enter'){
            sendMessage()
        }
    }

    return ( 
        <div className='h-100 d-flex flex-column' style={{
            backgroundColor:'#393e46',
            width:'100%',
            position:'relative'
        }}>
            <Container ref={cardElement} style={{
                marginBottom:'2rem',
                overflowY:'scroll',
                height:'100%'
                }}>
                <Stack gap={1} style={{
                    paddingBottom:'2rem'
                }}>
                    {messages?.map((msg,index)=>(
                        <Message key={index}
                        sender={msg.sender.username}
                        message={msg.content}
                        own={user?._id===msg.sender._id}
                        updatedAt={toReadableDate(msg.updatedAt)}
                        />
                    ))}
                </Stack>
                
            </Container>

            {currentChat &&
                <div className='d-flex' style={{
                // width:'100%'
            }}>
                <input value={textInput} onChange={e=>setTextInput(e.target.value)} 
                onKeyDown={(e)=>handleKeyDown(e)} type="text" placeholder='Send something...'
                style={{
                    width:'100%'
                }} />
                <Button onClick={()=>sendMessage()}
                    style={{
                        backgroundColor:'transparent',
                        outline:'none',
                        border:'none',

                    }}>
                    <BiSend/>
                </Button>
                <Button
                onClick={()=>enableSettings()}
                    style={{
                        backgroundColor:'transparent',
                        outline:'none',
                        border:'none',

                    }}>
                        <BsThreeDotsVertical/>
                </Button>
            </div>}

            {!currentChat && 
            <h1 className='d-flex align-items-center justify-content-center' style={{
                color:'#fff',
                fontSize:'3.5rem',
                position:'absolute',
                width:'100%',
                height:'100%',
                left:0,
            }}>Chattr</h1>}
            
        </div>
     );
}

function toReadableDate(date:Date){
    const tmp = new Date(date)
    // return `${formatTime(day+1)}-${formatTime(month+1)}-${year} ${formatTime(hours)}:${formatTime(minutes)} ${hours>12?'pm':'am'}`
    return `${tmp}`
}

function formatTime(number:number){
    return number<10?'0'+number.toString():number.toString()
}

export default ChatMain;