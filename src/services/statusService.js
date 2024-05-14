import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchStatus = async () => {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
};

export const saveStatus = async (status) => {
    try {
        if (status.status_id) {
            const response = await axios.put(`${API_URL}/status/${status.status_id}`, status);
            return response;
        } else {
            const response = await axios.post(`${API_URL}/status`, status);
            return response;
        }
    } catch (error) {
        console.error('Erro ao salvar status:', error.response || error.message);
        throw error;
    }
};

export const deleteStatus = async (id) => {
    const response = await axios.delete(`${API_URL}/status/${id}`);
    return response.data;
};
