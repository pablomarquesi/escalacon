import React, { useEffect, useState } from 'react';
import { Line, Column, Pie } from '@ant-design/charts';
import axios from 'axios';
import { Card, Row, Col } from 'antd';
import moment from 'moment';

const Dashboard = () => {
  const [credenciamentoData, setCredenciamentoData] = useState([]);
  const [disponibilidadeData, setDisponibilidadeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [totalConciliadores, setTotalConciliadores] = useState(0);
  const [totalSalasVirtuais, setTotalSalasVirtuais] = useState(0);
  const [totalJuizados, setTotalJuizados] = useState(0);
  const [totalConciliadoresDisponiveis, setTotalConciliadoresDisponiveis] = useState(0);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    fetchCredenciamentoData();
    fetchDisponibilidadeData();
    fetchStatusData();
    fetchTotalConciliadores();
    fetchTotalSalasVirtuais();
    fetchTotalJuizados();
    fetchTotalConciliadoresDisponiveis();
  }, [filter]);

  const fetchCredenciamentoData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/conciliadores', { params: { filter } });
      const data = response.data.reduce((acc, conciliador) => {
        const quarter = moment(conciliador.data_credenciamento).startOf('quarter').format('YYYY-[Q]Q');
        if (!acc[quarter]) {
          acc[quarter] = 0;
        }
        acc[quarter]++;
        return acc;
      }, {});
      const chartData = Object.keys(data)
        .sort()
        .map(key => ({ quarter: key, value: data[key] }));
      setCredenciamentoData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados de credenciamento:', error);
    }
  };

  const fetchDisponibilidadeData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/disponibilidades-conciliadores', { params: { filter } });
      const data = response.data.reduce((acc, disponibilidade) => {
        const dias = disponibilidade.dia_da_semana.split(',');
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
      const response = await axios.get('http://localhost:3000/api/disponibilidades-conciliadores', { params: { filter } });
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
      const response = await axios.get('http://localhost:3000/api/disponibilidades-conciliadores', { params: { filter } });
      const conciliadoresIds = new Set(response.data.filter(d => d.status_disponibilidade === 'Ativo').map(d => d.nome_conciliador));
      setTotalConciliadoresDisponiveis(conciliadoresIds.size);
    } catch (error) {
      console.error('Erro ao buscar total de conciliadores disponíveis:', error);
    }
  };

  const handleCardClick = (url) => {
    window.location.href = url;
  };

  const credenciamentoConfig = {
    data: credenciamentoData,
    xField: 'quarter',
    yField: 'value',
    xAxis: {
      type: 'cat',
      title: { text: 'Trimestre' },
      label: {
        formatter: (v) => moment(v, 'YYYY-[Q]Q').format('[Q]Q YYYY'), // Formata o trimestre no eixo x
      },
    },
    yAxis: {
      label: {
        formatter: v => `${v}`
      },
      title: { text: 'Quantidade de Credenciamentos' },
    },
    tooltip: {
      fields: ['quarter', 'value'],
      formatter: datum => ({
        name: 'Credenciamentos',
        value: datum.value,
      }),
    },
    smooth: true, // Adiciona suavização para curvas arredondadas
    height: 400, // Define a altura do gráfico
  };

  const disponibilidadeConfig = {
    data: disponibilidadeData,
    xField: 'day',
    yField: 'value',
    xAxis: {
      type: 'cat',
      title: { text: 'Dia da Semana' },
      label: {
        formatter: (v) => v,
      },
    },
    yAxis: {
      title: { text: 'Disponibilidade' },
    },
    tooltip: {
      fields: ['day', 'value'],
      formatter: datum => ({
        name: `${datum.day}`,
        value: datum.value,
      }),
    },
    height: 400,
    columnWidthRatio: 0.8,
    barWidthRatio: 0.8,
  };

  const statusConfig = {
    appendPadding: 10,
    data: statusData,
    angleField: 'value',
    colorField: 'status',
    radius: 0.8,
    innerRadius: 0.6,
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
          <Card 
            title="Quantidade de Juizados" 
            bordered={false} 
            className="small-card"
          >
            <h2>{totalJuizados}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            title="Quantidade de Salas Virtuais" 
            bordered={false} 
            className="small-card"
          >
            <h2>{totalSalasVirtuais}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            title="Quantidade de Conciliadores" 
            bordered={false} 
            className="small-card" 
            onClick={() => handleCardClick('http://localhost:5173/cadastro/conciliador')}
          >
            <h2>{totalConciliadores}</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            title="Conciliadores Disponíveis" 
            bordered={false} 
            className="small-card" 
            onClick={() => handleCardClick('http://localhost:5173/cadastro/disponibilidade')}
          >
            <h2>{totalConciliadoresDisponiveis}</h2>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Credenciamentos por Trimestre" bordered={false} className="large-card">
            <Line {...credenciamentoConfig} />
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
