import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';

const EscalaTrabalho = () => {
    const [mesSelecionado, setMesSelecionado] = useState(moment());
    const [conciliadores, setConciliadores] = useState([]);
    const [diasDoMes, setDiasDoMes] = useState([]);
  
    useEffect(() => {
      // Gera os dias do mês atual
      const dias = [];
      const startOfMonth = mesSelecionado.clone().startOf('month');
      const endOfMonth = mesSelecionado.clone().endOf('month');
      let day = startOfMonth;
  
      while (day <= endOfMonth) {
        dias.push(day.clone());
        day.add(1, 'day');
      }
  
      setDiasDoMes(dias);
    }, [mesSelecionado]);
  
    const columns = [
      {
        title: 'Conciliador',
        dataIndex: 'nome',
        key: 'nome',
        fixed: 'left',
      },
      ...diasDoMes.map(dia => ({
        title: dia.format('DD/MM'),
        dataIndex: `dia-${dia.format('DD')}`,
        key: `dia-${dia.format('DD')}`,
        render: (_, record) => {
          // Renderiza um ícone ou cor de fundo se o conciliador está escalado nesse dia
          const estaEscalado = record.escalas.includes(dia.format('YYYY-MM-DD'));
          return estaEscalado ? '✅' : '';
        },
      })),
    ];
  
    // Supõe que cada conciliador tem uma propriedade 'escalas' que é uma matriz dos dias em que estão escalados.
    // Você precisará carregar esses dados possivelmente de uma API ou outro estado global/contexto.
  
    return (
      <div>
        <h1>Escala de Trabalho - {mesSelecionado.format('MMMM YYYY')}</h1>
        <Table columns={columns} dataSource={conciliadores} scroll={{ x: 1000 }} />
      </div>
    );
  };

export default EscalaTrabalho;
