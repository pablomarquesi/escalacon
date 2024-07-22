import React, { useState, useEffect } from 'react';
import { fetchDisponibilidades, fetchSalasVirtuais, fetchJuizados } from '../../services/calendarioService';
import { Row, Col, Pagination, Button, Modal, Form, Select, List } from 'antd';
import CalendarNavigation from './CalendarNavigation';
import ConciliadoresTable from './ConciliadoresTable';
import './EscalaConciliadores.css';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const CalendarioConciliadores = () => {
    const [conciliadores, setConciliadores] = useState([]);
    const [juizados, setJuizados] = useState([]);
    const [salasVirtuais, setSalasVirtuais] = useState([]);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

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

        // Filtrar conciliadores disponíveis no mês selecionado
        const filteredConciliadores = conciliadores.filter(conciliador =>
            conciliador.disponibilidades.some(disponibilidade =>
                disponibilidade.mes === selectedMes
            )
        );

        // Distribuir salas
        const salasDistribuidas = filteredConciliadores.map((conciliador, index) => {
            const sala = salasVirtuais[Math.floor(Math.random() * salasVirtuais.length)];
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
        diasDisponiveis: conciliador.disponibilidades.length,
        diasDaSemana: conciliador.disponibilidades.map(disponibilidade => disponibilidade.dia_da_semana).join(', ')
    }));

    return (
        <div className="calendario-container">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col><h2 style={{ margin: 0 }}>Escala dos conciliadores</h2></Col>
                <Col>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>Gerar escala</Button>
                </Col>
            </Row>
            <CalendarNavigation 
                mes={mes} 
                ano={ano} 
                handlePrevMonth={handlePrevMonth} 
                handleNextMonth={handleNextMonth} 
            />
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
            >
                <p>Total de conciliadores disponíveis: {filteredConciliadores.length}</p>
                <List
                    itemLayout="horizontal"
                    dataSource={conciliadoresResumo}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.nome}
                                description={`Dias disponíveis: ${item.diasDisponiveis}, Dias da semana: ${item.diasDaSemana}`}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default CalendarioConciliadores;
