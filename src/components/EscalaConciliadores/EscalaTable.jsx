import React, { useMemo } from 'react';
import { Tooltip } from 'antd';

const EscalaTable = ({
    salasDict, diasDoMes, mes, ano, diasSemana
}) => {
    const formatDayMonth = (day) => day < 10 ? `0${day}` : day;

    const renderedTable = useMemo(() => (
        <table>
            <thead>
                <tr>
                    <th className="conciliador-column">Sala Virtual</th>
                    {[...Array(diasDoMes).keys()].map(d => {
                        const dia = d + 1;
                        const isWeekend = new Date(ano, mes - 1, dia).getDay() === 0 || new Date(ano, mes - 1, dia).getDay() === 6;
                        return (
                            <th key={dia} className={isWeekend ? 'weekend' : ''}>
                                {dia}
                                <br />
                                <span className="dia-semana">
                                    {diasSemana[new Date(ano, mes - 1, dia).getDay()].substring(0, 3).toLowerCase()}
                                </span>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {Object.keys(salasDict).map(endpoint => (
                    <React.Fragment key={endpoint}>
                        <tr>
                            <td colSpan={diasDoMes + 1} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Endpoint {endpoint}
                            </td>
                        </tr>
                        {Object.keys(salasDict[endpoint]).map(sala => (
                            <tr key={sala}>
                                <td className="conciliador-column" style={{ textAlign: 'right' }}>
                                    {sala}
                                </td>
                                {[...Array(diasDoMes).keys()].map(d => {
                                    const dia = d + 1;
                                    const formattedDate = `${ano}-${formatDayMonth(mes)}-${formatDayMonth(dia)}`;
                                    const isScheduled = salasDict[endpoint][sala].includes(formattedDate);
                                    const isWeekend = new Date(ano, mes - 1, dia).getDay() === 0 || new Date(ano, mes - 1, dia).getDay() === 6;
                                    return (
                                        <Tooltip key={dia} title={isScheduled ? `Audiência` : ''}>
                                            <td
                                                className={`${isWeekend ? 'weekend' : 'default'}`}
                                                style={{
                                                    backgroundColor: isScheduled ? '#d0f0c0' : isWeekend ? '#e0e0e0' : 'white',
                                                    cursor: 'default'
                                                }}
                                            />
                                        </Tooltip>
                                    );
                                })}
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    ), [salasDict, diasDoMes, mes, ano, diasSemana]);

    return (
        <div className="table-wrapper">
            {renderedTable}
        </div>
    );
};

export default EscalaTable;
