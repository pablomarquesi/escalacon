import React, { useState, useEffect } from 'react';
import { fetchConciliadores } from '../../services/conciliadorService';
import { fetchComarcas } from '../../services/comarcaService';
import { fetchDisponibilidades } from '../../services/disponibilidadeService';
import { fetchJuizados } from '../../services/juizadoService';
import { fetchSalasVirtuais } from '../../services/salaVirtualService';
import { Modal, Row, Col, Pagination, Button, Tooltip, Form } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FilterBar from './FilterBar';
import CalendarNavigation from './CalendarNavigation';
import ConciliadoresTable from './ConciliadoresTable';
import DistributeModal from './Modals/DistributeModal';
import ClearModal from './Modals/ClearModal';
import ReportModal from './Modals/ReportModal';
import CellInfoModal from './Modals/CellInfoModal';
import ManualEntryModal from './Modals/ManualEntryModal';
import './CalendarioConciliadores.css';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const anos = [2023, 2024, 2025]; 

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
    const [calendario, setCalendario] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [comarca, setComarca] = useState(null);
    const [juizado, setJuizado] = useState(null);
    const [salaVirtual, setSalaVirtual] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isManualModalVisible, setIsManualModalVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const [isDistributeModalVisible, setIsDistributeModalVisible] = useState(false);
    const [isClearModalVisible, setIsClearModalVisible] = useState(false);
    const [selectedMeses, setSelectedMeses] = useState([]);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reportMonth, setReportMonth] = useState(mes);
    const [reportComarca, setReportComarca] = useState(null);
    const [reportFormat, setReportFormat] = useState('PDF');

    const [selectedComarca, setSelectedComarca] = useState(null);
    const [selectedJuizado, setSelectedJuizado] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const conciliadoresData = await fetchConciliadores();
            const disponibilidadesData = await fetchDisponibilidades();
            const conciliadoresDisponiveis = conciliadoresData.filter(conciliador => 
                disponibilidadesData.some(disponibilidade => disponibilidade.conciliador_id === conciliador.conciliador_id)
            );
            setConciliadores(conciliadoresDisponiveis);

            const comarcasData = await fetchComarcas();
            setComarcas(comarcasData);

            const juizadosData = await fetchJuizados();
            setJuizados(juizadosData);

            const salasVirtuaisData = await fetchSalasVirtuais();
            setSalasVirtuais(salasVirtuaisData);
        };
        fetchData();
    }, []);

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

    const handleDistributeModalOpen = () => {
        setSelectedMeses([]);
        setIsDistributeModalVisible(true);
    };

    const handleClearModalOpen = () => {
        setSelectedMeses([]);
        setIsClearModalVisible(true);
    };

    const handleReportModalOpen = () => {
        setIsReportModalVisible(true);
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

    const handleDistribute = () => {
        const newCalendario = { ...calendario };
        selectedMeses.forEach(selectedMes => {
            conciliadores.forEach(conciliador => {
                if (!newCalendario[conciliador.conciliador_id]) {
                    newCalendario[conciliador.conciliador_id] = {};
                }
                const diasNoMes = getDaysInMonth(selectedMes, ano);
                [...Array(diasNoMes).keys()].forEach(d => {
                    const dia = d + 1;
                    if (!isWeekend(dia, selectedMes, ano)) {
                        newCalendario[conciliador.conciliador_id][`${selectedMes}-${dia}`] = Math.random() > 0.5 ? 'work' : 'default';
                    }
                });
            });
        });
        setCalendario(newCalendario);
        setIsDistributeModalVisible(false);
    };

    const getMonthOptions = () => {
        const currentMonth = new Date().getMonth() + 1;
        return meses.map((mes, index) => ({
            label: mes,
            value: index + 1,
            disabled: index + 1 < currentMonth
        }));
    };

    const handleClear = () => {
        const newCalendario = { ...calendario };
        selectedMeses.forEach(selectedMes => {
            conciliadores.forEach(conciliador => {
                if (newCalendario[conciliador.conciliador_id]) {
                    const diasNoMes = getDaysInMonth(selectedMes, ano);
                    [...Array(diasNoMes).keys()].forEach(d => {
                        const dia = d + 1;
                        delete newCalendario[conciliador.conciliador_id][`${selectedMes}-${dia}`];
                    });
                }
            });
        });
        setCalendario(newCalendario);
        setIsClearModalVisible(false);
    };

    const handleReportModalCancel = () => {
        setIsReportModalVisible(false);
    };

    const handleMesChange = (value) => {
        setReportMonth(value);
    };

    const getComarcaOptions = () => {
        return [
            { label: 'Todas', value: null },
            ...comarcas.map(c => ({
                label: c.nome_comarca,
                value: c.nome_comarca
            }))
        ];
    };

    const getFirstAndLastName = (fullName) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        }
        return fullName;
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Escala de ${meses[reportMonth - 1]} ${ano}`, 14, 22);

        const groupedData = {};

        conciliadores.forEach(conciliador => {
            const { nome_comarca, nome_juizado, nome_sala_virtual, nome_conciliador, conciliador_id } = conciliador;
            
            if (reportComarca && nome_comarca !== reportComarca) return;

            if (!groupedData[nome_comarca]) groupedData[nome_comarca] = {};
            if (!groupedData[nome_comarca][nome_juizado]) groupedData[nome_comarca][nome_juizado] = {};
            
            for (let dia = 1; dia <= getDaysInMonth(reportMonth, ano); dia++) {
                const cell = calendario[conciliador_id]?.[`${reportMonth}-${dia}`];
                if (cell === 'work') {
                    const formattedDate = getFormattedDate(dia, reportMonth, ano);
                    if (!groupedData[nome_comarca][nome_juizado][formattedDate]) {
                        groupedData[nome_comarca][nome_juizado][formattedDate] = [];
                    }
                    groupedData[nome_comarca][nome_juizado][formattedDate].push({
                        conciliador: getFirstAndLastName(nome_conciliador),
                        salaVirtual: nome_sala_virtual
                    });
                }
            }
        });

        let startY = 30;
        Object.keys(groupedData).forEach(comarca => {
            doc.setFontSize(14);
            doc.text(comarca, 14, startY);
            startY += 2;
            doc.line(14, startY, 196, startY);
            startY += 8;

            Object.keys(groupedData[comarca]).forEach(juizado => {
                doc.setFillColor(240, 240, 240);
                doc.rect(14, startY - 4, 182, 10, 'F');
                doc.setFontSize(12);
                doc.text(juizado, 14, startY);
                startY += 10;

                Object.keys(groupedData[comarca][juizado]).forEach(date => {
                    doc.setFontSize(12);
                    doc.text(date, 14, startY);
                    startY += 8;

                    doc.autoTable({
                        startY,
                        head: [['Conciliador', 'Sala Virtual']],
                        body: groupedData[comarca][juizado][date].map(({ conciliador, salaVirtual }) => [conciliador, salaVirtual]),
                        theme: 'grid',
                        styles: { fontSize: 10, cellPadding: 3, minCellHeight: 10, halign: 'left' },
                        headStyles: { fillColor: [200, 200, 200] },
                        columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } },
                    });

                    startY = doc.autoTable.previous.finalY + 5;
                });
            });
        });

        doc.save(`escala_${meses[reportMonth - 1]}_${ano}.pdf`);
        setIsReportModalVisible(false);
    };

    const getFormattedDate = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = getDayOfWeek(day, month, year);
        return `${dayOfWeek}, dia ${day}`;
    };

    const handleCellClick = (conciliadorId, dia) => {
        const cell = calendario[conciliadorId]?.[`${mes}-${dia}`];
        setSelectedCell({ conciliadorId, dia });
        if (cell && cell === 'work') {
            setIsModalVisible(true);
        } else {
            setIsManualModalVisible(true);
        }
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleManualModalOk = (values) => {
        const newCalendario = { ...calendario };
        if (!newCalendario[selectedCell.conciliadorId]) {
            newCalendario[selectedCell.conciliadorId] = {};
        }
        newCalendario[selectedCell.conciliadorId][`${mes}-${selectedCell.dia}`] = 'work';
        setCalendario(newCalendario);
        setIsManualModalVisible(false);
    };

    const handleManualModalCancel = () => {
        setIsManualModalVisible(false);
    };

    const handleDelete = () => {
        const newCalendario = { ...calendario };
        delete newCalendario[selectedCell.conciliadorId][`${mes}-${selectedCell.dia}`];
        setCalendario(newCalendario);
        setIsModalVisible(false);
    };

    const diasDoMes = getDaysInMonth(mes, ano);

    const filteredConciliadores = conciliadores.filter(conciliador => {
        return (!comarca || conciliador.comarca_id === comarca) &&
               (!juizado || conciliador.juizado_id === juizado) &&
               (!salaVirtual || conciliador.sala_virtual_id === salaVirtual);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentConciliadores = filteredConciliadores.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="calendario-container">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col><h2 style={{ margin: 0 }}>Escala dos conciliadores</h2></Col>
                <Col>
                    <Button type="primary" onClick={handleDistributeModalOpen} style={{ marginRight: 10 }}>Gerar escala</Button>
                    <Button type="primary" onClick={handleReportModalOpen} style={{ marginRight: 10 }}>Relatório</Button>
                    <Button onClick={handleClearModalOpen}>Limpar escala</Button>
                </Col>
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
                calendario={calendario} 
                mes={mes} 
                ano={ano} 
                handleCellClick={handleCellClick} 
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
            <CellInfoModal 
                isModalVisible={isModalVisible} 
                handleModalOk={handleModalOk} 
                handleModalCancel={handleModalCancel} 
                handleDelete={handleDelete} 
                selectedCell={selectedCell} 
                currentConciliadores={currentConciliadores} 
                mes={mes} 
                ano={ano} 
                getFormattedDate={getFormattedDate} 
            />
            <ManualEntryModal 
                isManualModalVisible={isManualModalVisible} 
                handleManualModalOk={handleManualModalOk} 
                handleManualModalCancel={handleManualModalCancel} 
                selectedCell={selectedCell} 
                comarcas={comarcas} 
                currentConciliadores={currentConciliadores} 
                juizados={filteredJuizados} 
            />
            <DistributeModal 
                isDistributeModalVisible={isDistributeModalVisible} 
                handleDistribute={handleDistribute} 
                setIsDistributeModalVisible={setIsDistributeModalVisible} 
                getMonthOptions={getMonthOptions} 
                setSelectedMeses={setSelectedMeses}
                comarcas={comarcas}
                juizados={juizados}
                handleComarcaChange={setSelectedComarca}
                handleJuizadoChange={setSelectedJuizado}
                selectedComarca={selectedComarca}
                selectedJuizado={selectedJuizado}
            />
            <ClearModal 
                isClearModalVisible={isClearModalVisible} 
                handleClear={handleClear} 
                setIsClearModalVisible={setIsClearModalVisible} 
                getMonthOptions={getMonthOptions} 
                setSelectedMeses={setSelectedMeses} 
            />
            <ReportModal 
                isReportModalVisible={isReportModalVisible} 
                handleReportModalCancel={handleReportModalCancel} 
                generatePDF={generatePDF} 
                meses={meses} 
                reportMonth={reportMonth} 
                handleMesChange={handleMesChange} 
                getComarcaOptions={getComarcaOptions} 
                reportComarca={reportComarca} 
                setReportComarca={setReportComarca} 
                reportFormat={reportFormat} 
                setReportFormat={setReportFormat} 
            />
        </div>
    );
};

export default CalendarioConciliadores;
