import db from '../config/database.js';

export async function fetchSalasVirtuais(req, res) {
    try {
        const [salas] = await db.query(
            `SELECT s.sala_virtual_id, s.juizado_id, s.nome_sala_virtual, tp.nome_pauta AS tipo_pauta, s.situacao, j.nome_juizado 
            FROM sala_virtual AS s
            INNER JOIN juizado AS j ON s.juizado_id = j.juizado_id
            INNER JOIN tipo_de_pauta AS tp ON s.tipo_pauta_id = tp.id`
        );
        res.json(salas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar salas virtuais' });
    }
}

export async function fetchTiposPauta(req, res) {
    try {
        const [tiposPauta] = await db.query('SELECT id, nome_pauta FROM tipo_de_pauta');
        res.json(tiposPauta);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tipos de pauta' });
    }
}

export async function addSalaVirtual(req, res) {
    const { juizado_id, nome_sala_virtual, tipo_pauta_id, situacao } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO sala_virtual (juizado_id, nome_sala_virtual, tipo_pauta_id, situacao) 
            VALUES (?, ?, ?, ?)`,
            [juizado_id, nome_sala_virtual, tipo_pauta_id, situacao]
        );
        res.status(201).json({ message: 'Sala virtual adicionada com sucesso', sala_virtual_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar sala virtual' });
    }
}

export async function updateSalaVirtual(req, res) {
    const { id } = req.params;
    const { juizado_id, nome_sala_virtual, tipo_pauta_id, situacao } = req.body;
    try {
        await db.query(
            `UPDATE sala_virtual 
            SET juizado_id = ?, nome_sala_virtual = ?, tipo_pauta_id = ?, situacao = ? 
            WHERE sala_virtual_id = ?`,
            [juizado_id, nome_sala_virtual, tipo_pauta_id, situacao, id]
        );
        res.json({ message: 'Sala virtual atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar sala virtual' });
    }
}

export async function deleteSalaVirtual(req, res) {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM sala_virtual WHERE sala_virtual_id = ?', [id]);
        res.json({ message: 'Sala virtual excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir sala virtual' });
    }
}
