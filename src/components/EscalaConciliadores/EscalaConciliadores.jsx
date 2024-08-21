import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Button, Modal, message, Progress, Spin } from 'antd';
import EscalaNavigation from './EscalaNavigation';
import EscalaTable from './EscalaTable';
import ImportarJuizadoModal from './ImportarJuizadoModal';
import './EscalaConciliadores.css';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const EscalaConciliadores = () => {
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadedMonths, setLoadedMonths] = useState({});
    const [juizados, setJuizados] = useState([]);
    const [selectedJuizados, setSelectedJuizados] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const API_URL = 'http://localhost:3000/api';

    const fetchJuizados = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/juizados`);
            if (response.ok) {
                const data = await response.json();
                setJuizados(data);
                return data;
            } else {
                message.error('Erro ao buscar juizados.');
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar juizados:', error);
            message.error('Erro ao buscar juizados.');
            return [];
        }
    }, [API_URL]);

    const getDaysInMonth = useCallback((month, year) => {
        return new Date(year, month, 0).getDate();
    }, []);

    const gerarDatasDoMes = useCallback((ano, mes) => {
        const datas = [];
        let dataAtual = new Date(ano, mes - 1, 1);
        while (dataAtual.getMonth() + 1 === mes) {
            datas.push(dataAtual.toISOString().split('T')[0]);
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        return datas;
    }, []);

    const fetchEscalaFromAPI = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/audiencias`);
            if (response.ok) {
                const data = await response.json();
                const salasDict = {};
    
                data.forEach(audiencia => {
                    const { nome_sala_virtual, data_audiencia, nome_juizado } = audiencia;
                    const endpoint = nome_juizado;
    
                    if (!salasDict[endpoint]) {
                        salasDict[endpoint] = {};
                    }
                    if (!salasDict[endpoint][nome_sala_virtual]) {
                        salasDict[endpoint][nome_sala_virtual] = [];
                    }
                    salasDict[endpoint][nome_sala_virtual].push(data_audiencia);
                });
    
                setSchedule(prevSchedule => ({ ...prevSchedule, [`${ano}-${mes}`]: salasDict }));
                setLoadedMonths(prevLoadedMonths => ({ ...prevLoadedMonths, [`${ano}-${mes}`]: true }));
            } else {
                message.error('Erro ao buscar dados da escala.');
            }
        } catch (error) {
            console.error('Erro ao buscar dados da escala:', error);
            message.error('Erro ao buscar dados da escala.');
        } finally {
            setLoading(false);
        }
    }, [mes, ano, API_URL]);

    const handleImportarSalas = useCallback(async () => {
        await fetchJuizados();
        setIsModalVisible(true);
    }, [fetchJuizados]);

    const handleModalOk = useCallback(async () => {
        if (selectedJuizados.length === 0) {
            message.warning('Por favor, selecione ao menos um juizado.');
            return;
        }

        setIsImporting(true);
        setProgress(0);
        setIsModalVisible(false);

        try {
            const datasDoMes = gerarDatasDoMes(ano, mes);
            const audienciasPorDia = {};

            const totalRequests = datasDoMes.length * selectedJuizados.length;
            let completedRequests = 0;

            for (const data of datasDoMes) {
                const fetchPromises = selectedJuizados.map(async juizado => {
                    const { juizado_id, endpoint_id } = juizado;
                    const url = `https://plenarios-api.tjmt.jus.br/consulta-pje/obter-pauta-audiencia/${data}/${endpoint_id}`;
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const dados = await response.json();
                            if (dados) {
                                const audiencias = await Promise.all(dados.map(async item => {
                                    const sala = item.sala;
                                    if (sala) {
                                        const verificarSalaResponse = await fetch(`${API_URL}/salasvirtuais/verificar`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ 
                                                juizado_id: juizado_id, 
                                                nome_sala_virtual: sala 
                                            }),
                                        });

                                        const salaExiste = await verificarSalaResponse.json();

                                        let salaVirtualId;
                                        if (!salaExiste.exists) {
                                            const cadastrarSalaResponse = await fetch(`${API_URL}/salasvirtuais`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    juizado_id: juizado_id,
                                                    nome_sala_virtual: sala,
                                                    tipo_pauta_id: 1 
                                                }),
                                            });

                                            const novaSala = await cadastrarSalaResponse.json();
                                            salaVirtualId = novaSala.sala_virtual_id;
                                        } else {
                                            salaVirtualId = salaExiste.sala_virtual_id;
                                        }

                                        return {
                                            dataAudiencia: item.dataAudiencia,
                                            salaVirtualId,
                                            juizado_id
                                        };
                                    }
                                    return null;
                                }));

                                audiencias.forEach(audiencia => {
                                    if (audiencia && audiencia.salaVirtualId) {
                                        if (!audienciasPorDia[juizado_id]) {
                                            audienciasPorDia[juizado_id] = {};
                                        }
                                        if (!audienciasPorDia[juizado_id][data]) {
                                            audienciasPorDia[juizado_id][data] = [];
                                        }
                                        audienciasPorDia[juizado_id][data].push(audiencia);
                                    }
                                });
                            }
                        } else {
                            console.error('Erro ao buscar dados:', response.status);
                        }
                    } catch (error) {
                        console.error('Erro ao buscar dados:', error);
                    }
                    completedRequests++;
                    setProgress(Math.floor((completedRequests / totalRequests) * 100));
                });

                await Promise.all(fetchPromises);
            }

            for (const [juizado_id, audiencias] of Object.entries(audienciasPorDia)) {
                for (const [data, audienciasList] of Object.entries(audiencias)) {
                    for (const audiencia of audienciasList) {
                        await fetch(`${API_URL}/audiencias`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                juizado_id: juizado_id,
                                sala_virtual_id: audiencia.salaVirtualId,
                                data_audiencia: data,
                                status: 'Ativo'
                            }),
                        });
                    }
                }
            }

            message.success('Escala atualizada com sucesso!');
            fetchEscalaFromAPI();

        } catch (error) {
            console.error('Erro ao importar audiências:', error);
            message.error('Erro ao importar audiências.');
        } finally {
            setIsImporting(false);
        }
    }, [API_URL, mes, ano, gerarDatasDoMes, fetchEscalaFromAPI, selectedJuizados]);

    useEffect(() => {
        fetchEscalaFromAPI();
    }, [fetchEscalaFromAPI]);

    const handlePrevMonth = useCallback(() => {
        setLoading(true);
        if (mes === 1) {
            setMes(12);
            setAno(ano - 1);
        } else {
            setMes(mes - 1);
        }
        fetchEscalaFromAPI().then(() => setLoading(false));
    }, [mes, ano, fetchEscalaFromAPI]);

    const handleNextMonth = useCallback(() => {
        setLoading(true);
        if (mes === 12) {
            setMes(1);
            setAno(ano + 1);
        } else {
            setMes(mes + 1);
        }
        fetchEscalaFromAPI().then(() => setLoading(false));
    }, [mes, ano, fetchEscalaFromAPI]);

    const diasDoMes = useMemo(() => {
        return new Date(ano, mes, 0).getDate();
    }, [mes, ano]);

    const currentMonthKey = `${ano}-${mes}`;
    const currentSchedule = schedule[currentMonthKey];

    const hasScheduleData = currentSchedule && Object.keys(currentSchedule).some(endpoint => {
        return Object.keys(currentSchedule[endpoint]).some(sala => 
            currentSchedule[endpoint][sala].some(date => {
                const audienciaMes = new Date(date).getMonth() + 1;
                return audienciaMes === mes;
            })
        );
    });

    const filteredSchedule = useMemo(() => {
        if (!currentSchedule) return {};
        const filtered = {};
        
        Object.keys(currentSchedule).forEach(endpoint => {
            const salasComAudiencias = Object.keys(currentSchedule[endpoint]).filter(sala => 
                currentSchedule[endpoint][sala].some(date => {
                    const audienciaMes = new Date(date).getMonth() + 1;
                    return audienciaMes === mes;
                })
            );
            if (salasComAudiencias.length > 0) {
                filtered[endpoint] = {};
                salasComAudiencias.forEach(sala => {
                    filtered[endpoint][sala] = currentSchedule[endpoint][sala];
                });
            }
        });
        
        return filtered;
    }, [currentSchedule, mes]);

    return (
        <div className="calendario-container">
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col><h2 style={{ margin: 0 }}>Escala das Salas Virtuais</h2></Col>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <EscalaNavigation 
                        mes={mes} 
                        ano={ano} 
                        handlePrevMonth={handlePrevMonth} 
                        handleNextMonth={handleNextMonth} 
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleImportarSalas}>
                        Atualizar Escala
                    </Button>
                </Col>
            </Row>
            {loading && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Spin tip="Carregando escala..." />
                </div>
            )}
            {!loading && loadedMonths[currentMonthKey] ? (
                hasScheduleData ? (
                    <EscalaTable
                        salasDict={filteredSchedule}
                        diasDoMes={diasDoMes}
                        mes={mes}
                        ano={ano}
                        diasSemana={diasSemana}
                    />
                ) : (
                    <p>Não há audiências agendadas para este mês.</p>
                )
            ) : (
                !loading && <p>Carregando escala...</p>
            )}
            <ImportarJuizadoModal
                visible={isModalVisible}
                juizados={juizados}
                selectedJuizados={selectedJuizados}
                setSelectedJuizados={setSelectedJuizados}
                onConfirm={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
            />
            <Modal
                visible={isImporting}
                footer={null}
                closable={false}
                centered
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Progress type="circle" percent={progress} />
                    <p>Importando dados...</p>
                </div>
            </Modal>
        </div>
    );
};

export default EscalaConciliadores;
