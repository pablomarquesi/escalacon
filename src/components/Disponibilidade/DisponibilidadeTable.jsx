import React from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const DisponibilidadeTable = ({ columns, dataSource, rowKey, pagination, handleEdit, handleDelete }) => {

    const tableColumns = [
        ...columns,
        {
            title: 'Ações',
            key: 'actions',
            align: 'left',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.conciliador_id, record.mes)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={tableColumns}
            dataSource={dataSource}
            rowKey={rowKey}
            pagination={pagination}
        />
    );
};

export default DisponibilidadeTable;
