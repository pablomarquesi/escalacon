import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const salvarDisponibilidade = async (disponibilidades) => {
    try {
        const response = await axios.post(`${API_URL}/disponibilidade`, disponibilidades);
        console.log('salvarDisponibilidade response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar disponibilidades:', error);
        throw error;
    }
};
