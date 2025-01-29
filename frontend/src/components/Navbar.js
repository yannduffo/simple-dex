import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return(
        <nav class="flex bg-blue-100">
            <div class="flex ml-3 items-center space-x-6">
                <p>SIMPLE-DEX</p>
                <div class="flex">
                    <Link 
                        to="/swap"
                        class={`p-3 transition duration-300 ${
                            location.pathname === "/swap" ? "bg-blue-300" : "hover:bg-blue-200"
                        }`}
                    >Swap</Link>
                    <Link 
                        to="/pool"
                        class={`p-3 transition duration-300 ${
                            location.pathname === "/pool" ? "bg-blue-300" : "hover:bg-blue-200"
                        }`}
                    >Pool</Link>
                    <Link 
                        to='/token'
                        class={`p-3 transition duration-300 ${
                            location.pathname === "/token" ? "bg-blue-300" : "hover:bg-blue-200"
                        }`}
                    >Token(dev)</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;