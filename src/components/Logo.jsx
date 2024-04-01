import React from 'react';
import logoIcon from '../assets/logo-icon.png';

const Logo = ({ collapsed }) => {
    return (
        <div className="logo">
            {collapsed ? (
                <div className="logo-icon">
                    <img src={logoIcon} alt="Logo" />
                </div>
            ) : (
                <div className="logo-text">EscalaCon</div>
            )}
        </div>
    );
};

export default Logo;
