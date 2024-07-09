// src/components/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Pie, Column } from '@ant-design/charts';
import axios from 'axios';
import { Card, Row, Col } from 'antd';

const Dashboard = () => {
  const [conciliadoresData, setConciliadoresData] = useState([]);
  const [disponibilidadeData, setDisponibilidadeData] = useState([]);

  useEffect(() => {
    fetchConciliadoresData();
    fetchDisponibilidadeData();
  }, []);

  const fetchConciliadoresData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/conciliadores');
      const data = response.data.reduce((acc, conciliador) => {
        const comarca = conciliador.nome_comarca;
        if (!acc[comarca]) {
          acc[comarca] = 0;
        }
        acc[comarca]++;
        return acc;
      }, {});
      const chartData = Object.keys(data).map(key => ({ type: key, value: data[key] }));
      setConciliadoresData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de conciliadores:', error);
    }
  };

  const fetchDisponibilidadeData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/disponibilidades');
      const data = response.data.reduce((acc, disponibilidade) => {
        const diaSemana = disponibilidade.dia_da_semana;
        if (!acc[diaSemana]) {
          acc[diaSemana] = 0;
        }
        acc[diaSemana]++;
        return acc;
      }, {});
      const chartData = Object.keys(data).map(key => ({ day: key, value: data[key] }));
      setDisponibilidadeData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de disponibilidade:', error);
    }
  };

  const conciliadoresConfig = {
    appendPadding: 10,
    data: conciliadoresData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    tooltip: {
      fields: ['type', 'value'],
      formatter: (datum) => {
        return { name: datum.type, value: datum.value };
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 14, textAlign: 'center' },
    },
    legend: false,
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: { title: false, content: { style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis' } } },
  };

  const disponibilidadeConfig = {
    data: disponibilidadeData,
    xField: 'day',
    yField: 'value',
    label: { 
      position: 'middle', 
      style: { fill: '#000000', opacity: 0.8 },
      formatter: (datum) => datum.value,
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { day: { alias: 'Dia da Semana' }, value: { alias: 'Disponibilidade' } },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Quantidade de Conciliadores por Comarca" bordered={false} className="card">
            <Pie {...conciliadoresConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Disponibilidade por Dia da Semana" bordered={false} className="card">
            <Column {...disponibilidadeConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
