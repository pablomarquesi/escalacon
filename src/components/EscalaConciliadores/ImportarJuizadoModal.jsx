import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from 'antd';

const { Option } = Select;

const ImportarJuizadoModal = ({ visible, onClose, onSubmit, juizados }) => {
    const [selectedJuizados, setSelectedJuizados] = useState([]);

    useEffect(() => {
        if (visible) {
            setSelectedJuizados([]);  // Resetar a seleção quando o modal é aberto
        }
    }, [visible]);

    const handleConfirm = () => {
        const selected = juizados.filter(juizado => selectedJuizados.includes(juizado.juizado_id));
        onSubmit(selected);  // Passa a lista de juizados selecionados
    };

    return (
        <Modal
            title="Selecione os Juizados para Importação"
            visible={visible}
            onCancel={onClose}
            onOk={handleConfirm}
        >
            <Select
                mode="multiple"
                placeholder="Selecione os juizados"
                value={selectedJuizados}
                onChange={setSelectedJuizados}
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
