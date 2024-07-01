import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchComarcas = async () => {
    try {
        const response = await axios.get(`${API_URL}/comarcas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar comarcas:', error);
        throw error;
    }
};

export const saveComarca = async (comarca) => {
    try {
        let response;
        if (comarca.comarca_id) {
            response = await axios.put(`${API_URL}/comarcas/${comarca.comarca_id}`, comarca);
        } else {
            response = await axios.post(`${API_URL}/comarcas`, comarca);
        }
        return response;
    } catch (error) {
        console.error('Erro ao salvar comarca:', error.response || error.message);
        throw error;
    }
};

export const deleteComarca = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/comarcas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir comarca:', error);
        throw error;
    }
};
