import db from '../config/database.js';

export async function fetchTiposDePauta(req, res) {
    try {
        const [tiposDePauta] = await db.query('SELECT * FROM tipo_de_pauta ORDER BY nome_pauta ASC');
        res.json(tiposDePauta);
    } catch (error) {
        console.error('Erro ao buscar tipos de pauta:', error);
        res.status(500).send('Erro no servidor ao buscar tipos de pauta');
    }
}

export async function addTipoDePauta(req, res) {
    const { nome_pauta, descricao, status } = req.body;
    try {
        const result = await db.query(`
            INSERT INTO tipo_de_pauta (nome_pauta, descricao, status)
            VALUES (?, ?, 'Ativo')
        `, [nome_pauta, descricao]);

        if (result[0].affectedRows > 0) {
            res.status(201).json({ message: "Tipo de pauta adicionado com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível adicionar o tipo de pauta." });
        }
    } catch (error) {
        console.error('Erro ao adicionar tipo de pauta:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar tipo de pauta' });
    }
}

export async function updateTipoDePauta(req, res) {
    const { id } = req.params;
    const { nome_pauta, descricao, status } = req.body;
    try {
        const result = await db.query(`
            UPDATE tipo_de_pauta 
            SET nome_pauta = ?, descricao = ?
            WHERE id = ?
        `, [nome_pauta, descricao, id]);

        if (result[0].affectedRows > 0) {
            console.log('Tipo de pauta atualizado com sucesso:', { id, nome_pauta, descricao, status });
            res.status(200).json({ message: "Tipo de pauta atualizado com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível atualizar o tipo de pauta." });
        }
    } catch (error) {
        console.error('Erro ao atualizar tipo de pauta:', error);
        res.status(500).json({ error: 'Erro no servidor ao atualizar tipo de pauta' });
    }
}

export async function toggleTipoDePautaStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await db.query(`
            UPDATE tipo_de_pauta 
            SET status = ?
            WHERE id = ?
        `, [status, id]);

        if (result[0].affectedRows > 0) {
            console.log('Status do tipo de pauta atualizado com sucesso:', { id, status }); // Log do status atualizado
            res.status(200).json({ message: `Tipo de pauta ${status === 'Ativo' ? 'ativado' : 'inativado'} com sucesso.` });
        } else {
            res.status(400).json({ message: "Não foi possível alterar o status do tipo de pauta." });
        }
    } catch (error) {
        console.error('Erro ao alterar status do tipo de pauta:', error);
        res.status(500).json({ error: 'Erro no servidor ao alterar status do tipo de pauta' });
    }
}
