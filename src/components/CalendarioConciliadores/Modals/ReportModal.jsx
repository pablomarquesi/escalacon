import React from 'react';
import { Modal, Form, Select, Button, Radio } from 'antd';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const ReportModal = ({
    isReportModalVisible, handleReportModalCancel, generatePDF,
    reportMonth, handleMesChange, getComarcaOptions,
    reportComarca, handleComarcaChange, reportFormat, setReportFormat
}) => (
    <Modal
        title="Gerar Relatório"
        visible={isReportModalVisible}
        onCancel={handleReportModalCancel}
        footer={[
            <Button key="cancel" onClick={handleReportModalCancel}>Cancelar</Button>,
            <Button key="generate" type="primary" onClick={generatePDF}>Gerar Relatório</Button>
        ]}
    >
        <Form layout="vertical">
            <Form.Item label="Selecionar Mês">
                <Select value={reportMonth} onChange={handleMesChange}>
                    {meses.map((mes, index) => (
                        <Select.Option key={index} value={index + 1}>{mes}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Selecionar Comarca">
                <Select value={reportComarca} onChange={handleComarcaChange} style={{ width: '100%' }}>
                    {getComarcaOptions().map(option => (
                        <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Formato">
                <Radio.Group value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}>
                    <Radio value="PDF">PDF</Radio>
                    <Radio value="XLSX" disabled>XLSX (Em breve)</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    </Modal>
);

export default ReportModal;
