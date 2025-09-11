import React from 'react';
import { Navigate } from 'react-router-dom';

function Logout({ setAuth }) {
    const handleLogout = async () => {
        await fetch("http://localhost:8080/api/users/logout", {
            method: "POST",
            credentials: "include"
        });
        setAuth(null);
    };

    return (
        <>
            
            <a href='/'><button onClick={handleLogout}>Logout</button></a>
        </>
    );
}

export default Logout;