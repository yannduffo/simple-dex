import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return(
        <nav>
            <Link to="/swap">Swap</Link>
            <Link to="/pool">Pool</Link>
            <Link to='/token'>Token(dev)</Link>
        </nav>
    );
};

export default Navbar;