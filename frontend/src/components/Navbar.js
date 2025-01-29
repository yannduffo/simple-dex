import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return(
        <nav class="flex bg-slate-100">
            <div class="flex ml-3 items-center space-x-6">
                <p class="font-semibold" >SIMPLE-DEX</p>
                <div class="flex">
                    <Link 
                        to="/swap"
                        class={`p-3 transition duration-300 ${
                            location.pathname === "/swap" ? "bg-slate-300" : "hover:bg-slate-200"
                        }`}
                    >Swap</Link>
                    <Link 
                        to="/pool"
                        class={`p-3 transition duration-300 ${
                            location.pathname === "/pool" ? "bg-slate-300" : "hover:bg-slate-200"
                        }`}
                    >Pool</Link>
                    <Link 
                        to='/token'
                        class={`p-3 transition duration-300 ${
                            location.pathname === "/token" ? "bg-slate-300" : "hover:bg-slate-200"
                        }`}
                    >Token(dev)</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;