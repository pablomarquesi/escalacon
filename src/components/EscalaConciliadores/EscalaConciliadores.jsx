import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Button, Modal, message, Progress } from 'antd';
import EscalaNavigation from './EscalaNavigation';
import EscalaTable from './EscalaTable';
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

    const API_URL = 'http://localhost:3000/api'; // Base URL da sua API

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

    const fetchJuizados = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/juizados`);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao buscar juizados');
            }
        } catch (error) {
            console.error('Erro ao buscar juizados:', error);
            message.error('Erro ao buscar juizados.');
            return [];
        }
    }, [API_URL]);

    // Função para buscar a escala da API local
    const fetchEscalaFromAPI = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/audiencias?mes=${mes}&ano=${ano}`);
            if (response.ok) {
                const data = await response.json();
                const salasDict = {};

                data.forEach(audiencia => {
                    const { nome_sala_virtual, data_audiencia, nome_juizado } = audiencia;
                    if (!salasDict[nome_juizado]) {
                        salasDict[nome_juizado] = {};
                    }
                    if (!salasDict[nome_juizado][nome_sala_virtual]) {
                        salasDict[nome_juizado][nome_sala_virtual] = [];
                    }
                    salasDict[nome_juizado][nome_sala_virtual].push(data_audiencia);
                });

                setSchedule({ [`${ano}-${mes}`]: salasDict });
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

    // Função para importar as audiências e cadastrar salas virtuais
    const handleImportarSalas = useCallback(async () => {
        setLoading(true);
        setProgress(0);

        try {
            const juizados = await fetchJuizados();
            const datasDoMes = gerarDatasDoMes(ano, mes);
            const audienciasPorDia = {};

            const totalRequests = datasDoMes.length * juizados.length;
            let completedRequests = 0;

            for (const data of datasDoMes) {
                const fetchPromises = juizados.map(async juizado => {
                    const { juizado_id, endpoint_id } = juizado;
                    const url = `https://plenarios-api.tjmt.jus.br/consulta-pje/obter-pauta-audiencia/${data}/${endpoint_id}`;
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const dados = await response.json();
                            if (dados) {
                                const infoExtraida = dados.map(item => ({
                                    dataAudiencia: item.dataAudiencia,
                                    sala: item.sala,
                                    juizado_id: juizado_id
                                }));
                                if (infoExtraida.length > 0) {
                                    if (!audienciasPorDia[juizado_id]) {
                                        audienciasPorDia[juizado_id] = {};
                                    }
                                    audienciasPorDia[juizado_id][data] = infoExtraida;
                                }
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

            // Inserção de dados no banco local
            for (const [juizado_id, audiencias] of Object.entries(audienciasPorDia)) {
                for (const [data, audienciasList] of Object.entries(audiencias)) {
                    for (const audiencia of audienciasList) {
                        const { sala } = audiencia;

                        // 1. Verificar se a sala já existe
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

                        // 2. Se a sala não existir, cadastrar a sala virtual
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
                                    tipo_pauta_id: 1 // Use o valor correto aqui se necessário
                                }),
                            });

                            const novaSala = await cadastrarSalaResponse.json();
                            salaVirtualId = novaSala.sala_virtual_id;
                        } else {
                            salaVirtualId = salaExiste.sala_virtual_id;
                        }

                        // 3. Cadastrar a audiência
                        await fetch(`${API_URL}/audiencias`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                juizado_id: juizado_id,
                                sala_virtual_id: salaVirtualId,
                                data_audiencia: data,
                                status: 'Ativo'
                            }),
                        });
                    }
                }
            }

            message.success('Escala atualizada com sucesso!');
            fetchEscalaFromAPI(); // Atualizar a tabela após a importação

        } catch (error) {
            console.error('Erro ao importar audiências:', error);
            message.error('Erro ao importar audiências.');
        } finally {
            setLoading(false);
        }
    }, [API_URL, mes, ano, gerarDatasDoMes, fetchEscalaFromAPI, fetchJuizados]);

    useEffect(() => {
        fetchEscalaFromAPI();
    }, [fetchEscalaFromAPI]);

    const handlePrevMonth = useCallback(() => {
        if (mes === 1) {
            setMes(12);
            setAno(ano - 1);
        } else {
            setMes(mes - 1);
        }
    }, [mes, ano]);

    const handleNextMonth = useCallback(() => {
        if (mes === 12) {
            setMes(1);
            setAno(ano + 1);
        } else {
            setMes(mes + 1);
        }
    }, [mes, ano]);

    const diasDoMes = useMemo(() => {
        return getDaysInMonth(mes, ano);
    }, [mes, ano]);

    const currentMonthKey = `${ano}-${mes}`;
    const currentSchedule = schedule[currentMonthKey];

    // Verifica se existe alguma audiência agendada para o mês corrente
    const hasScheduleData = currentSchedule && Object.keys(currentSchedule).some(juizado => {
        return Object.keys(currentSchedule[juizado]).some(sala => currentSchedule[juizado][sala].some(date => {
            const audienciaMes = new Date(date).getMonth() + 1;
            return audienciaMes === mes;
        }));
    });

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
                <Modal
                    open={loading}
                    footer={null}
                    closable={false}
                    centered
                >
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Progress type="circle" percent={progress} />
                    </div>
                </Modal>
            )}
            {loadedMonths[currentMonthKey] ? (
                hasScheduleData ? (
                    <EscalaTable
                        salasDict={currentSchedule}
                        diasDoMes={diasDoMes}
                        mes={mes}
                        ano={ano}
                        diasSemana={diasSemana}
                    />
                ) : (
                    <p>Não há audiências agendadas para este mês.</p>
                )
            ) : (
                <p>Carregando escala...</p>
            )}
        </div>
    );
};

export default EscalaConciliadores;
