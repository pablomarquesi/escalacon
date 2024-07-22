import React, { useState, useEffect } from 'react';
import { fetchConciliadores } from '../../services/conciliadorService';
import { fetchDisponibilidades, fetchSalasVirtuais } from '../../services/calendarioService';
import { Row, Col, Pagination } from 'antd';
import FilterBar from './FilterBar';
import CalendarNavigation from './CalendarNavigation';
import ConciliadoresTable from './ConciliadoresTable';
import './CalendarioConciliadores.css';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const CalendarioConciliadores = () => {
    const [conciliadores, setConciliadores] = useState([]);
    const [comarcas, setComarcas] = useState([]); 
    const [juizados, setJuizados] = useState([]); 
    const [salasVirtuais, setSalasVirtuais] = useState([]); 
    const [filteredJuizados, setFilteredJuizados] = useState([]); 
    const [filteredSalasVirtuais, setFilteredSalasVirtuais] = useState([]); 
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [comarca, setComarca] = useState(null);
    const [juizado, setJuizado] = useState(null);
    const [salaVirtual, setSalaVirtual] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const disponibilidadesData = await fetchDisponibilidades();
                const salasVirtuaisData = await fetchSalasVirtuais();

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

                // Adicione fetchComarcas e fetchJuizados aqui se necessário
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
    }, [mes, ano]);

    const handleComarcaChange = (value) => {
        setComarca(value);
        setJuizado(null);
        setSalaVirtual(null);

        const filteredJuizados = juizados.filter(j => j.comarca_id === value);
        setFilteredJuizados(filteredJuizados);
        setFilteredSalasVirtuais([]);
    };

    const handleJuizadoChange = (value) => {
        setJuizado(value);
        setSalaVirtual(null);

        const filteredSalasVirtuais = salasVirtuais.filter(sv => sv.juizado_id === value);
        setFilteredSalasVirtuais(filteredSalasVirtuais);
    };

    const handleSalaVirtualChange = (value) => {
        setSalaVirtual(value);
    };

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

    return (
        <div className="calendario-container">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col><h2 style={{ margin: 0 }}>Escala dos conciliadores</h2></Col>
            </Row>
            <FilterBar 
                comarca={comarca}
                setComarca={handleComarcaChange}
                comarcas={comarcas}
                juizado={juizado}
                setJuizado={handleJuizadoChange}
                juizados={filteredJuizados} 
                salaVirtual={salaVirtual}
                setSalaVirtual={handleSalaVirtualChange}
                salasVirtuais={filteredSalasVirtuais} 
            />
            <CalendarNavigation 
                mes={mes} 
                ano={ano} 
                handlePrevMonth={handlePrevMonth} 
                handleNextMonth={handleNextMonth} 
            />
            <ConciliadoresTable 
                currentConciliadores={currentConciliadores} 
                diasDoMes={diasDoMes} 
                mes={mes} 
                ano={ano} 
                handleCellClick={() => {}} 
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
        </div>
    );
};

export default CalendarioConciliadores;
