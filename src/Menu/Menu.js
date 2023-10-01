import React from 'react';

import {
  Link
} from "react-router-dom";


function Menu() {
  return (
    <div className="menu">
      <nav>
        <ul>
          <li><Link to="/" tabIndex="1">Homepage</Link></li>
          <li><Link to="/about" title="Learn more about Personal Budget App" tabIndex="2">About</Link></li>
          <li><Link to="/login" title="Login to Personal Budget App" tabIndex="3">Login</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
