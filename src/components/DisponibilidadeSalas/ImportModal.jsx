import React from 'react';
import { Modal, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

const ImportModal = ({ 
    visible, 
    handleCancel, 
    handleImportarSalas, 
    handleEndpointChange, 
    handleMonthChange, 
    selectedEndpoints, 
    endpoints 
}) => {
    return (
        <Modal
            title="Selecione o(s) Juizado(s) e o mês"
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancelar
                </Button>,
                <Button key="import" type="primary" onClick={handleImportarSalas}>
                    Importar
                </Button>,
            ]}
        >
            <div>
                <Select
                    mode="multiple"
                    placeholder="Selecione os juizados"
                    onChange={handleEndpointChange}
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    value={selectedEndpoints.includes('all') ? endpoints.map(endpoint => endpoint.value) : selectedEndpoints}
                >
                    <Option key="all" value="all">Selecionar Todos</Option>
                    {endpoints.map(endpoint => (
                        <Option key={endpoint.value} value={endpoint.value} label={endpoint.label}>
                            {endpoint.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <div style={{ marginTop: '16px' }}>
                <DatePicker
                    picker="month"
                    placeholder="Selecione o mês"
                    onChange={handleMonthChange}
                    style={{ width: '100%' }}
                />
            </div>
        </Modal>
    );
};

export default ImportModal;
