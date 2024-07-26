import React, { useState, useEffect } from 'react';
import { fetchDisponibilidades, fetchSalasVirtuais, fetchJuizados } from '../../services/escalaService';
import { Row, Col, Pagination, Button, Modal, List } from 'antd';
import EscalaNavigation from './EscalaNavigation';
import EscalaTable from './EscalaTable';
import './EscalaConciliadores.css';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const EscalaConciliadores = () => {
    const [conciliadores, setConciliadores] = useState([]);
    const [juizados, setJuizados] = useState([]);
    const [salasVirtuais, setSalasVirtuais] = useState([]);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const disponibilidadesData = await fetchDisponibilidades();
                const salasVirtuaisData = await fetchSalasVirtuais();
                const juizadosData = await fetchJuizados();

                const conciliadoresDisponiveis = disponibilidadesData
                    .filter(disponibilidade => disponibilidade.status_disponibilidade === 'Ativo')
                    .reduce((acc, disponibilidade) => {
                        const conciliador = acc.find(c => c.nome_conciliador === disponibilidade.nome_conciliador);
                        if (conciliador) {
                            conciliador.disponibilidades.push(disponibilidade);
                        } else {
                            acc.push({
                                conciliador_id: disponibilidade.id,
                                nome_conciliador: disponibilidade.nome_conciliador,
                                disponibilidades: [disponibilidade]
                            });
                        }
                        return acc;
                    }, []);

                // Filtrar salas virtuais ativas
                const salasVirtuaisAtivas = salasVirtuaisData.filter(sala => sala.status_sala_virtual === 'Ativo');

                setConciliadores(conciliadoresDisponiveis);
                setSalasVirtuais(salasVirtuaisAtivas);
                setJuizados(juizadosData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
    }, []);

    const handlePrevMonth = () => {
        if (mes === 1) {
            setMes(12);
            setAno(ano - 1);
        } else {
            setMes(mes - 1);
        }
    };

    const handleNextMonth = () => {
        if (mes === 12) {
            setMes(1);
            setAno(ano + 1);
        } else {
            setMes(mes + 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const isWeekend = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const getDayOfWeek = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return diasSemana[date.getDay()];
    };

    const getInitials = (fullName) => {
        const names = fullName.split(' ');
        return names.map(name => name[0]).join('');
    };

    const diasDoMes = getDaysInMonth(mes, ano);

    const filteredConciliadores = conciliadores.filter(conciliador => 
        conciliador.disponibilidades.some(disponibilidade => {
            const [dispAno, dispMes] = disponibilidade.mes.split('-');
            return parseInt(dispMes) === mes && parseInt(dispAno) === ano;
        })
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentConciliadores = filteredConciliadores.slice(indexOfFirstItem, indexOfLastItem);

    const handleGenerateSchedule = () => {
        const shuffledConciliadores = [...filteredConciliadores].sort(() => 0.5 - Math.random());

        const schedule = {};

        shuffledConciliadores.forEach(conciliador => {
            conciliador.disponibilidades.forEach(disponibilidade => {
                const diaSemana = disponibilidade.dia_da_semana;
                let dayOfWeek;
                switch (diaSemana) {
                    case 'Segunda': dayOfWeek = 1; break;
                    case 'Terça': dayOfWeek = 2; break;
                    case 'Quarta': dayOfWeek = 3; break;
                    case 'Quinta': dayOfWeek = 4; break;
                    case 'Sexta': dayOfWeek = 5; break;
                    default: dayOfWeek = -1;
                }

                salasVirtuais.forEach(sala => {
                    if (sala.nome_dia.includes(diaSemana)) {
                        const data = new Date(ano, mes - 1, 1);
                        while (data.getMonth() === mes - 1) {
                            if (data.getDay() === dayOfWeek) {
                                const dateKey = data.toISOString().split('T')[0];
                                if (!schedule[dateKey]) {
                                    schedule[dateKey] = {};
                                }
                                if (!schedule[dateKey][sala.sala_virtual_id]) {
                                    schedule[dateKey][sala.sala_virtual_id] = getInitials(conciliador.nome_conciliador);
                                    break;
                                }
                            }
                            data.setDate(data.getDate() + 1);
                        }
                    }
                });
            });
        });

        setConciliadores(prevConciliadores => {
            return prevConciliadores.map(conciliador => {
                const novasDisponibilidades = [];
                for (let date in schedule) {
                    for (let salaId in schedule[date]) {
                        if (schedule[date][salaId] === getInitials(conciliador.nome_conciliador)) {
                            novasDisponibilidades.push({
                                ...conciliador,
                                data: date,
                                sala_virtual_id: salaId
                            });
                        }
                    }
                }
                return {
                    ...conciliador,
                    disponibilidades: novasDisponibilidades
                };
            });
        });

        setIsModalVisible(false);
    };

    const juizadosComSalas = juizados.map(juizado => ({
        ...juizado,
        salas: salasVirtuais.filter(sala => sala.juizado_id === juizado.juizado_id)
    }));

    const conciliadoresResumo = filteredConciliadores.map(conciliador => ({
        nome: conciliador.nome_conciliador,
        diasDisponiveis: conciliador.disponibilidades[0]?.quantidade_dias || 0,
        diasDaSemana: conciliador.disponibilidades.map(disponibilidade => disponibilidade.dia_da_semana).join(', ')
    }));

    console.log('Conciliadores:', conciliadores);

    return (
        <div className="calendario-container">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col><h2 style={{ margin: 0 }}>Escala dos conciliadores</h2></Col>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <EscalaNavigation 
                        mes={mes} 
                        ano={ano} 
                        handlePrevMonth={handlePrevMonth} 
                        handleNextMonth={handleNextMonth} 
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>Gerar escala</Button>
                </Col>
            </Row>
            <EscalaTable
                juizadosComSalas={juizadosComSalas}
                diasDoMes={diasDoMes}
                mes={mes}
                ano={ano}
                handleCellClick={() => { }}
                isWeekend={isWeekend}
                getDayOfWeek={getDayOfWeek}
                getInitials={getInitials}
            />
            <Pagination
                current={currentPage}
                total={filteredConciliadores.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                style={{ marginTop: 20, textAlign: 'center' }}
            />
            <Modal
                title="Gerar escala"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleGenerateSchedule}
                bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }} 
            >
                <p>Total de conciliadores disponíveis no mês de {meses[mes - 1]}: {filteredConciliadores.length}</p>
                <p>Quantidade de salas virtuais cadastradas: {salasVirtuais.length}</p>
                <div style={{ marginBottom: '20px' }}></div>
                <List
                    itemLayout="horizontal"
                    dataSource={conciliadoresResumo}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.nome}
                                description={
                                    <>
                                        <div>Dias disponíveis: {item.diasDisponiveis}</div>
                                        <div>Dias da semana: {item.diasDaSemana}</div>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default EscalaConciliadores;

import React from 'react';
import { Tooltip } from 'antd';

const EscalaTable = ({
    juizadosComSalas, diasDoMes, mes, ano, handleCellClick, isWeekend, getDayOfWeek, getInitials
}) => {
    const formatDayMonth = (day) => day < 10 ? `0${day}` : day;

    const isDiaFuncionamento = (diasFunc, dayOfWeek) => {
        const mapDias = {
            'Domingo': 0,
            'Segunda': 1,
            'Terça': 2,
            'Quarta': 3,
            'Quinta': 4,
            'Sexta': 5,
            'Sábado': 6,
        };
        return diasFunc.some(dia => mapDias[dia] === dayOfWeek);
    };

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th className="conciliador-column">Sala Virtual</th>
                        {[...Array(diasDoMes).keys()].map(d => (
                            <th key={d + 1} className={isWeekend(d + 1, mes, ano) ? 'weekend' : ''}>
                                {d + 1}
                                <br />
                                <span className="dia-semana">{getDayOfWeek(d + 1, mes, ano).substring(0, 3).toLowerCase()}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {juizadosComSalas.map(juizado => (
                        <React.Fragment key={`juizado-${juizado.juizado_id}`}>
                            <tr className="juizado-row">
                                <td colSpan={diasDoMes + 1}>{juizado.nome_juizado}</td>
                            </tr>
                            {juizado.salas.map(sala => {
                                const diasFuncionamento = sala.nome_dia.split(', ');
                                return (
                                    <React.Fragment key={`sala-${sala.id}`}>
                                        <tr>
                                            <td className="conciliador-column" style={{ textAlign: 'right' }}>
                                                {sala.nome_sala_virtual}
                                            </td>
                                            {[...Array(diasDoMes).keys()].map(d => {
                                                const dia = d + 1;
                                                const formattedDate = `${ano}-${formatDayMonth(mes)}-${formatDayMonth(dia)}`;
                                                const dayOfWeek = new Date(ano, mes - 1, dia).getDay();
                                                const conciliador = sala.conciliadores?.find(conciliador =>
                                                    conciliador.disponibilidades?.some(disponibilidade => disponibilidade.data === formattedDate)
                                                );
                                                const cellClass = conciliador ? 'work' : 'default';
                                                const isEnabled = isDiaFuncionamento(diasFuncionamento, dayOfWeek);
                                                return (
                                                    <Tooltip key={dia} title={cellClass === 'work' ? conciliador.nome_conciliador : 'Disponível'}>
                                                        <td
                                                            className={`${cellClass} ${isWeekend(dia, mes, ano) ? 'weekend' : ''}`}
                                                            onClick={isEnabled ? () => handleCellClick(conciliador?.conciliador_id, dia) : undefined}
                                                            style={{
                                                                cursor: isEnabled ? 'pointer' : 'not-allowed',
                                                                backgroundColor: isEnabled ? (cellClass === 'work' ? '#d0f0c0' : (isWeekend(dia, mes, ano) ? '#e0e0e0' : 'white')) : '#e0e0e0',
                                                                position: 'relative',
                                                                opacity: isEnabled ? 1 : 0.5
                                                            }}
                                                        >
                                                            {isEnabled && cellClass === 'work' && getInitials(conciliador.nome_conciliador)}
                                                        </td>
                                                    </Tooltip>
                                                );
                                            })}
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EscalaTable;
