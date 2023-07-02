import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default function ProtectedRoute(props) {

    if (sessionStorage.getItem('admin')) {
        if(props.component == 'Navbar')
        {
            return (<Route> <props.component /> </Route>)
        }
        return (<Route path={props.path}> <props.component /> </Route>)
    }
    else {
        return (<Redirect to='/SignIn' />)
    }
}
