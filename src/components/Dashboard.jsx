import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import axios from 'axios';
import { Card, Row, Col } from 'antd';

const Dashboard = () => {
  const [salasPorJuizadoData, setSalasPorJuizadoData] = useState([]);
  const [disponibilidadeData, setDisponibilidadeData] = useState([]);
  const [totalConciliadores, setTotalConciliadores] = useState(0);
  const [totalSalasVirtuais, setTotalSalasVirtuais] = useState(0);
  const [totalJuizados, setTotalJuizados] = useState(0);
  const [totalConciliadoresDisponiveis, setTotalConciliadoresDisponiveis] = useState(0);

  useEffect(() => {
    fetchSalasPorJuizadoData();
    fetchDisponibilidadeData();
    fetchTotalConciliadores();
    fetchTotalSalasVirtuais();
    fetchTotalJuizados();
    fetchTotalConciliadoresDisponiveis();
  }, []);

  const fetchSalasPorJuizadoData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/salasvirtuais');
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
      const response = await axios.get('http://localhost:3000/api/disponibilidades');
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

  const fetchTotalConciliadores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/conciliadores');
      setTotalConciliadores(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar total de conciliadores:', error);
    }
  };

  const fetchTotalSalasVirtuais = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/salasvirtuais');
      setTotalSalasVirtuais(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar total de salas virtuais:', error);
    }
  };

  const fetchTotalJuizados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/juizados');
      setTotalJuizados(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar total de juizados:', error);
    }
  };

  const fetchTotalConciliadoresDisponiveis = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/disponibilidades');
      const conciliadoresIds = new Set(response.data.map(d => d.conciliador_id));
      setTotalConciliadoresDisponiveis(conciliadoresIds.size);
    } catch (error) {
      console.error('Erro ao buscar total de conciliadores disponíveis:', error);
    }
  };

  const salasPorJuizadoConfig = {
    data: salasPorJuizadoData,
    xField: 'juizado',
    yField: 'value',
    label: { 
      position: 'middle', 
      style: { fill: '#000000', opacity: 0.8 },
      formatter: (datum) => datum.value,
    },
    xAxis: { 
      label: { autoHide: true, autoRotate: false },
    },
    meta: { 
      juizado: { alias: 'Juizado' }, 
      value: { alias: 'Quantidade de Salas' } 
    },
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
    xAxis: { 
      label: { autoHide: true, autoRotate: false },
    },
    meta: { 
      day: { alias: 'Dia da Semana' }, 
      value: { alias: 'Disponibilidade' } 
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Quantidade de Juizados" bordered={false} className="small-card">
                <h2>{totalJuizados}</h2>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Quantidade de Salas Virtuais" bordered={false} className="small-card">
                <h2>{totalSalasVirtuais}</h2>
              </Card>
            </Col>
          </Row>
          <Card title="Quantidade de Salas por Juizado" bordered={false} className="large-card">
            <Column {...salasPorJuizadoConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Quantidade de Conciliadores" bordered={false} className="small-card">
                <h2>{totalConciliadores}</h2>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Quantidade de Conciliadores Disponíveis" bordered={false} className="small-card">
                <h2>{totalConciliadoresDisponiveis}</h2>
              </Card>
            </Col>
          </Row>
          <Card title="Disponibilidade por Dia da Semana" bordered={false} className="large-card">
            <Column {...disponibilidadeConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
