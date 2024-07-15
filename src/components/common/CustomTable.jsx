import React from 'react';
import { Table } from 'antd';

const CustomTable = ({ columns, dataSource, rowKey = "id", paginationOptions = { pageSizeOptions: ['10', '20', '50', '100'], showSizeChanger: true, defaultPageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens` } }) => {
    return (
        <div className="table-container">
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={rowKey}
                pagination={paginationOptions}
            />
        </div>
    );
};

export default CustomTable;
