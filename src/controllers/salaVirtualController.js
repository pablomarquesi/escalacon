import db from '../config/database.js';

export async function fetchSalasVirtuais(req, res) {
    try {
        const [salas] = await db.query(
            `SELECT s.sala_virtual_id, s.juizado_id, s.nome_sala_virtual, s.tipo_pauta_id, tp.nome_pauta AS tipo_pauta, s.situacao, j.nome_juizado, s.status_sala_virtual,
            GROUP_CONCAT(ds.nome_dia ORDER BY ds.dia_semana_id SEPARATOR ', ') AS nome_dia
            FROM sala_virtual AS s
            INNER JOIN juizado AS j ON s.juizado_id = j.juizado_id
            INNER JOIN tipo_de_pauta AS tp ON s.tipo_pauta_id = tp.id
            LEFT JOIN sala_virtual_dia_semana AS svds ON s.sala_virtual_id = svds.sala_virtual_id
            LEFT JOIN dia_semana AS ds ON svds.dia_semana_id = ds.dia_semana_id
            GROUP BY s.sala_virtual_id`
        );
        res.json(salas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar salas virtuais' });
    }
}

export async function addSalaVirtual(req, res) {
    const { juizado_id, nome_sala_virtual, tipo_pauta_id, situacao, dias_funcionamento } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO sala_virtual (juizado_id, nome_sala_virtual, tipo_pauta_id, situacao, status_sala_virtual) 
            VALUES (?, ?, ?, ?, 'Ativo')`,
            [juizado_id, nome_sala_virtual, tipo_pauta_id, situacao]
        );
        
        const salaVirtualId = result.insertId;
        
        for (const dia of dias_funcionamento) {
            await db.query(
                `INSERT INTO sala_virtual_dia_semana (sala_virtual_id, dia_semana_id) VALUES (?, ?)`,
                [salaVirtualId, dia]
            );
        }

        res.status(201).json({ message: 'Sala virtual adicionada com sucesso', sala_virtual_id: salaVirtualId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar sala virtual' });
    }
}

export async function updateSalaVirtual(req, res) {
    const { id } = req.params;
    const { juizado_id, nome_sala_virtual, tipo_pauta_id, situacao, dias_funcionamento } = req.body;
    try {
        await db.query(
            `UPDATE sala_virtual 
            SET juizado_id = ?, nome_sala_virtual = ?, tipo_pauta_id = ?, situacao = ? 
            WHERE sala_virtual_id = ?`,
            [juizado_id, nome_sala_virtual, tipo_pauta_id, situacao, id]
        );

        // Remover dias atuais
        await db.query(`DELETE FROM sala_virtual_dia_semana WHERE sala_virtual_id = ?`, [id]);
        
        // Adicionar novos dias
        for (const dia of dias_funcionamento) {
            await db.query(
                `INSERT INTO sala_virtual_dia_semana (sala_virtual_id, dia_semana_id) VALUES (?, ?)`,
                [id, dia]
            );
        }

        res.json({ message: 'Sala virtual atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar sala virtual' });
    }
}

export async function toggleSalaVirtualStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await db.query(`
            UPDATE sala_virtual 
            SET status_sala_virtual = ?
            WHERE sala_virtual_id = ?
        `, [status, id]);

        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: `Status da sala virtual atualizado para ${status} com sucesso.` });
        } else {
            res.status(400).json({ message: "Não foi possível atualizar o status da sala virtual." });
        }
    } catch (error) {
        console.error('Erro ao alterar status da sala virtual:', error);
        res.status(500).json({ error: 'Erro no servidor ao alterar status da sala virtual' });
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
