import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchTiposDePauta = async () => {
    try {
        const response = await axios.get(`${API_URL}/tipodepauta`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tipos de pauta:', error);
        throw error;
    }
};

export const saveTipoDePauta = async (tipoDePauta) => {
    try {
        let response;
        if (tipoDePauta.id) {
            response = await axios.put(`${API_URL}/tipodepauta/${tipoDePauta.id}`, tipoDePauta);
        } else {
            response = await axios.post(`${API_URL}/tipodepauta`, tipoDePauta);
        }
        console.log('saveTipoDePauta response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar tipo de pauta:', error);
        throw error;
    }
};

export const toggleTipoDePautaStatus = async (id, currentStatus) => {
    try {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        const response = await axios.patch(`${API_URL}/tipodepauta/${id}`, { status: newStatus });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        throw error;
    }
};
