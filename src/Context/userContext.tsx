import axios from 'axios'
import {createContext,ReactNode,useContext, useEffect, useRef, useState} from 'react'
import io, { Socket } from 'socket.io-client';

type IUser = {
    username:string,
    email:string,
    _id:string
}

type IMessage = {
    chatId:string,
    sender:{
        username:string,
        email:string,
        _id:string
    },
    content:string,
    _id:string,
    createdAt:Date,
    updatedAt:Date,

}

interface IChat{
    _id:string,
    members:IUser[]
}

interface IGroupChat{
    _id:string,
    members:IUser[],
    admin:IUser,
    groupName:string
}

type userProviderProps = {
    children: ReactNode
}

type UserContextProps = {
    user:null | IUser | undefined,
    messages:IMessage[],
    currentChat:string | null,
    chats:IChat[],
    groupChats:IGroupChat[],
    isFetching:boolean,
    currentGroupChat:IGroupChat | null,
    windowSize:number,
    login:(user:IUser)=>void,
    getMessages:(chatId:string)=>void,
    emitMessage:(msg:IMessage)=>void,
    emitChatCreation:(newChat:IChat)=>void,
    emitGroupDelete:(groupId:string)=>void,
    deleteCurrentChat:()=>void,
    updateGroupChat:(groupChatTMP:IGroupChat)=>void,
    addGroupChat:(gc:IGroupChat)=>void
}

const UserContext = createContext({} as UserContextProps)

export function useUserContext(){
    return useContext(UserContext)
}

