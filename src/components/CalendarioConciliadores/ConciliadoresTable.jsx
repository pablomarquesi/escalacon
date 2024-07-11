// ConciliadoresTable.jsx
import React from 'react';
import { Tooltip } from 'antd';

const ConciliadoresTable = ({
    currentConciliadores, diasDoMes, calendario, mes, ano, handleCellClick, isWeekend, getDayOfWeek, getFirstAndLastName
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
                {currentConciliadores.map(conciliador => (
                    <tr key={conciliador.conciliador_id}>
                        <td className="conciliador-column" style={{ textAlign: 'right' }}>
                            {getFirstAndLastName(conciliador.nome_conciliador)}
                        </td>
                        {[...Array(diasDoMes).keys()].map(d => {
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
);

export default ConciliadoresTable;
