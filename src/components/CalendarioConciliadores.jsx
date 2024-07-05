import React, { useState, useEffect } from 'react';
import { fetchConciliadores } from '../services/conciliadorService';
import { Modal, Select, Row, Col, Pagination, Button, Checkbox, Tooltip, Form, Input, Radio } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './CalendarioConciliadores.css';

const { Option } = Select;

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const anos = [2023, 2024, 2025]; // Pode adicionar mais anos conforme necessário

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const CalendarioConciliadores = () => {
    const [conciliadores, setConciliadores] = useState([]);
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
    const [reportFormat, setReportFormat] = useState('PDF');

    useEffect(() => {
        const fetchData = async () => {
            const conciliadoresData = await fetchConciliadores();
            setConciliadores(conciliadoresData);
        };
        fetchData();
    }, []);

    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const getDayOfWeek = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return diasSemana[date.getDay()];
    };

    const getFormattedDate = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = getDayOfWeek(day, month, year);
        return `${dayOfWeek}, dia ${day}`;
    };

    const isWeekend = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const diasDoMes = getDaysInMonth(mes, ano);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                    } else {
                        newCalendario[conciliador.conciliador_id][`${selectedMes}-${dia}`] = 'weekend';
                    }
                });
            });
        });
        setCalendario(newCalendario);
        setIsDistributeModalVisible(false);
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

    const handleReportModalCancel = () => {
        setIsReportModalVisible(false);
    };

    const handleMesChange = (checkedValues) => {
        setSelectedMeses(checkedValues);
    };

    const getMonthOptions = () => {
        const currentMonth = new Date().getMonth() + 1;
        return meses.map((mes, index) => ({
            label: mes,
            value: index + 1,
            disabled: index + 1 < currentMonth
        }));
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
        
        const tableRows = [];

        // Iterando sobre os dias do mês para criar linhas para o relatório
        for (let dia = 1; dia <= getDaysInMonth(reportMonth, ano); dia++) {
            const formattedDate = getFormattedDate(dia, reportMonth, ano);
            const conciliadoresDoDia = conciliadores
                .filter(conciliador => calendario[conciliador.conciliador_id]?.[`${reportMonth}-${dia}`] === 'work')
                .map(conciliador => getFirstAndLastName(conciliador.nome_conciliador))
                .join(', ');

            tableRows.push([formattedDate, conciliadoresDoDia]);
        }

        doc.autoTable({
            head: [['Data', 'Conciliadores']],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 10, cellPadding: 3, minCellHeight: 10 },
            headStyles: { fillColor: [22, 160, 133] },
            columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } }
        });

        doc.save(`escala_${meses[reportMonth - 1]}_${ano}.pdf`);
        setIsReportModalVisible(false);
    };

    // Filtragem de conciliadores
    const filteredConciliadores = conciliadores.filter(conciliador => {
        return (!comarca || conciliador.comarca_id === comarca) &&
               (!juizado || conciliador.juizado_id === juizado) &&
               (!salaVirtual || conciliador.sala_virtual_id === salaVirtual);
    });

    // Paginação de conciliadores
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentConciliadores = filteredConciliadores.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="calendario-container">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <h2 style={{ margin: 0 }}>Escala dos conciliadores</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleDistributeModalOpen} style={{ marginRight: 10 }}>
                        Gerar escala
                    </Button>
                    <Button type="primary" onClick={handleReportModalOpen} style={{ marginRight: 10 }}>
                        Relatório
                    </Button>
                    <Button onClick={handleClearModalOpen}>
                        Limpar escala
                    </Button>
                </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <span>Filtrar:</span>
                </Col>
                <Col>
                    <Select placeholder="Comarca" value={comarca} onChange={(value) => setComarca(value)} style={{ width: 120 }}>
                        {/* Adicione as opções de comarca aqui */}
                        <Option value={1}>Comarca 1</Option>
                        <Option value={2}>Comarca 2</Option>
                    </Select>
                </Col>
                <Col>
                    <Select placeholder="Juizado" value={juizado} onChange={(value) => setJuizado(value)} style={{ width: 120 }}>
                        {/* Adicione as opções de juizado aqui */}
                        <Option value={1}>Juizado 1</Option>
                        <Option value={2}>Juizado 2</Option>
                    </Select>
                </Col>
                <Col>
                    <Select placeholder="Sala Virtual" value={salaVirtual} onChange={(value) => setSalaVirtual(value)} style={{ width: 120 }}>
                        {/* Adicione as opções de sala virtual aqui */}
                        <Option value={1}>Sala Virtual 1</Option>
                        <Option value={2}>Sala Virtual 2</Option>
                    </Select>
                </Col>
            </Row>
            <Row justify="center" align="middle" style={{ marginBottom: 20 }}>
                <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
                <h3 style={{ margin: '0 10px' }}>{`${meses[mes - 1]} ${ano}`}</h3>
                <Button icon={<RightOutlined />} onClick={handleNextMonth} />
            </Row>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th className="conciliador-column">Conciliador</th>
                            {[...Array(diasDoMes).keys()].map((d) => (
                                <th key={d + 1} className={isWeekend(d + 1, mes, ano) ? 'weekend' : ''}>
                                    {d + 1}
                                    <br />
                                    <span className="dia-semana">{getDayOfWeek(d + 1, mes, ano).substring(0, 3).toLowerCase()}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentConciliadores.map((conciliador) => (
                            <tr key={conciliador.conciliador_id}>
                                <td className="conciliador-column" style={{ textAlign: 'right' }}>{getFirstAndLastName(conciliador.nome_conciliador)}</td>
                                {[...Array(diasDoMes).keys()].map((d) => {
                                    const cell = calendario[conciliador.conciliador_id]?.[`${mes}-${d + 1}`];
                                    return (
                                        <Tooltip key={d + 1} title={cell ? '' : 'Inserir escala manual'}>
                                            <td
                                                className={`${cell || 'default'} ${isWeekend(d + 1, mes, ano) ? 'weekend' : ''}`}
                                                onClick={() => handleCellClick(conciliador.conciliador_id, d + 1)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: cell === 'work' ? '#d0f0c0' : (isWeekend(d + 1, mes, ano) ? '#e0e0e0' : 'white'),
                                                    position: 'relative'
                                                }}
                                            ></td>
                                        </Tooltip>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                current={currentPage}
                total={filteredConciliadores.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                style={{ marginTop: 20, textAlign: 'center' }}
            />
            <Modal
                title={selectedCell ? getFormattedDate(selectedCell.dia, mes, ano) : 'Informações da Célula'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="delete" type="primary" danger onClick={handleDelete}>
                        Excluir
                    </Button>,
                    <Button key="close" onClick={handleModalCancel}>
                        Fechar
                    </Button>
                ]}
            >
                {selectedCell && (
                    <div>
                        <p style={{ marginBottom: '10px' }}>Conciliador: {currentConciliadores.find(c => c.conciliador_id === selectedCell.conciliadorId)?.nome_conciliador}</p>
                        <p style={{ marginBottom: '10px' }}>Comarca: {currentConciliadores.find(c => c.conciliador_id === selectedCell.conciliadorId)?.nome_comarca}</p>
                        <p style={{ marginBottom: '10px' }}>Juizado: {currentConciliadores.find(c => c.conciliador_id === selectedCell.conciliadorId)?.nome_juizado}</p>
                        <p style={{ marginBottom: '10px' }}>Sala Virtual: {currentConciliadores.find(c => c.conciliador_id === selectedCell.conciliadorId)?.nome_sala_virtual}</p>
                    </div>
                )}
            </Modal>
            <Modal
                title="Inserir Escala Manual"
                visible={isManualModalVisible}
                onCancel={handleManualModalCancel}
                footer={null}
            >
                {selectedCell && (
                    <Form onFinish={handleManualModalOk} layout="vertical">
                        <Form.Item label="Nome do Conciliador">
                            <Input value={currentConciliadores.find(c => c.conciliador_id === selectedCell.conciliadorId)?.nome_conciliador} disabled />
                        </Form.Item>
                        <Form.Item label="Dia">
                            <Input value={selectedCell.dia} disabled />
                        </Form.Item>
                        <Form.Item name="comarca" label="Comarca" rules={[{ required: true, message: 'Por favor, selecione uma comarca!' }]}>
                            <Select placeholder="Selecione a comarca">
                                <Option value="1">Comarca 1</Option>
                                <Option value="2">Comarca 2</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="juizado" label="Juizado" rules={[{ required: true, message: 'Por favor, selecione um juizado!' }]}>
                            <Select placeholder="Selecione o juizado">
                                <Option value="1">Juizado 1</Option>
                                <Option value="2">Juizado 2</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="salaVirtual" label="Sala Virtual" rules={[{ required: true, message: 'Por favor, selecione uma sala virtual!' }]}>
                            <Select placeholder="Selecione a sala virtual">
                                <Option value="1">Sala Virtual 1</Option>
                                <Option value="2">Sala Virtual 2</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>Salvar</Button>
                            <Button onClick={handleManualModalCancel}>Cancelar</Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
            <Modal
                title="Selecionar Meses para Distribuir"
                visible={isDistributeModalVisible}
                onOk={handleDistribute}
                onCancel={() => setIsDistributeModalVisible(false)}
            >
                <Checkbox.Group options={getMonthOptions()} onChange={handleMesChange} style={{ display: 'flex', flexDirection: 'column' }} />
            </Modal>
            <Modal
                title="Selecionar Meses para Limpar"
                visible={isClearModalVisible}
                onOk={handleClear}
                onCancel={() => setIsClearModalVisible(false)}
            >
                <Checkbox.Group options={getMonthOptions()} onChange={handleMesChange} style={{ display: 'flex', flexDirection: 'column' }} />
            </Modal>
            <Modal
                title="Gerar Relatório"
                visible={isReportModalVisible}
                onCancel={handleReportModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleReportModalCancel}>Cancelar</Button>,
                    <Button key="generate" type="primary" onClick={generatePDF}>Gerar Relatório</Button>
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Selecionar Mês">
                        <Select value={reportMonth} onChange={(value) => setReportMonth(value)}>
                            {meses.map((mes, index) => (
                                <Option key={index} value={index + 1}>{mes}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Formato">
                        <Radio.Group value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}>
                            <Radio value="PDF">PDF</Radio>
                            <Radio value="XLSX" disabled>XLSX (Em breve)</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CalendarioConciliadores;
