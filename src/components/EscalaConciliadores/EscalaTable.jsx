import React from 'react';
import { Tooltip } from 'antd';

const EscalaTable = ({
    juizadosComSalas, diasDoMes, mes, ano, handleCellClick, isWeekend, getDayOfWeek, getInitials
}) => {
    const formatDayMonth = (day) => day < 10 ? `0${day}` : day;

    const isDiaFuncionamento = (diasFunc, dayOfWeek) => {
        const mapDias = {
            'Domingo': 0,
            'Segunda': 1,
            'Terça': 2,
            'Quarta': 3,
            'Quinta': 4,
            'Sexta': 5,
            'Sábado': 6,
        };
        return diasFunc.some(dia => mapDias[dia] === dayOfWeek);
    };

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
                            {juizado.salas.map(sala => {
                                const diasFuncionamento = sala.nome_dia.split(', ');
                                return (
                                    <React.Fragment key={`sala-${sala.sala_virtual_id}`}>
                                        <tr>
                                            <td className="conciliador-column" style={{ textAlign: 'right' }}>
                                                {sala.nome_sala_virtual}
                                            </td>
                                            {[...Array(diasDoMes).keys()].map(d => {
                                                const dia = d + 1;
                                                const formattedDate = `${ano}-${formatDayMonth(mes)}-${formatDayMonth(dia)}`;
                                                const dayOfWeek = new Date(ano, mes - 1, dia).getDay();
                                                const conciliador = sala.conciliadores?.find(conciliador =>
                                                    conciliador.disponibilidades?.some(disponibilidade => disponibilidade.data === formattedDate)
                                                );
                                                const cellClass = conciliador ? 'work' : 'default';
                                                const isEnabled = isDiaFuncionamento(diasFuncionamento, dayOfWeek);
                                                return (
                                                    <Tooltip key={dia} title={cellClass === 'work' ? conciliador.nome_conciliador : 'Disponível'}>
                                                        <td
                                                            className={`${cellClass} ${isWeekend(dia, mes, ano) ? 'weekend' : ''}`}
                                                            onClick={isEnabled ? () => handleCellClick(conciliador?.conciliador_id, dia) : undefined}
                                                            style={{
                                                                cursor: isEnabled ? 'pointer' : 'not-allowed',
                                                                backgroundColor: isEnabled ? (cellClass === 'work' ? '#d0f0c0' : (isWeekend(dia, mes, ano) ? '#e0e0e0' : 'white')) : '#e0e0e0',
                                                                position: 'relative',
                                                                opacity: isEnabled ? 1 : 0.5
                                                            }}
                                                        >
                                                            {isEnabled && cellClass === 'work' && getInitials(conciliador.nome_conciliador)}
                                                        </td>
                                                    </Tooltip>
                                                );
                                            })}
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EscalaTable;
