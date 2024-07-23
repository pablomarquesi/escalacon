import React from 'react';
import { Table } from 'antd';
import '../../index.css';

const CustomTable = ({ columns, dataSource, rowKey = "id", paginationOptions = { pageSizeOptions: ['10', '20', '50', '100'], showSizeChanger: true, defaultPageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens` }, rowSelection }) => {
    return (
        <div className="table-container custom-table">
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={rowKey}
                pagination={paginationOptions}
                rowSelection={rowSelection}
            />
        </div>
    );
};

export default CustomTable;
