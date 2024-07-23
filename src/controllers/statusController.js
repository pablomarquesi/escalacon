import db from '../config/database.js';

export async function fetchStatus(req, res) {
    try {
        const [status] = await db.query('SELECT status_id, nome_status, descricao_status, status FROM status ORDER BY nome_status ASC');
        res.json(status);
    } catch (error) {
        console.error('Erro ao buscar status:', error);
        res.status(500).send('Erro no servidor ao buscar status');
    }
}

export async function addStatus(req, res) {
    const { nome_status, descricao_status } = req.body;

    console.log('Dados recebidos no backend:', req.body);

    if (!nome_status || !descricao_status) {
        return res.status(400).json({ error: 'Nome do status e descrição são obrigatórios.' });
    }

    try {
        const result = await db.query(`
            INSERT INTO status (nome_status, descricao_status, status)
            VALUES (?, ?, 'Ativo')
        `, [nome_status, descricao_status]);

        if (result[0].affectedRows > 0) {
            res.status(201).end();
        } else {
            res.status(400).json({ message: "Não foi possível adicionar o status." });
        }
    } catch (error) {
        console.error('Erro ao adicionar status:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar status' });
    }
}

export async function updateStatus(req, res) {
    const { id } = req.params;
    const { nome_status, descricao_status } = req.body;

    if (!nome_status || !descricao_status) {
        return res.status(400).json({ error: 'Nome do status e descrição são obrigatórios.' });
    }

    try {
        const result = await db.query(`
            UPDATE status 
            SET nome_status = ?, descricao_status = ?
            WHERE status_id = ?
        `, [nome_status, descricao_status, id]);

        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: "Status atualizado com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível atualizar o status." });
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ error: 'Erro no servidor ao atualizar status' });
    }
}

export async function deleteStatus(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM status WHERE status_id = ?', [id]);
        if (result.affectedRows > 0) {
            res.json({ message: "Status excluído com sucesso." });
        } else {
            res.status(404).json({ message: "Status não encontrado." });
        }
    } catch (error) {
        console.error('Erro ao excluir status:', error);
        res.status(500).json({ error: 'Erro no servidor ao excluir status' });
    }
}

export async function toggleStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Alterando status do ID ${id} para ${status}`);

    try {
        const result = await db.query('UPDATE status SET status = ? WHERE status_id = ?', [status, id]);
        if (result[0].affectedRows > 0) {
            res.json({ message: "Status atualizado com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível atualizar o status." });
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ error: 'Erro no servidor ao atualizar status' });
    }
}
