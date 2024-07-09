import db from '../config/database.js';

export async function testDbConnection(req, res) {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ mysql: 'connected', solution: rows[0].solution });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao conectar ao MySQL' });
    }
}

export async function fetchDisponibilidades(req, res) {
    try {
        const [disponibilidades] = await db.query(`
            SELECT cd.conciliador_id, c.nome_conciliador, cd.mes, GROUP_CONCAT(cd.dia_da_semana ORDER BY cd.dia_da_semana ASC) AS dias_da_semana
            FROM conciliador_disponibilidade AS cd
            INNER JOIN conciliador AS c ON cd.conciliador_id = c.conciliador_id
            GROUP BY cd.conciliador_id, cd.mes, c.nome_conciliador
            ORDER BY c.nome_conciliador ASC, cd.mes ASC;
        `);
        res.json(disponibilidades);
    } catch (error) {
        res.status(500).send('Erro no servidor ao buscar disponibilidades');
    }
}

export async function addDisponibilidade(req, res) {
    const { disponibilidades } = req.body;
    try {
        for (const disponibilidade of disponibilidades) {
            await db.query(`
                INSERT INTO conciliador_disponibilidade (conciliador_id, dia_da_semana, mes)
                VALUES (?, ?, ?)
            `, [disponibilidade.conciliador_id, disponibilidade.dia_da_semana, disponibilidade.mes]);
        }
        res.status(201).json({ message: "Disponibilidades adicionadas com sucesso." });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao adicionar disponibilidades' });
    }
}

export async function deleteDisponibilidade(req, res) {
    const { conciliador_id, mes, dia_da_semana } = req.params;
    try {
        let query = `DELETE FROM conciliador_disponibilidade WHERE conciliador_id = ? AND mes = ?`;
        let params = [conciliador_id, mes];
        if (dia_da_semana) {
            query += ` AND dia_da_semana = ?`;
            params.push(dia_da_semana);
        }
        const result = await db.query(query, params);

        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: "Disponibilidades excluídas com sucesso." });
        } else {
            res.status(404).json({ message: "Disponibilidades não encontradas." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao excluir disponibilidades' });
    }
}

