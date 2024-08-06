import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Progress, Collapse, Select, DatePicker, Input, List, Tooltip, Calendar } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import HeaderSection from '../common/HeaderSection';
import { salvarDisponibilidade } from '../../services/disponibilidadeSalaService';

const { Panel } = Collapse;
const { Option } = Select;

const DisponibilidadeSalaVirtual = () => {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedEndpoints, setSelectedEndpoints] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedSala, setSelectedSala] = useState('');
    const [endpoints, setEndpoints] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [importacaoConcluida, setImportacaoConcluida] = useState(false);
    const [confirmarSalvar, setConfirmarSalvar] = useState(false);
    const [currentEndpoint, setCurrentEndpoint] = useState('');
    const [currentData, setCurrentData] = useState('');

    const fetchEndpoints = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/juizados');
            if (response.ok) {
                const data = await response.json();
                const endpoints = data.map(item => ({
                    label: item.nome_juizado,
                    value: item.endpoint_id,
                    comarca: item.nome_comarca,
                }));
                setEndpoints(endpoints);
            } else {
                console.error('Erro ao buscar endpoints:', response.status);
                message.error('Erro ao buscar endpoints');
            }
        } catch (error) {
            console.error('Erro ao buscar endpoints:', error);
            message.error('Erro ao buscar endpoints');
        }
    };

    useEffect(() => {
        fetchEndpoints();
    }, []);

    const gerarDatasDoMes = (ano, mes) => {
        const datas = [];
        let dataAtual = new Date(ano, mes - 1, 1);
        while (dataAtual.getMonth() + 1 === mes) {
            datas.push(dataAtual.toISOString().split('T')[0]);
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        return datas;
    };

    const buscarDados = async (data, endpoint) => {
        const url = `https://plenarios-api.tjmt.jus.br/consulta-pje/obter-pauta-audiencia/${data}/${endpoint}`;
        try {
            setCurrentEndpoint(endpoint);
            setCurrentData(data);
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Erro ao buscar dados:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            return null;
        }
    };

    const extrairInfo = (dados) => {
        const infoExtraida = [];
        for (const item of dados) {
            const dataAudiencia = item.dataAudiencia;
            const sala = item.sala;
            if (dataAudiencia && sala) {
                infoExtraida.push({ dataAudiencia, sala, ...item });
            }
        }
        return infoExtraida;
    };

    const handleImportarSalas = async () => {
        if (selectedEndpoints.length === 0) {
            message.warning('Por favor, selecione pelo menos um endpoint.');
            return;
        }

        if (!selectedMonth) {
            message.warning('Por favor, selecione o mês.');
            return;
        }

        const [ano, mes] = [selectedMonth.year(), selectedMonth.month() + 1];

        setLoading(true);
        setIsModalVisible(false);

        const datasDoMes = gerarDatasDoMes(ano, mes);
        const totalRequests = datasDoMes.length * selectedEndpoints.length;
        let completedRequests = 0;
        const salasImportadas = {};

        for (const data of datasDoMes) {
            const fetchPromises = selectedEndpoints.map(endpoint => 
                buscarDados(data, endpoint).then(dados => {
                    if (dados) {
                        const infoExtraida = extrairInfo(dados);
                        if (infoExtraida.length > 0) {
                            infoExtraida.forEach(info => {
                                const dataSimples = info.dataAudiencia.split('T')[0];
                                if (!salasImportadas[endpoint]) {
                                    salasImportadas[endpoint] = {};
                                }
                                if (!salasImportadas[endpoint][info.sala]) {
                                    salasImportadas[endpoint][info.sala] = {};
                                }
                                if (!salasImportadas[endpoint][info.sala][dataSimples]) {
                                    salasImportadas[endpoint][info.sala][dataSimples] = [];
                                }
                                salasImportadas[endpoint][info.sala][dataSimples].push(info);
                            });
                        }
                    }
                    completedRequests++;
                    setProgress(Math.floor((completedRequests / totalRequests) * 100));
                })
            );
            await Promise.all(fetchPromises);
        }

        const groupedByComarca = Object.keys(salasImportadas).reduce((acc, endpoint) => {
            const comarca = endpoints.find(ep => ep.value === parseInt(endpoint))?.comarca;
            if (!acc[comarca]) {
                acc[comarca] = [];
            }
            acc[comarca].push({
                endpoint,
                nome: endpoints.find(ep => ep.value === parseInt(endpoint))?.label || `Endpoint ${endpoint}`,
                salas: Object.keys(salasImportadas[endpoint]).map(sala => ({
                    sala,
                    datas: salasImportadas[endpoint][sala]
                }))
            });
            return acc;
        }, {});

        setSalas(groupedByComarca);
        setLoading(false);
        setImportacaoConcluida(true);
    };

    useEffect(() => {
        if (importacaoConcluida) {
            message.success('Importação concluída com sucesso!');
            setConfirmarSalvar(true);
        }
    }, [importacaoConcluida]);

    const handleSalvarDados = async () => {
        const salasParaSalvar = [];

        Object.keys(salas).forEach((comarca) => {
            salas[comarca].forEach((juizado) => {
                juizado.salas.forEach((sala) => {
                    Object.keys(sala.datas).forEach((data) => {
                        const quantidade_audiencias = sala.datas[data].length;
                        const sala_virtual_id = getIdDaSalaVirtual(sala.sala); // Função fictícia para pegar o ID da sala
                        salasParaSalvar.push({
                            sala_virtual_id,
                            data_audiencia: data,
                            quantidade_audiencias,
                            status: 'Ativo' // ou outro status conforme a lógica do seu sistema
                        });
                    });
                });
            });
        });

        try {
            const response = await salvarDisponibilidade(salasParaSalvar);
            message.success('Dados salvos com sucesso!');
        } catch (error) {
            message.error('Erro ao salvar os dados.');
        }

        setConfirmarSalvar(false);
        setImportacaoConcluida(false);
    };

    const handleCancelarSalvar = () => {
        message.info('Os dados importados não foram salvos.');
        setConfirmarSalvar(false);
        setImportacaoConcluida(false);
    };

    const handleEndpointChange = (value) => {
        // Se "Selecionar Todos" for selecionado, selecione todos os endpoints disponíveis
        if (value.includes('all')) {
            setSelectedEndpoints(endpoints.map(endpoint => endpoint.value));
        } else {
            setSelectedEndpoints(value);
        }
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const showImportModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCalendarModalCancel = () => {
        setCalendarModalVisible(false);
    };

    const showCalendarModal = (sala, datas) => {
        setSelectedSala(sala);
        setSelectedDates(Object.keys(datas));
        setCalendarModalVisible(true);
    };

    const dateCellRender = (date) => {
        const formattedDate = date.format('YYYY-MM-DD');

        let audiencias = [];
        
        for (const comarca in salas) {
            const juizados = salas[comarca];
            
            for (const juizado of juizados) {
                const salaEncontrada = juizado.salas.find(sala => sala.sala === selectedSala);
                
                if (salaEncontrada) {
                    const datas = salaEncontrada.datas[formattedDate];
                    
                    if (datas) {
                        audiencias = [...audiencias, ...datas];
                    }
                }
            }
        }

        if (audiencias.length > 0) {
            return (
                <div className="ant-picker-cell-inner ant-picker-calendar-date">
                    <div className="ant-picker-calendar-date-content">
                        <div style={{ textAlign: 'center', width: '100%', margin: '0px auto' }}>
                            <div style={{ 
                                fontSize: '10px', 
                                color: '#fff', 
                                backgroundColor: '#1890ff', 
                                borderRadius: '5px', 
                                padding: '0.5px 6px', 
                            }}>
                                {audiencias.length} audiências
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div>
            <HeaderSection
                title="Disponibilidade de Salas Virtuais"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button type="primary" onClick={showImportModal}>
                    Importar Salas
                </Button>
            </HeaderSection>
            <div className="table-container" style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <Collapse accordion>
                    {Object.entries(salas).map(([comarca, juizados]) => (
                        Array.isArray(juizados) && (
                            <Panel header={comarca} key={comarca}>
                                <Collapse accordion>
                                    {juizados.map(juizado => (
                                        <Panel header={juizado.nome} key={juizado.endpoint}>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={juizado.salas}
                                                renderItem={sala => (
                                                    <List.Item
                                                        actions={[
                                                            <Tooltip title="Ver Calendário">
                                                                <Button
                                                                    type="link"
                                                                    icon={<CalendarOutlined />}
                                                                    onClick={() => showCalendarModal(sala.sala, sala.datas)}
                                                                />
                                                            </Tooltip>
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            title={`Sala: ${sala.sala}`}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Panel>
                        )
                    ))}
                </Collapse>
            </div>
            <Modal
                title="Selecione os Endpoints e o Mês"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="import" type="primary" onClick={handleImportarSalas}>
                        Importar
                    </Button>,
                ]}
            >
                <div>
                    <Select
                        mode="multiple"
                        placeholder="Selecione os endpoints"
                        onChange={handleEndpointChange}
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        value={selectedEndpoints.includes('all') ? endpoints.map(endpoint => endpoint.value) : selectedEndpoints}
                    >
                        <Option key="all" value="all">Selecionar Todos</Option>
                        {endpoints.map(endpoint => (
                            <Option key={endpoint.value} value={endpoint.value} label={endpoint.label}>
                                {endpoint.label}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <DatePicker
                        picker="month"
                        placeholder="Selecione o mês"
                        onChange={handleMonthChange}
                        style={{ width: '100%' }}
                    />
                </div>
            </Modal>
            {(loading || confirmarSalvar) && (
                <Modal
                    visible={loading || confirmarSalvar}
                    footer={null}
                    closable={false}
                    centered
                >
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Progress type="circle" percent={progress} />
                        <div>
                            <p>{`Importando dados do endpoint: ${currentEndpoint}`}</p>
                            <p>{`Data: ${currentData}`}</p>
                        </div>
                        {importacaoConcluida && (
                            <div>
                                <p>Deseja salvar os dados importados no banco de dados?</p>
                                <Button type="primary" onClick={handleSalvarDados}>Salvar</Button>
                                <Button style={{ marginLeft: '10px' }} onClick={handleCancelarSalvar}>Cancelar</Button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
            <Modal
                title={`Calendário de Audiências - ${selectedSala}`}
                visible={calendarModalVisible}
                onCancel={handleCalendarModalCancel}
                footer={null}
                centered
                bodyStyle={{ padding: 0 }}
                width={800}
            >
                <div style={{ padding: '16px' }}>
                    <Calendar 
                        dateCellRender={dateCellRender} 
                        fullscreen={false} 
                        style={{ width: '100%', height: '100%' }} 
                    />
                </div>
            </Modal>
        </div>
    );
};

export default DisponibilidadeSalaVirtual;
