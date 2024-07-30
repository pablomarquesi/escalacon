import db from '../config/database.js';

export async function fetchDisponibilidadesSalas(req, res) {
    try {
        const [rows] = await db.query(`
            SELECT 
                sv.nome_sala_virtual,
                dr.dia_da_semana,
                ds.data_inicio,
                ds.data_fim,
                de.data_especifica
            FROM 
                sala_virtual sv
            LEFT JOIN 
                disponibilidade_regular_sala_virtual dr ON sv.sala_virtual_id = dr.sala_virtual_id
            LEFT JOIN 
                disponibilidade_sazonal_sala_virtual ds ON sv.sala_virtual_id = ds.sala_virtual_id
            LEFT JOIN 
                disponibilidade_data_especifica_sala_virtual de ON sv.sala_virtual_id = de.sala_virtual_id
            ORDER BY 
                sv.nome_sala_virtual ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar disponibilidades das salas virtuais:', error);
        res.status(500).json({ error: 'Erro ao buscar disponibilidades das salas virtuais' });
    }
}

// Função para adicionar uma nova disponibilidade de sala virtual
export async function addDisponibilidadeSala(req, res) {
    const { sala_virtual_id, tipo, detalhes, status_id } = req.body;
    try {
        const [result] = await db.query(`
            INSERT INTO disponibilidade_sala_virtual (sala_virtual_id, tipo, detalhes, status_id)
            VALUES (?, ?, ?, ?)
        `, [sala_virtual_id, tipo, detalhes, status_id]);
        res.status(201).json({ id: result.insertId, sala_virtual_id, tipo, detalhes, status_id });
    } catch (error) {
        console.error('Erro ao adicionar disponibilidade de sala virtual:', error);
        res.status(500).json({ error: 'Erro ao adicionar disponibilidade de sala virtual' });
    }
}

// Função para alternar o status de uma disponibilidade de sala virtual
export async function toggleDisponibilidadeSalaStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const [result] = await db.query(`
            UPDATE disponibilidade_sala_virtual 
            SET status_id = ?
            WHERE id = ?
        `, [status, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Disponibilidade de sala virtual não encontrada' });
        } else {
            res.json({ message: `Status da disponibilidade de sala virtual atualizado para ${status}` });
        }
    } catch (error) {
        console.error('Erro ao alterar status da disponibilidade de sala virtual:', error);
        res.status(500).json({ error: 'Erro ao alterar status da disponibilidade de sala virtual' });
    }
}
