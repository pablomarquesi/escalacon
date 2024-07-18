import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/status`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar statuses:', error);
        throw error;
    }
};

export const saveStatus = async (status) => {
    try {
        if (status.status_id) {
            const response = await axios.put(`${API_URL}/status/${status.status_id}`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } else {
            const response = await axios.post(`${API_URL}/status`, status, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Requisição POST enviada:', status); // Log da requisição
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar status:', error.response || error.message);
        throw error;
    }
};

export const deleteStatus = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/status/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir status:', error);
        throw error;
    }
};

export const toggleStatus = async (id, currentStatus) => {
    try {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        const response = await axios.patch(`${API_URL}/status/${id}`, { status: newStatus }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        throw error;
    }
};
