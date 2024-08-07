import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchSalasVirtuais = async () => {
    try {
        const response = await axios.get(`${API_URL}/salasvirtuais`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar salas virtuais:', error);
        throw new Error('Erro ao buscar salas virtuais. Por favor, tente novamente mais tarde.');
    }
};

export const fetchTiposPauta = async () => {
    try {
        const response = await axios.get(`${API_URL}/salasvirtuais/tipospauta`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tipos de pauta:', error);
        throw new Error('Erro ao buscar tipos de pauta. Por favor, tente novamente mais tarde.');
    }
};

export const saveSalaVirtual = async (salaVirtual) => {
    try {
        const response = salaVirtual.sala_virtual_id
            ? await axios.put(`${API_URL}/salasvirtuais/${salaVirtual.sala_virtual_id}`, salaVirtual)
            : await axios.post(`${API_URL}/salasvirtuais`, salaVirtual);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return Promise.reject(error.response.data.error); // Rejeitar a promessa com a mensagem de erro
        }
        console.error('Erro ao salvar sala virtual:', error.response || error);
        return Promise.reject('Erro ao salvar sala virtual. Por favor, tente novamente mais tarde.');
    }
};

export const toggleSalaVirtualStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/salasvirtuais/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status da sala virtual:', error);
        throw new Error('Erro ao alterar status da sala virtual. Por favor, tente novamente mais tarde.');
    }
};

// Nova função para verificar se a sala já existe no juizado
export const verificarSalaExistente = async (juizado_id, nome_sala_virtual) => {
    try {
        const response = await axios.post(`${API_URL}/salasvirtuais/verificar`, {
            juizado_id,
            nome_sala_virtual
        });
        return response.data.exists;
    } catch (error) {
        console.error('Erro ao verificar sala virtual:', error);
        throw error;
    }
};


// Nova função para salvar sala virtual
export const salvarSalaVirtual = async (salaVirtual) => {
    try {
        const response = await axios.post(`${API_URL}/salasvirtuais`, salaVirtual);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar sala virtual:', error);
        throw new Error('Erro ao salvar sala virtual. Por favor, tente novamente mais tarde.');
    }
};
