import React from 'react';
import { Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const getTableColumnsComarca = (onEdit, onDelete) => [
  {
    title: 'ID',
    dataIndex: 'comarca_id',
    key: 'comarca_id',
    sorter: (a, b) => a.comarca_id - b.comarca_id,
  },
  {
    title: 'Nome da Comarca',
    dataIndex: 'nome_comarca',
    key: 'nome_comarca',
    sorter: (a, b) => (a.nome_comarca || "").toString().localeCompare((b.nome_comarca || "").toString()),
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
          title="Tem certeza que deseja excluir esta comarca?"
          onConfirm={() => onDelete(record.comarca_id)}
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

export default getTableColumnsComarca;
