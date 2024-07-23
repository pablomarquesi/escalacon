import React from 'react';
import { Tooltip } from 'antd';

const EscalaTable = ({
    juizadosComSalas, diasDoMes, mes, ano, handleCellClick, isWeekend, getDayOfWeek, getFirstAndLastName
}) => (
    <div className="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th className="conciliador-column">Conciliador</th>
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
                    <>
                        <tr key={`juizado-${juizado.juizado_id}`} className="juizado-row">
                            <td colSpan={diasDoMes + 1}>{juizado.nome_juizado}</td>
                        </tr>
                        {juizado.conciliadores.map(conciliador => (
                            <tr key={conciliador.conciliador_id}>
                                <td className="conciliador-column" style={{ textAlign: 'right' }}>
                                    {getFirstAndLastName(conciliador.nome_conciliador)}
                                    <br />
                                    <Tooltip title={conciliador.sala}>
                                        <span className="sala-nome">{conciliador.sala.length > 15 ? `${conciliador.sala.slice(0, 15)}...` : conciliador.sala}</span>
                                    </Tooltip>
                                </td>
                                {[...Array(diasDoMes).keys()].map(d => {
                                    const dia = d + 1;
                                    const disponibilidade = conciliador.disponibilidades.find(disponibilidade => {
                                        const [dispAno, dispMes] = disponibilidade.mes.split('-');
                                        return parseInt(dispMes) === mes && parseInt(dispAno) === ano &&
                                            disponibilidade.dia_da_semana === getDayOfWeek(dia, mes, ano);
                                    });
                                    const cell = disponibilidade ? 'work' : '';
                                    return (
                                        <Tooltip key={dia} title={cell ? conciliador.nome_conciliador : 'Disponível'}>
                                            <td
                                                className={`${cell || 'default'} ${isWeekend(dia, mes, ano) ? 'weekend' : ''}`}
                                                onClick={() => handleCellClick(conciliador.conciliador_id, dia)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: cell === 'work' ? '#d0f0c0' : (isWeekend(dia, mes, ano) ? '#e0e0e0' : 'white'),
                                                    position: 'relative'
                                                }}
                                            >
                                                {cell && conciliador.nome_conciliador}
                                            </td>
                                        </Tooltip>
                                    );
                                })}
                            </tr>
                        ))}
                    </>
                ))}
            </tbody>
        </table>
    </div>
);

export default EscalaTable;
