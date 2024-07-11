import React, { useState } from 'react';
import { Modal, Select, Checkbox } from 'antd';

const { Option } = Select;

const DistributeModal = ({ 
    isDistributeModalVisible, 
    handleDistribute, 
    setIsDistributeModalVisible, 
    getMonthOptions, 
    setSelectedMeses,
    comarcas,
    juizados,
    handleComarcaChange,
    handleJuizadoChange,
    selectedComarca,
    selectedJuizado
}) => {
    return (
        <Modal
            title="Selecionar Meses para Distribuir"
            visible={isDistributeModalVisible}
            onOk={handleDistribute}
            onCancel={() => setIsDistributeModalVisible(false)}
        >
            <div style={{ marginBottom: 16 }}>
                <label>Comarca:</label>
                <Select
                    showSearch
                    placeholder="Selecione a comarca"
                    value={selectedComarca}
                    onChange={handleComarcaChange}
                    style={{ width: '100%' }}
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
            <div style={{ marginBottom: 16 }}>
                <label>Juizado:</label>
                <Select
                    showSearch
                    placeholder="Selecione o juizado"
                    value={selectedJuizado}
                    onChange={handleJuizadoChange}
                    style={{ width: '100%' }}
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
            <Checkbox.Group options={getMonthOptions()} onChange={(values) => setSelectedMeses(values)} style={{ display: 'flex', flexDirection: 'column' }} />
        </Modal>
    );
};

export default DistributeModal;
