import React, { useState, useCallback, useMemo } from 'react';
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

    const buscarDados = useCallback(async (data, endpoint) => {
        const url = `https://plenarios-api.tjmt.jus.br/consulta-pje/obter-pauta-audiencia/${data}/${endpoint}`;
        try {
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
    }, []);

    const extrairInfo = useCallback((dados) => {
        const infoExtraida = [];
        for (const item of dados) {
            const dataAudiencia = item.dataAudiencia;
            const sala = item.sala;
            if (dataAudiencia && sala) {
                infoExtraida.push({ dataAudiencia, sala });
            }
        }
        return infoExtraida;
    }, []);

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

    const handleImportarSalas = useCallback(async () => {
        setLoading(true);
        const datasDoMes = gerarDatasDoMes(ano, mes);
        const audienciasPorDia = {};

        const endpoints = [380, 374, 394, 532, 369, 378];
        const totalRequests = datasDoMes.length * endpoints.length;
        let completedRequests = 0;

        for (const data of datasDoMes) {
            const fetchPromises = endpoints.map(endpoint => 
                buscarDados(data, endpoint).then(dados => {
                    if (dados) {
                        const infoExtraida = extrairInfo(dados);
                        if (infoExtraida.length > 0) {
                            if (!audienciasPorDia[endpoint]) {
                                audienciasPorDia[endpoint] = {};
                            }
                            audienciasPorDia[endpoint][data] = infoExtraida;
                        }
                    }
                    completedRequests++;
                    setProgress(Math.floor((completedRequests / totalRequests) * 100));
                })
            );
            await Promise.all(fetchPromises);
        }

        const salasDict = {};
        for (const [endpoint, audiencias] of Object.entries(audienciasPorDia)) {
            salasDict[endpoint] = {};
            for (const [data, audienciasList] of Object.entries(audiencias)) {
                for (const audiencia of audienciasList) {
                    const sala = audiencia.sala;
                    if (!salasDict[endpoint][sala]) {
                        salasDict[endpoint][sala] = [];
                    }
                    salasDict[endpoint][sala].push(data);
                }
            }
        }

        setSchedule(prevSchedule => ({ ...prevSchedule, [`${ano}-${mes}`]: salasDict }));
        setLoadedMonths(prevLoadedMonths => ({ ...prevLoadedMonths, [`${ano}-${mes}`]: true }));
        setLoading(false);
    }, [ano, mes, buscarDados, extrairInfo, gerarDatasDoMes]);

    const diasDoMes = useMemo(() => getDaysInMonth(mes, ano), [mes, ano, getDaysInMonth]);
    const currentMonthKey = `${ano}-${mes}`;
    const currentSchedule = schedule[currentMonthKey];

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
                        Importar salas
                    </Button>
                </Col>
            </Row>
            {loading && (
                <Modal
                    visible={loading}
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
                currentSchedule ? (
                    <EscalaTable
                        salasDict={currentSchedule}
                        diasDoMes={diasDoMes}
                        mes={mes}
                        ano={ano}
                        diasSemana={diasSemana}
                    />
                ) : (
                    <p>Escala ainda não gerada</p>
                )
            ) : (
                <p>Escala ainda não gerada</p>
            )}
        </div>
    );
};

export default EscalaConciliadores;
