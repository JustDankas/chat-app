import * as React from 'react';
import {AiOutlineUser} from 'react-icons/ai';

function ProfilePic() {
    return ( 
        <div className="d-flex justify-content-center align-items-end"
         style={{
            width:'2.5rem',
            height:'2.5rem',
            borderRadius:'50%',
            // display:'block',
            backgroundColor:'white',
        }}>
            <AiOutlineUser style={{
                fontSize:'2rem',
                color:'black'
            }}/>
        </div>
     );
}

export default ProfilePic;