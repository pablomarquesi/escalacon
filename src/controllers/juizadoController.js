import db from '../config/database.js';

export async function fetchJuizados(req, res) {
    try {
        const [juizados] = await db.query(`
            SELECT j.juizado_id, j.comarca_id, j.nome_juizado, j.endpoint_id, c.nome_comarca 
            FROM juizado AS j
            INNER JOIN comarca AS c ON j.comarca_id = c.comarca_id
        `);
        res.json(juizados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar juizados' });
    }
}

export async function addJuizado(req, res) {
    const { comarca_id, nome_juizado, endpoint_id } = req.body;
    try {
        const result = await db.query(`
            INSERT INTO juizado (comarca_id, nome_juizado, endpoint_id) 
            VALUES (?, ?, ?)
        `, [comarca_id, nome_juizado, endpoint_id]);
        res.status(201).json({ message: 'Juizado adicionado com sucesso', juizado_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar juizado' });
    }
}

export async function updateJuizado(req, res) {
    const { id } = req.params;
    const { comarca_id, nome_juizado, endpoint_id } = req.body;
    try {
        await db.query(`
            UPDATE juizado 
            SET comarca_id = ?, nome_juizado = ?, endpoint_id = ?
            WHERE juizado_id = ?
        `, [comarca_id, nome_juizado, endpoint_id, id]);
        res.json({ message: 'Juizado atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar juizado' });
    }
}

export async function deleteJuizado(req, res) {
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM juizado WHERE juizado_id = ?`, [id]);
        res.json({ message: 'Juizado excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir juizado' });
    }
}
