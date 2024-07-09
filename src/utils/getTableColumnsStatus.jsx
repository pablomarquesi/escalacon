import React from 'react';
import { Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const getTableColumnsStatus = (onEdit, onDelete) => [
  {
    title: 'ID',
    dataIndex: 'status_id',
    key: 'status_id',
    sorter: (a, b) => a.status_id - b.status_id,
  },
  {
    title: 'Nome do Status',
    dataIndex: 'nome_status',
    key: 'nome_status',
    sorter: (a, b) => (a.nome_status || "").toString().localeCompare((b.nome_status || "").toString()),
  },
  {
    title: 'Descrição',
    dataIndex: 'descricao_status',
    key: 'descricao_status',
    sorter: (a, b) => (a.descricao_status || "").toString().localeCompare((b.descricao_status || "").toString()),
  },
  {
    title: 'Ação',
    key: 'acao',
    render: (_, record) => (
      <span>
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
          type="default"
          style={{ marginRight: 8 }}
        />
        <Popconfirm
          title="Tem certeza que deseja excluir este status?"
          onConfirm={() => onDelete(record.status_id)}
          okText="Sim"
          cancelText="Não"
        >
          <Button
            icon={<DeleteOutlined />}
            type="default"
          />
        </Popconfirm>
      </span>
    ),
  },
];

export default getTableColumnsStatus;
