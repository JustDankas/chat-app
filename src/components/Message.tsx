import * as React from 'react';
import {Card} from 'react-bootstrap';
import { useUserContext } from '../Context/userContext';
import ProfilePic from './ProfilePic';

interface IMessage{
    sender:string,
    message:string,
    own?:boolean,
    updatedAt:any
}

function Message({sender,message,own,updatedAt}:IMessage) {

    const {windowSize} = useUserContext()

    return ( 
        <div className={'d-flex align-items-center justify-content-start'} 
        style={{
            marginTop:'2rem',
            flexDirection:own?'row':'row-reverse'
        }}>
            <ProfilePic/>
            <Card style={{
                width:windowSize<1250?'40%':'25rem',
                minHeight:'5rem',
                margin:'0 1rem',
                borderBottomLeftRadius:own?'0rem':'',
                borderBottomRightRadius:own?'':'0rem'
            }}>
                <Card.Title>{sender}</Card.Title>
                <Card.Body>
                    {message}
                </Card.Body>
                <Card.Footer>
                    {updatedAt}
                </Card.Footer>
            </Card>
        </div>
     );
}

export default Message;