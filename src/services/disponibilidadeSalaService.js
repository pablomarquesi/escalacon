import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchDisponibilidadesSalas = async () => {
    try {
        const response = await axios.get(`${API_URL}/disponibilidades-salas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar disponibilidades das salas:', error);
        throw error;
    }
};

export const saveDisponibilidadeSala = async (disponibilidade) => {
    try {
        const response = await axios.post(`${API_URL}/disponibilidades-salas`, { ...disponibilidade });
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar disponibilidade de sala:', error);
        throw error.response ? error.response.data : error;
    }
};

export const toggleDisponibilidadeSalaStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/disponibilidades-salas/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status da disponibilidade de sala:', error);
        throw error.response ? error.response.data : error;
    }
};
