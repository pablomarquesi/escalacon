import db from '../config/database.js';

export async function fetchSalasVirtuais(req, res) {
    try {
        const [salas] = await db.query(
            `SELECT 
                s.sala_virtual_id, 
                s.juizado_id, 
                s.nome_sala_virtual, 
                s.tipo_pauta_id, 
                tp.nome_pauta AS tipo_pauta, 
                j.nome_juizado, 
                s.status_sala_virtual
            FROM 
                sala_virtual AS s
            INNER JOIN 
                juizado AS j ON s.juizado_id = j.juizado_id
            INNER JOIN 
                tipo_de_pauta AS tp ON s.tipo_pauta_id = tp.id
            GROUP BY 
                s.sala_virtual_id`
        );
        res.json(salas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar salas virtuais' });
    }
}


export async function verificarSalaVirtual(req, res) {
    const { juizado_id, nome_sala_virtual } = req.body;
    try {
        const [existingSala] = await db.query(
            'SELECT * FROM sala_virtual WHERE juizado_id = ? AND nome_sala_virtual = ?',
            [juizado_id, nome_sala_virtual]
        );

        if (existingSala.length > 0) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Erro ao verificar sala virtual:', error);
        res.status(500).json({ error: 'Erro ao verificar sala virtual' });
    }
}


export async function addSalaVirtual(req, res) {
    const { juizado_id, nome_sala_virtual, tipo_pauta_id } = req.body;
    try {
        // Verifique se o nome da sala já existe para o mesmo juizado
        const [existingSala] = await db.query(
            `SELECT j.nome_juizado FROM sala_virtual s
             INNER JOIN juizado j ON s.juizado_id = j.juizado_id
             WHERE s.nome_sala_virtual = ? AND s.juizado_id = ?`, 
            [nome_sala_virtual, juizado_id]
        );

        if (existingSala.length > 0) {
            return res.status(400).json({ 
                error: `A sala virtual com o nome '${nome_sala_virtual}' já existe no juizado '${existingSala[0].nome_juizado}'.\nNão é permitido cadastrar salas com nomes iguais para o mesmo juizado.` 
            });
        }        

        const [result] = await db.query(
            `INSERT INTO sala_virtual (juizado_id, nome_sala_virtual, tipo_pauta_id, status_sala_virtual) 
            VALUES (?, ?, ?, 'Ativo')`,
            [juizado_id, nome_sala_virtual, tipo_pauta_id]
        );

        const salaVirtualId = result.insertId;

        res.status(201).json({ message: 'Sala virtual adicionada com sucesso', sala_virtual_id: salaVirtualId });
    } catch (error) {
        console.error('Erro ao adicionar sala virtual:', error);
        res.status(500).json({ error: 'Erro ao adicionar sala virtual' });
    }
}

export async function updateSalaVirtual(req, res) {
    const { id } = req.params;
    const { juizado_id, nome_sala_virtual, tipo_pauta_id } = req.body;
    try {
        await db.query(
            `UPDATE sala_virtual 
            SET juizado_id = ?, nome_sala_virtual = ?, tipo_pauta_id = ?
            WHERE sala_virtual_id = ?`,
            [juizado_id, nome_sala_virtual, tipo_pauta_id, id]
        );

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

