import React from 'react';
import { BorderLeftOutlined } from '@ant-design/icons';

const Logo = ({ collapsed }) => {
    return (
        <div className="logo">
            {collapsed ? (
                <div className="logo-icon">
                 <BorderLeftOutlined />
                </div>
            ) : (
                <div className="logo-text">EscalaCon</div>
            )}
        </div>
    );
};

export default Logo;
