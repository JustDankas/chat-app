import * as React from 'react';
import { useUserContext } from '../Context/userContext';
import Account from './Account';
import ChatOptions from './ChatOptions';
function Meta() {

    const {currentGroupChat} = useUserContext()


    return ( 
        <div className='h-100' style={{
            backgroundColor:'#222831',
            width:'15%'
            
        }}>
            {currentGroupChat && <ChatOptions/>}
            {!currentGroupChat  &&  <Account/>}
            
        </div>
     );
}

export default Meta;