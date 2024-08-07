import { obterPautaAudiencia } from '../services/disponibilidadeSalaService.js';

export const buscarDadosAudiencia = async (req, res) => {
    const { data, endpoint } = req.query;

    if (!data || !endpoint) {
        return res.status(400).json({ error: 'Data e endpoint são necessários.' });
    }

    try {
        const dados = await obterPautaAudiencia(data, endpoint);
        if (dados) {
            res.status(200).json(dados);
        } else {
            res.status(404).json({ error: 'Nenhum dado encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar dados da audiência:', error);
        res.status(500).json({ error: 'Erro ao buscar dados da audiência.' });
    }
};
