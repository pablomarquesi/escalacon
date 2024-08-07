import React from 'react';
import { Modal, Select, DatePicker, Button, Result } from 'antd';

const { Option } = Select;

const ImportModal = ({ 
    visible, 
    handleCancel, 
    handleImportarSalas, 
    handleEndpointChange, 
    handleMonthChange, 
    selectedEndpoints, 
    endpoints,
    importSuccess,
    resumoImportacao,
    handleConfirmarImportacao
}) => {
    return (
        <Modal
            title="Selecione o(s) Juizado(s) e o mês"
            visible={visible}
            onCancel={handleCancel}
            footer={importSuccess ? [
                <Button key="confirm" type="primary" onClick={handleConfirmarImportacao}>
                    Confirmar Importação
                </Button>
            ] : [
                <Button key="cancel" onClick={handleCancel}>
                    Cancelar
                </Button>,
                <Button key="import" type="primary" onClick={handleImportarSalas}>
                    Importar
                </Button>,
            ]}
        >
            {importSuccess ? (
                <Result
                    status="success"
                    title="Importação Concluída com Sucesso"
                    subTitle="Veja o resumo das salas importadas abaixo."
                    extra={
                        <div className="import-summary">
                            {Object.keys(resumoImportacao).map((comarca) => (
                                <div key={comarca}>
                                    <h3>{comarca}</h3>
                                    {resumoImportacao[comarca].map((juizado) => (
                                        <div key={juizado.endpoint}>
                                            <h4>{juizado.nome}</h4>
                                            <ul>
                                                {juizado.salas.map((sala) => (
                                                    <li key={sala.sala}>
                                                        {sala.sala}: {Object.keys(sala.datas).length} datas importadas
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    }
                />
            ) : (
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
                    <div style={{ marginTop: '16px' }}>
                        <DatePicker
                            picker="month"
                            placeholder="Selecione o mês"
                            onChange={handleMonthChange}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ImportModal;
