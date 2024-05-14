import React from 'react';
import { Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const formatCPF = cpf => {
  return cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
};

const formatPhone = phone => {
  return phone ? phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3') : '';
};

const getTableColumns = (onEdit, onDelete) => [
  {
    title: 'Matrícula',
    dataIndex: 'matricula',
    key: 'matricula',
    sorter: (a, b) => a.matricula - b.matricula,
  },
  {
    title: 'Nome',
    dataIndex: 'nome_conciliador',
    key: 'nome_conciliador',
    sorter: (a, b) => (a.nome_conciliador || "").toString().localeCompare((b.nome_conciliador || "").toString()),
  },
  {
    title: 'CPF',
    dataIndex: 'cpf',
    key: 'cpf',
    render: cpf => <span>{formatCPF(cpf)}</span>,
    sorter: (a, b) => (a.cpf || "").toString().localeCompare((b.cpf || "").toString()),
  },
  {
    title: 'Telefone',
    dataIndex: 'telefone',
    key: 'telefone',
    render: phone => <span>{formatPhone(phone)}</span>,
    sorter: (a, b) => (a.telefone || "").toString().localeCompare((b.telefone || "").toString()),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => (a.email || "").toString().localeCompare((b.email || "").toString()),
  },
  {
    title: 'Comarca',
    dataIndex: 'nome_comarca',
    key: 'nome_comarca',
    sorter: (a, b) => a.nome_comarca.localeCompare(b.nome_comarca),
  },
  {
    title: 'Data de Credenciamento',
    dataIndex: 'data_credenciamento',
    key: 'data_credenciamento',
    render: text => text ? moment(text).format('DD/MM/YYYY') : '',
    sorter: (a, b) => moment(a.data_credenciamento).unix() - moment(b.data_credenciamento).unix(),
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
          title="Tem certeza que deseja excluir este conciliador?"
          onConfirm={() => onDelete(record.conciliador_id)}
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

export default getTableColumns;
