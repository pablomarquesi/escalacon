import db from '../config/database.js';

// Função para buscar todas as comarcas
export async function fetchComarcas(req, res) {
    try {
        const [comarcas] = await db.query('SELECT comarca_id, nome_comarca FROM comarca ORDER BY nome_comarca ASC');
        res.json(comarcas);
    } catch (error) {
        console.error('Erro ao buscar comarcas:', error);
        res.status(500).send('Erro no servidor ao buscar comarcas');
    }
}

// Função para adicionar uma nova comarca
export async function addComarca(req, res) {
    const { nome_comarca } = req.body;

    if (!nome_comarca) {
        return res.status(400).json({ error: 'Nome da comarca é obrigatório.' });
    }

    try {
        const result = await db.query('INSERT INTO comarca (nome_comarca) VALUES (?)', [nome_comarca]);
        if (result[0].affectedRows > 0) {
            res.status(201).json({ message: "Comarca adicionada com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível adicionar a comarca." });
        }
    } catch (error) {
        console.error('Erro ao adicionar comarca:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar comarca' });
    }
}

// Função para atualizar uma comarca existente
export async function updateComarca(req, res) {
    const { id } = req.params;
    const { nome_comarca } = req.body;

    if (!nome_comarca) {
        return res.status(400).json({ error: 'Nome da comarca é obrigatório.' });
    }

    try {
        const result = await db.query('UPDATE comarca SET nome_comarca = ? WHERE comarca_id = ?', [nome_comarca, id]);
        if (result[0].affectedRows > 0) {
            res.json({ message: "Comarca atualizada com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível atualizar a comarca." });
        }
    } catch (error) {
        console.error('Erro ao atualizar comarca:', error);
        res.status(500).json({ error: 'Erro no servidor ao atualizar comarca' });
    }
}

// Função para excluir uma comarca
export async function deleteComarca(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM comarca WHERE comarca_id = ?', [id]);
        if (result[0].affectedRows > 0) {
            res.json({ message: "Comarca excluída com sucesso." });
        } else {
            res.status(404).json({ message: "Comarca não encontrada." });
        }
    } catch (error) {
        console.error('Erro ao excluir comarca:', error);
        res.status(500).json({ error: 'Erro no servidor ao excluir comarca' });
    }
}
