import React, { useState, useEffect } from 'react';
import { fetchDisponibilidades, fetchSalasVirtuais, fetchJuizados } from '../../services/escalaService';
import { Row, Col, Pagination, Button, Modal, List } from 'antd';
import EscalaNavigation from './EscalaNavigation';
import ConciliadoresTable from './EscalaTable';
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

                setConciliadores(conciliadoresDisponiveis);
                setSalasVirtuais(salasVirtuaisData);
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

    const getFirstAndLastName = (fullName) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        }
        return fullName;
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

    const handleGenerateSchedule = async () => {
        const selectedMes = `${ano}-${mes.toString().padStart(2, '0')}`;

        const filteredConciliadores = conciliadores.filter(conciliador =>
            conciliador.disponibilidades.some(disponibilidade =>
                disponibilidade.mes === selectedMes
            )
        );

        const shuffledSalas = [...salasVirtuais].sort(() => 0.5 - Math.random());
        const salasDistribuidas = filteredConciliadores.map((conciliador, index) => {
            const sala = shuffledSalas[index % shuffledSalas.length];
            return {
                ...conciliador,
                sala: sala.nome_sala_virtual,
                juizado_id: sala.juizado_id
            };
        });

        setConciliadores(salasDistribuidas);
        setIsModalVisible(false);
    };

    const juizadosComSalas = juizados.map(juizado => ({
        ...juizado,
        conciliadores: currentConciliadores.filter(conciliador => conciliador.juizado_id === juizado.juizado_id)
    })).filter(juizado => juizado.conciliadores.length > 0);

    const conciliadoresResumo = filteredConciliadores.map(conciliador => ({
        nome: conciliador.nome_conciliador,
        diasDisponiveis: conciliador.disponibilidades[0]?.quantidade_dias || 0,
        diasDaSemana: conciliador.disponibilidades.map(disponibilidade => disponibilidade.dia_da_semana).join(', ')
    }));

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
            <ConciliadoresTable
                juizadosComSalas={juizadosComSalas}
                diasDoMes={diasDoMes}
                mes={mes}
                ano={ano}
                handleCellClick={() => { }}
                isWeekend={isWeekend}
                getDayOfWeek={getDayOfWeek}
                getFirstAndLastName={getFirstAndLastName}
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
