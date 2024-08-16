import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const importarAudiencias = async (juizadoId, audiencias) => {
    try {
        const response = await axios.post(`${API_URL}/escala/importar`, {
            juizado_id: juizadoId,
            audiencias
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao importar audiências:', error);
        throw new Error('Erro ao importar audiências. Por favor, tente novamente mais tarde.');
    }
};

export const getEscala = async (juizadoId) => {
    try {
        const response = await axios.get(`${API_URL}/escala/${juizadoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar escala:', error);
        throw new Error('Erro ao buscar escala. Por favor, tente novamente mais tarde.');
    }
};
