import React from 'react';
import { Modal, Select } from 'antd';

const { Option } = Select;

const ImportarJuizadoModal = ({ visible, juizados, selectedJuizados, setSelectedJuizados, onConfirm, onCancel }) => {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            title="Selecione os Juizados para Importação"
            visible={visible}
            onCancel={onCancel}
            onOk={handleConfirm}
        >
            <Select
                mode="multiple"
                placeholder="Selecione os juizados"
                value={selectedJuizados.map(j => j.juizado_id)}
                onChange={(values) => {
                    const selected = juizados.filter(j => values.includes(j.juizado_id));
                    setSelectedJuizados(selected);
                }}
                style={{ width: '100%' }}
            >
                {juizados.map(juizado => (
                    <Option key={juizado.juizado_id} value={juizado.juizado_id}>
                        {juizado.nome_juizado}
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};

export default ImportarJuizadoModal;
