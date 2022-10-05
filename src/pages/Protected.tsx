import * as React from 'react';
import { Component } from 'react';
import { useUserContext } from '../Context/userContext';
import {Outlet,Navigate} from 'react-router-dom';

function Protected() {

    const {user,isFetching} = useUserContext()
    if(isFetching) return <h1>Loading...</h1>

    return ( 
        user!=null?<Outlet/>:<Navigate to={'/login'} />
     );
}

export default Protected;