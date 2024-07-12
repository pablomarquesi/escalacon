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

export const saveDisponibilidade = async (disponibilidades) => {
    try {
        const response = await axios.post(`${API_URL}/disponibilidades`, { disponibilidades });
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar disponibilidades:', error);
        throw error;
    }
};

export const deleteDisponibilidade = async (conciliador_id, mes, ano, dia_da_semana = null) => {
    try {
        let url = `${API_URL}/disponibilidades/${conciliador_id}/${mes}/${ano}`;
        if (dia_da_semana) {
            url += `/${dia_da_semana}`;
        }
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir disponibilidades:', error);
        throw error;
    }
};
