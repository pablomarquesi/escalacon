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

export const fetchSalasVirtuais = async () => {
    try {
        const response = await axios.get(`${API_URL}/salasvirtuais`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar salas virtuais:', error);
        throw error;
    }
};