export function UserProvider({children}:userProviderProps){

    const socket = useRef<Socket>()

    const [user,setUser] = useState<IUser | null | undefined>(undefined)
    const [messages,setMessages] = useState<IMessage[]>([])
    const [currentChat,setCurrentChat] = useState<string | null>(null)
    const [currentGroupChat,setCurrentGroupChat] = useState<IGroupChat | null>(null)

    const [chats,setChats] = useState<IChat[]>([])
    const [groupChats,setGroupChats] = useState<IGroupChat[]>([])

    const [newMessage,setNewMessage] = useState<IMessage | null>(null)
    const [fromChatId,setFromChatId] = useState<string | null>(null)

    const [newChat,setNewChat] = useState<IChat | null>(null)
    const [newGroupChat,setNewGroupChat] = useState<IGroupChat | null>(null)
    const [removeGroupChat,setRemoveGroupChat] = useState<string | null>(null)
    
    const [windowSize,setWindowSize] = useState(window.innerWidth)

    const [isFetching,setIsFetching] = useState(true)

    useEffect(():(()=>void)=>{
        socket.current = io('http://localhost:5000')
        socket.current.on("receive-msg",(msg:IMessage,chatId:string)=>{

            setNewMessage(msg)
            setFromChatId(chatId)
        })
        socket.current.on('get-new-chat',(chat:IChat)=>{
            console.log('Forsen: ',chat)
            setNewChat(chat)
        })
        socket.current.on('update-group-chat',(groupChatTMP:IGroupChat)=>{
            setNewGroupChat(groupChatTMP)
        })
        socket.current.on('group-chat-deleted',(groupId:string)=>{
            setRemoveGroupChat(groupId)
        })
        return () => socket.current?.disconnect();
    },[user])

    useEffect(()=>{
        if(chats){
            chats.forEach(chat=>{
                socket.current?.emit('join-chat',chat._id)
            })
        }
    },[chats])

    useEffect(()=>{
        if(groupChats){
            groupChats.forEach(chat=>{
                socket.current?.emit('join-chat',chat._id)
            })
        }
    },[groupChats])

    useEffect(()=>{
        if(newMessage && fromChatId){
            if(fromChatId === currentChat){
                const msgs = [...messages,newMessage]
                setMessages(msgs)
            }
            else{
                console.log('Frozen: ')
            }
        }
    },[newMessage])

    useEffect(()=>{
        if(newChat){
            const tmp = [...chats,newChat]
            setChats(tmp)
        }
    },[newChat])

    useEffect(()=>{
        if(newGroupChat){

            // User was removed from group chat
            if(newGroupChat.members.filter(member=>member._id===user?._id).length === 0){
                const gcs = [...groupChats].filter(gc=>gc._id!==newGroupChat._id)
                setGroupChats(gcs)
                if(newGroupChat._id===currentGroupChat?._id){
                    setCurrentChat(null)
                    setCurrentGroupChat(null)
                }
            }
            // Something else got updated
            else{
                const gcs = [...groupChats].map(gc=>{
                    if(gc._id===newGroupChat._id){
                        return newGroupChat
                    }
                    return gc
                })
                setGroupChats(gcs)
                if(newGroupChat._id===currentGroupChat?._id){
                    setCurrentGroupChat(newGroupChat)
                }
            }

        }
    },[newGroupChat])

    useEffect(()=>{
        if(removeGroupChat){
            const gcs = [...groupChats].filter(gc=>gc._id!==removeGroupChat)
            setGroupChats(gcs)
            setCurrentGroupChat(null)
        }
    },[removeGroupChat])

    // Window Size

    useEffect(()=>{
        window.addEventListener('resize',changeWindowSize)
        return ()=> window.removeEventListener('resize',changeWindowSize)
    },[])

    function changeWindowSize(){
        setWindowSize(window.innerWidth)
    }

    // useEffect(()=>{
    //     if(currentChat){
    //         socket.current?.emit('join-chat',currentChat)
    //     }
    // },[currentChat])

    useEffect(()=>{
        if(currentChat){
            axios.get(`${process.env.REACT_APP_API_URL}/groupChat/members/${currentChat}`)
            .then(res=>{
                setCurrentGroupChat(res.data)
            }).catch(e=>setCurrentGroupChat(null))
        }
    },[currentChat])

    // Fetch chats and group chats ///////////////////////
    useEffect(()=>{
        if(user){
            axios.get(`${process.env.REACT_APP_API_URL}/chat/${user?._id}`)
            .then(res=>{
                setChats(res.data)
            }).catch(e=>console.log(e))
        }
    },[user])

    useEffect(()=>{
        if(user){
            axios.get(`${process.env.REACT_APP_API_URL}/groupChat/${user?._id}`)
            .then(res=>{
                setGroupChats(res.data)
            }).catch(e=>console.log(e))
        }
    },[user])

    ///////////////////////////////////////////////////

    function emitMessage(msg:IMessage){
        if(currentChat){
            socket.current?.emit('send-msg',msg,currentChat,(cbMsg:string)=>{
                setNewMessage(msg)
                setFromChatId(currentChat)
            })
        }
    }

    function emitChatCreation(tmpChat:IChat){
        socket.current?.emit('new-chat',tmpChat,()=>{
            setNewChat(tmpChat)
        })
    }

    function emitGroupDelete(groupId:string){
        socket.current?.emit('group-chat-delete',groupId,()=>{
            const gcs = [...groupChats].filter(gc=>gc._id!==groupId)
            setGroupChats(gcs)
            setCurrentGroupChat(null)
        })
    }

    function login(userObj:IUser){
        setUser(userObj)
    }

    function updateGroupChat(groupChatTMP:IGroupChat){
        socket.current?.emit('group-chat-change',groupChatTMP,()=>{
            console.log('WORKRORK')
            setNewGroupChat(groupChatTMP)
        })
    }

    // useEffect(()=>{

    // },[])

    function deleteCurrentChat(){
        axios.delete(`${process.env.REACT_APP_API_URL}/chat/${currentChat}`,{})
        .then(res=>{
            setCurrentChat(null)
        }).catch(e=>console.log(e))
    }

    function getMessages(chatId:string){
        if(user){
            axios.get(`${process.env.REACT_APP_API_URL}/message/${chatId}`)
            .then(res=>{
                setMessages(res.data)
                setCurrentChat(chatId)
            }).catch(e=>console.log(e))
        }
    }

    function addGroupChat(gc:IGroupChat){
        const gcs = [...groupChats,gc]
        setGroupChats(gcs)
    }

    // Fetching data?
    useEffect(()=>{
        if(user!==undefined) {
            setIsFetching(false)
            if(user){
                socket.current?.emit('login',user)
            }
        }
    },[user])

    // Cookie exists ? login!
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/users/login`)
        .then(res=>{
            setUser(res.data.user)
        }).catch(e=>{
            console.log(e)
            setUser(null)
        })
    },[])

    return (
        <UserContext.Provider value={{
            user,isFetching,messages,currentGroupChat,currentChat,chats,groupChats,windowSize,
            login,getMessages,emitMessage,emitChatCreation,deleteCurrentChat,updateGroupChat,emitGroupDelete,addGroupChat}}>
            {children}
        </UserContext.Provider>
    )
}