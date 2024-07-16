import db from '../config/database.js';

export async function fetchDisponibilidades(req, res) {
    try {
        const [disponibilidades] = await db.query(`
            SELECT cd.conciliador_id, c.nome_conciliador, cd.mes, cd.ano, cd.dia_da_semana, cd.status_id, s.nome_status
            FROM conciliador_disponibilidade AS cd
            INNER JOIN conciliador AS c ON cd.conciliador_id = c.conciliador_id
            INNER JOIN status AS s ON cd.status_id = s.status_id
            ORDER BY c.nome_conciliador ASC, cd.mes ASC, cd.ano ASC;
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
                INSERT INTO conciliador_disponibilidade (conciliador_id, dia_da_semana, mes, ano, status_id)
                VALUES (?, ?, ?, ?, ?)
            `, [disponibilidade.conciliador_id, disponibilidade.dia_da_semana, disponibilidade.mes, disponibilidade.ano, disponibilidade.status_id]);
        }
        res.status(201).json({ message: "Disponibilidades adicionadas com sucesso." });
    } catch (error) {
        console.error('Erro no servidor ao adicionar disponibilidades:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar disponibilidades' });
    }
}

export async function deleteDisponibilidade(req, res) {
    const { conciliador_id, mes, ano, dia_da_semana } = req.params;
    try {
        let query = `DELETE FROM conciliador_disponibilidade WHERE conciliador_id = ? AND mes = ? AND ano = ?`;
        let params = [conciliador_id, mes, ano];
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
