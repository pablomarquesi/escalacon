import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchJuizados = async () => {
    try {
        const response = await axios.get(`${API_URL}/juizados`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar juizados:', error);
        throw error;
    }
};

export const saveJuizado = async (juizado) => {
    try {
        const response = juizado.juizado_id
            ? await axios.put(`${API_URL}/juizados/${juizado.juizado_id}`, juizado)
            : await axios.post(`${API_URL}/juizados`, juizado);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar juizado:', error);
        throw error;
    }
};

export const deleteJuizado = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/juizados/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir juizado:', error);
        throw error;
    }
};
