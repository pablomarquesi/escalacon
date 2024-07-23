import React from 'react';
import { Row, Col, Select } from 'antd';

const { Option } = Select;

const FilterBar = ({ comarca, setComarca, comarcas, juizado, setJuizado, juizados, salaVirtual, setSalaVirtual, salasVirtuais }) => {
    return (
        <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
            <Col>
                <span>Filtrar:</span>
            </Col>
            <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: 8 }}>Comarca:</label>
                    <Select
                        showSearch
                        placeholder="Selecione a comarca"
                        value={comarca}
                        onChange={setComarca}
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        <Option value={null}>Todas</Option>
                        {comarcas.map((comarca) => (
                            <Option key={comarca.comarca_id} value={comarca.comarca_id}>
                                {comarca.nome_comarca}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Col>
            <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: 8 }}>Juizado:</label>
                    <Select
                        showSearch
                        placeholder="Selecione o juizado"
                        value={juizado}
                        onChange={setJuizado}
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        <Option value={null}>Todos</Option>
                        {juizados.map((juizado) => (
                            <Option key={juizado.juizado_id} value={juizado.juizado_id}>
                                {juizado.nome_juizado}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Col>
            <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: 8 }}>Sala Virtual:</label>
                    <Select
                        showSearch
                        placeholder="Selecione a sala virtual"
                        value={salaVirtual}
                        onChange={setSalaVirtual}
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        <Option value={null}>Todas</Option>
                        {salasVirtuais.map((sala) => (
                            <Option key={sala.sala_virtual_id} value={sala.sala_virtual_id}>
                                {sala.nome_sala_virtual}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Col>
        </Row>
    );
};

export default FilterBar;
