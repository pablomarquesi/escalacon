import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ collapsed }) => {
  return (
    <div className="logo">
      {!collapsed && (
        <div className="logo-text">
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            EscalaCon
          </Link>
        </div>
      )}
    </div>
  );
};

export default Logo;
