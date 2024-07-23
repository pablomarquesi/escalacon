// CellInfoModal.jsx
import React from 'react';
import { Modal, Button } from 'antd';

const CellInfoModal = ({
    isModalVisible, handleModalOk, handleModalCancel, handleDelete,
    selectedCell, currentConciliadores, mes, ano, getFormattedDate
}) => {
    const conciliador = currentConciliadores.find(c => c.conciliador_id === selectedCell?.conciliadorId);

    return (
        <Modal
            title={selectedCell ? getFormattedDate(selectedCell.dia, mes, ano) : 'Informações da Célula'}
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            footer={[
                <Button key="delete" type="primary" danger onClick={handleDelete}>Excluir</Button>,
                <Button key="close" onClick={handleModalCancel}>Fechar</Button>
            ]}
        >
            {selectedCell && conciliador && (
                <div>
                    <p>Conciliador: {conciliador.nome_conciliador}</p>
                    <p>Comarca: {conciliador.nome_comarca}</p>
                    <p>Juizado: {conciliador.nome_juizado}</p>
                    <p>Sala Virtual: {conciliador.nome_sala_virtual}</p>
                </div>
            )}
        </Modal>
    );
};

export default CellInfoModal;
