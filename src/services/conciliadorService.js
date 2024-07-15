import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchConciliadores = async () => {
    try {
        const response = await axios.get(`${API_URL}/conciliadores`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar conciliadores:', error);
        throw error;
    }
};

export const saveConciliador = async (conciliador) => {
    try {
        if (conciliador.conciliador_id) {
            const response = await axios.put(`${API_URL}/conciliadores/${conciliador.conciliador_id}`, conciliador);
            return response.data;
        } else {
            const response = await axios.post(`${API_URL}/conciliadores`, conciliador);
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao salvar conciliador:', error);
        throw error;
    }
};

export const toggleConciliadorStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/conciliadores/${id}`, { status_conciliador: status });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status do conciliador:', error);
        throw error;
    }
};

export const fetchMunicipios = async () => {
    try {
        const response = await axios.get(`${API_URL}/comarcas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar municípios:', error);
        throw error;
    }
};
