import React from 'react';
import { Modal, Progress, Button } from 'antd';

const LoadingModal = ({ visible, progress, currentEndpoint, currentComarca, currentData, importacaoConcluida, handleSalvarDados, handleCancelarSalvar }) => {
    return (
        <Modal
            visible={visible}
            footer={null}
            closable={false}
            centered
        >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Progress type="circle" percent={progress} />
                <div style={{ marginTop: '20px' }}>
                    <p><strong>Juizado Atual:</strong> {currentEndpoint}</p>
                    <p><strong>Comarca:</strong> {currentComarca}</p>
                    <p><strong>Data em Processamento:</strong> {currentData}</p>
                </div>
                {importacaoConcluida && (
                    <div style={{ marginTop: '20px' }}>
                        <p>Deseja salvar os dados importados no banco de dados?</p>
                        <Button type="primary" onClick={handleSalvarDados}>Salvar</Button>
                        <Button style={{ marginLeft: '10px' }} onClick={handleCancelarSalvar}>Cancelar</Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default LoadingModal;
