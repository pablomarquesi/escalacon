import React, { useEffect, useState } from 'react';
import { Pie, Column } from '@ant-design/charts';
import axios from 'axios';
import { Card, Row, Col } from 'antd';

const Dashboard = () => {
  const [salasPorJuizadoData, setSalasPorJuizadoData] = useState([]);
  const [disponibilidadeData, setDisponibilidadeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [totalConciliadores, setTotalConciliadores] = useState(0);
  const [totalSalasVirtuais, setTotalSalasVirtuais] = useState(0);
  const [totalJuizados, setTotalJuizados] = useState(0);
  const [totalConciliadoresDisponiveis, setTotalConciliadoresDisponiveis] = useState(0);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    fetchSalasPorJuizadoData();
    fetchDisponibilidadeData();
    fetchStatusData();
    fetchTotalConciliadores();
    fetchTotalSalasVirtuais();
    fetchTotalJuizados();
    fetchTotalConciliadoresDisponiveis();
  }, [filter]);

  const fetchSalasPorJuizadoData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/salasvirtuais', { params: { filter } });
      const data = response.data.reduce((acc, sala) => {
        const juizado = sala.nome_juizado;
        if (!acc[juizado]) {
          acc[juizado] = 0;
        }
        acc[juizado]++;
        return acc;
      }, {});
      const chartData = Object.keys(data).map(key => ({ juizado: key, value: data[key] }));
      setSalasPorJuizadoData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de salas por juizado:', error);
    }
  };

  const fetchDisponibilidadeData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/disponibilidades', { params: { filter } });
      const data = response.data.reduce((acc, disponibilidade) => {
        const dias = disponibilidade.dias_da_semana.split(',');
        dias.forEach(dia => {
          if (!acc[dia]) {
            acc[dia] = 0;
          }
          acc[dia]++;
        });
        return acc;
      }, {});

      const orderedDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
      const chartData = orderedDays.map(day => ({
        day,
        value: data[day] || 0
      }));
      
      setDisponibilidadeData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de disponibilidade:', error);
    }
  };

  const fetchStatusData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/disponibilidades', { params: { filter } });
      const data = response.data.reduce((acc, disponibilidade) => {
        const status = disponibilidade.nome_status || 'Sem Status';
        if (!acc[status]) {
          acc[status] = 0;
        }
        acc[status]++;
        return acc;
      }, {});

      const chartData = Object.keys(data).map(key => ({ status: key, value: data[key] }));
      setStatusData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de status:', error);
    }
  };

  const fetchTotalConciliadores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/conciliadores', { params: { filter } });
      setTotalConciliadores(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar total de conciliadores:', error);
    }
  };

  const fetchTotalSalasVirtuais = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/salasvirtuais', { params: { filter } });
      setTotalSalasVirtuais(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar total de salas virtuais:', error);
    }
  };

  const fetchTotalJuizados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/juizados', { params: { filter } });
      setTotalJuizados(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar total de juizados:', error);
    }
  };

  const fetchTotalConciliadoresDisponiveis = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/disponibilidades', { params: { filter } });
      const conciliadoresIds = new Set(response.data.map(d => d.conciliador_id));
      setTotalConciliadoresDisponiveis(conciliadoresIds.size);
    } catch (error) {
      console.error('Erro ao buscar total de conciliadores disponíveis:', error);
    }
  };

  const handleCardClick = (type) => {
    setFilter(type);
  };

  const salasPorJuizadoConfig = {
    appendPadding: 10,
    data: salasPorJuizadoData,
    angleField: 'value',
    colorField: 'juizado',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 12, textAlign: 'center' },
    },
    tooltip: {
      fields: ['juizado', 'value'],
      formatter: datum => ({ name: datum.juizado, value: datum.value }),
    },
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
      formatter: datum => datum.value,
    },
    xAxis: {
      label: { autoHide: true, autoRotate: false },
    },
    meta: {
      day: { alias: 'Dia da Semana' },
      value: { alias: 'Disponibilidade' },
    },
    height: 400, // Aumentar a altura das barras
    columnWidthRatio: 0.8,
    barWidthRatio: 0.8, // Aumentar a largura das barras
  };

  const statusConfig = {
    appendPadding: 10,
    data: statusData,
    angleField: 'value',
    colorField: 'status',
    radius: 0.8,
    innerRadius: 0.6, // Transforma o gráfico em rosca
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 12, textAlign: 'center' },
    },
    tooltip: {
      fields: ['status', 'value'],
      formatter: datum => ({ name: datum.status, value: datum.value }),
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis' },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card title="Quantidade de Juizados" bordered={false} className="small-card" onClick={() => handleCardClick('juizados')}>
            <h2>{totalJuizados}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card title="Quantidade de Salas Virtuais" bordered={false} className="small-card" onClick={() => handleCardClick('salasvirtuais')}>
            <h2>{totalSalasVirtuais}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card title="Quantidade de Conciliadores" bordered={false} className="small-card" onClick={() => handleCardClick('conciliadores')}>
            <h2>{totalConciliadores}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card title="Conciliadores Disponíveis" bordered={false} className="small-card" onClick={() => handleCardClick('disponibilidades')}>
            <h2>{totalConciliadoresDisponiveis}</h2>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Quantidade de Salas por Juizado" bordered={false} className="large-card">
            <Pie {...salasPorJuizadoConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Disponibilidade por Dia da Semana" bordered={false} className="large-card">
            <Column {...disponibilidadeConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Status das Disponibilidades" bordered={false} className="large-card">
            <Pie {...statusConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
