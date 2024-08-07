import axios from 'axios';

export const obterPautaAudiencia = async (data, endpoint) => {
    const url = `https://plenarios-api.tjmt.jus.br/consulta-pje/obter-pauta-audiencia/${data}/${endpoint}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pauta de audiência:', error);
        throw error;
    }
};
