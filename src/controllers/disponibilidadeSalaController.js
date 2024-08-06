import db from '../config/database.js';

async function findOrCreateSala(nomeSala) {
    try {
        const [rows] = await db.query('SELECT sala_virtual_id FROM sala_virtual WHERE nome_sala_virtual = ?', [nomeSala]);
        if (rows.length > 0) {
            console.log(`Sala encontrada: ${nomeSala}, ID: ${rows[0].sala_virtual_id}`);
            return rows[0].sala_virtual_id;
        } else {
            const [result] = await db.query('INSERT INTO sala_virtual (nome_sala_virtual, status_sala_virtual) VALUES (?, "Ativo")', [nomeSala]);
            console.log(`Sala criada: ${nomeSala}, Novo ID: ${result.insertId}`);
            return result.insertId;
        }
    } catch (error) {
        console.error('Erro ao encontrar ou criar a sala:', error);
        throw error;
    }
}

export async function addDisponibilidadeSala(req, res) {
    const dadosDisponibilidade = req.body;
    console.log('Dados recebidos:', dadosDisponibilidade);
    try {
        for (let dados of dadosDisponibilidade) {
            const { sala, data_audiencia, quantidade_audiencias, status } = dados;
            console.log('Processando:', sala, data_audiencia, quantidade_audiencias, status);

            const sala_virtual_id = await findOrCreateSala(sala);
            console.log('ID da sala virtual:', sala_virtual_id);

            await db.query(`
                INSERT INTO disponibilidade_sala_virtual (sala_virtual_id, data_audiencia, quantidade_audiencias, status)
                VALUES (?, ?, ?, ?)
            `, [sala_virtual_id, data_audiencia, quantidade_audiencias, status]);
        }
        res.status(201).json({ message: "Disponibilidades salvas com sucesso." });
    } catch (error) {
        console.error('Erro ao salvar as disponibilidades:', error);
        res.status(500).json({ error: 'Erro no servidor ao salvar as disponibilidades' });
    }
}

// Você pode adicionar esta função se quiser listar as disponibilidades das salas
export async function fetchDisponibilidadesSalas(req, res) {
    try {
        const [rows] = await db.query('SELECT * FROM disponibilidade_sala_virtual');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar disponibilidades:', error);
        res.status(500).json({ error: 'Erro no servidor ao buscar disponibilidades' });
    }
}

// Outra função, como a de alterar o status de uma disponibilidade
export async function toggleDisponibilidadeSalaStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const [result] = await db.query(`
            UPDATE disponibilidade_sala_virtual 
            SET status = ?
            WHERE disponibilidade_id = ?
        `, [status, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Status da disponibilidade atualizado com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível atualizar o status da disponibilidade." });
        }
    } catch (error) {
        console.error('Erro ao alterar status da disponibilidade:', error);
        res.status(500).json({ error: 'Erro no servidor ao alterar status da disponibilidade' });
    }
}
