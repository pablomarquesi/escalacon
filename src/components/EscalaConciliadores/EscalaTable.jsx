import React from 'react';
import { Tooltip } from 'antd';

const EscalaTable = ({
    juizadosComSalas, diasDoMes, mes, ano, handleCellClick, isWeekend, getDayOfWeek, getFirstName
}) => {
    const formatDayMonth = (day) => day < 10 ? `0${day}` : day;

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th className="conciliador-column">Sala Virtual</th>
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
                        <React.Fragment key={`juizado-${juizado.juizado_id}`}>
                            <tr className="juizado-row">
                                <td colSpan={diasDoMes + 1}>{juizado.nome_juizado}</td>
                            </tr>
                            {juizado.salas.map(sala => (
                                <React.Fragment key={`sala-${sala.id}`}>
                                    <tr>
                                        <td className="conciliador-column" style={{ textAlign: 'right' }}>
                                            {sala.nome_sala_virtual}
                                        </td>
                                        {[...Array(diasDoMes).keys()].map(d => {
                                            const dia = d + 1;
                                            const formattedDate = `${ano}-${formatDayMonth(mes)}-${formatDayMonth(dia)}`;
                                            const conciliador = sala.conciliadores?.find(conciliador =>
                                                conciliador.disponibilidades?.some(disponibilidade => disponibilidade.data === formattedDate)
                                            );
                                            const cellClass = conciliador ? 'work' : 'default';
                                            return (
                                                <Tooltip key={dia} title={cellClass === 'work' ? conciliador.nome_conciliador : 'Disponível'}>
                                                    <td
                                                        className={`${cellClass} ${isWeekend(dia, mes, ano) ? 'weekend' : ''}`}
                                                        onClick={() => handleCellClick(conciliador?.conciliador_id, dia)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: cellClass === 'work' ? '#d0f0c0' : (isWeekend(dia, mes, ano) ? '#e0e0e0' : 'white'),
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        {cellClass === 'work' && getFirstName(conciliador.nome_conciliador)}
                                                    </td>
                                                </Tooltip>
                                            );
                                        })}
                                    </tr>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EscalaTable;
