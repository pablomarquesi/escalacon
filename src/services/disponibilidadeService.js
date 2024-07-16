import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchDisponibilidades = async () => {
    try {
        const response = await axios.get(`${API_URL}/disponibilidades`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar disponibilidades:', error);
        throw error;
    }
};

export const saveDisponibilidade = async (disponibilidade) => {
    try {
        const response = await axios.post(`${API_URL}/disponibilidades`, { disponibilidades: disponibilidade });
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar disponibilidade:', error);
        throw error;
    }
};

export const deleteDisponibilidade = async (conciliador_id, mes, ano, dia_da_semana) => {
    try {
        const response = await axios.delete(`${API_URL}/disponibilidades/${conciliador_id}/${mes}/${ano}/${dia_da_semana}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir disponibilidade:', error);
        throw error;
    }
};
