import React from 'react';
import { Row, Col } from 'antd';
import SearchBar from './SearchBar';

const HeaderSection = ({ title, onSearch, searchText, children }) => {
    return (
        <div style={{ marginBottom: 24, padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <Row gutter={16} align="middle">
                <Col span={8}>
                    <h2 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#333' }}>{title}</h2>
                </Col>
                <Col span={10}>
                    <SearchBar placeholder="Buscar..." onChange={onSearch} value={searchText} />
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    {children}
                </Col>
            </Row>
        </div>
    );
};

export default HeaderSection;
