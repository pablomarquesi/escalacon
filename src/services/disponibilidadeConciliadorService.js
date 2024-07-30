import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchDisponibilidadesConciliadores = async () => {
    try {
        const response = await axios.get(`${API_URL}/disponibilidades-conciliadores`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar disponibilidades:', error);
        throw error;
    }
};

export const saveDisponibilidadeConciliadores = async (disponibilidade) => {
    try {
        const response = await axios.post(`${API_URL}/disponibilidades-conciliadores`, { ...disponibilidade });
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar disponibilidade:', error);
        throw error.response ? error.response.data : error;
    }
};


export const toggleDisponibilidadeStatusConciliadores = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/disponibilidades-conciliadores/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status da disponibilidade:', error);
        throw error.response ? error.response.data : error;
    }
};
