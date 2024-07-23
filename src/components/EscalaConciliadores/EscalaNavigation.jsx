import React from 'react';
import { Row, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const EscalaNavigation = ({ mes, ano, handlePrevMonth, handleNextMonth }) => (
    <Row justify="center" align="middle" style={{ marginBottom: 20 }}>
        <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
        <h3 style={{ margin: '0 10px' }}>{`${meses[mes - 1]} ${ano}`}</h3>
        <Button icon={<RightOutlined />} onClick={handleNextMonth} />
    </Row>
);

export default EscalaNavigation;
