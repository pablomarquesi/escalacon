// ClearModal.jsx
import React from 'react';
import { Modal, Checkbox } from 'antd';

const ClearModal = ({ isClearModalVisible, handleClear, setIsClearModalVisible, getMonthOptions, setSelectedMeses }) => (
    <Modal
        title="Selecionar Meses para Limpar"
        visible={isClearModalVisible}
        onOk={handleClear}
        onCancel={() => setIsClearModalVisible(false)}
    >
        <Checkbox.Group options={getMonthOptions()} onChange={(values) => setSelectedMeses(values)} style={{ display: 'flex', flexDirection: 'column' }} />
    </Modal>
);

export default ClearModal;
