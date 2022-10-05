import * as React from 'react';
import { useState } from 'react';
import { useUserContext } from '../Context/userContext';
import Navbar from '../components/Navbar'
import ChatMain from '../components/ChatMain';
import Meta from '../components/Meta';
import { Button, Offcanvas } from 'react-bootstrap';
import ChatOptions from '../components/ChatOptions';
import Account from '../components/Account';
import {FaUsers} from 'react-icons/fa'

function Home() {

    const {windowSize,currentGroupChat} = useUserContext()
    const [showOptions,setShowOptions] = useState(false)
    const [showNavbar,setShowNavbar] = useState(false)

    return ( 
        <div className='d-flex w-100 h-100' style={{
            backgroundColor:'red'
        }}>
            {windowSize>1050 && <Navbar/>}
            <Offcanvas placement='start' show={windowSize<=1050 && showNavbar} onHide={()=>setShowNavbar(false)}>
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body style={{
                    backgroundColor:'#222831'
                }}>
                    <Navbar/>
                </Offcanvas.Body>
            </Offcanvas>
            <ChatMain enableSettings={()=>setShowOptions(!showOptions)}/>

            {windowSize>1550 && <Meta/>}

            <Offcanvas placement='end' show={windowSize<=1550 && showOptions} onHide={()=>setShowOptions(false)}>
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body style={{
                    backgroundColor:'#222831'
                }}>
                    {currentGroupChat && <ChatOptions/>}
                    {!currentGroupChat && <Account/>}
                </Offcanvas.Body>
            </Offcanvas>
            {windowSize<=1050 &&
            <Button
            onClick={()=>setShowNavbar(true)}
            className='position-fixed' style={{
                left:'.5rem',
                bottom:'10%'
            }}>
                <FaUsers/>
            </Button>}
        </div>
     );
}

export default Home;