import React from 'react';
import { Button } from 'antd';

export const getTableColumnsConciliador = (handleEdit, handleDelete) => [
  {
    title: 'Matrícula',
    dataIndex: 'matricula',
    key: 'matricula',
    align: 'left',
  },
  {
    title: 'Nome',
    dataIndex: 'nome_conciliador',
    key: 'nome',
    align: 'left',
  },
  {
    title: 'CPF',
    dataIndex: 'cpf',
    key: 'cpf',
    align: 'left',
  },
  {
    title: 'Telefone',
    dataIndex: 'telefone',
    key: 'telefone',
    align: 'left',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    align: 'left',
  },
  {
    title: 'Comarca',
    dataIndex: 'nome_comarca',
    key: 'comarca',
    align: 'left',
  },
  {
    title: 'Data de Credenciamento',
    dataIndex: 'data_credenciamento',
    key: 'data_credenciamento',
    align: 'left',
  },
  {
    title: 'Ações',
    key: 'actions',
    render: (text, record) => (
      <span>
        <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
        <Button type="link" danger onClick={() => handleDelete(record.id)}>Excluir</Button>
      </span>
    ),
  },
];
