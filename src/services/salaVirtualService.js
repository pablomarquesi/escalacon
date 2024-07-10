import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchSalasVirtuais = async () => {
    try {
        const response = await axios.get(`${API_URL}/salasvirtuais`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar salas virtuais:', error);
        throw error;
    }
};

export const saveSalaVirtual = async (salaVirtual) => {
    try {
        const response = salaVirtual.sala_virtual_id
            ? await axios.put(`${API_URL}/salasvirtuais/${salaVirtual.sala_virtual_id}`, salaVirtual)
            : await axios.post(`${API_URL}/salasvirtuais`, salaVirtual);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar sala virtual:', error);
        throw error;
    }
};

export const deleteSalaVirtual = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/salasvirtuais/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir sala virtual:', error);
        throw error;
    }
};
