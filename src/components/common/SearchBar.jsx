import React from 'react';
import { Input } from 'antd';
import '../../index.css';

const SearchBar = ({ placeholder, onChange, value }) => {
    return (
        <Input 
            placeholder={placeholder} 
            onChange={onChange} 
            value={value}
            className="search-bar"
        />
    );
};

export default SearchBar;
