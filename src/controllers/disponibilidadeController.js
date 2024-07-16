import db from '../config/database.js';

export async function fetchDisponibilidades(req, res) {
    try {
        const [disponibilidades] = await db.query(`
            SELECT dc.id, c.nome_conciliador, dm.ano, dm.mes, dm.quantidade_dias, ds.dia_da_semana, s.nome_status, s.descricao_status
            FROM disponibilidade_conciliador AS dc
            INNER JOIN conciliador AS c ON dc.conciliador_id = c.conciliador_id
            INNER JOIN disponibilidade_mes AS dm ON dc.disponibilidade_mes_id = dm.id
            INNER JOIN disponibilidade_semana AS ds ON dc.disponibilidade_semana_id = ds.id
            LEFT JOIN status AS s ON dc.status_id = s.status_id
            ORDER BY c.nome_conciliador ASC, dm.mes ASC, dm.ano ASC;
        `);
        res.json(disponibilidades);
    } catch (error) {
        res.status(500).send('Erro no servidor ao buscar disponibilidades');
    }
}

export async function addDisponibilidade(req, res) {
    const { conciliador_id, ano, mes, quantidade_dias, dias_da_semana, status_id } = req.body;

    try {
        // Verifica se já existe uma disponibilidade para o mesmo conciliador, ano e mês
        const [existingDisponibilidade] = await db.query(`
            SELECT dc.id
            FROM disponibilidade_conciliador AS dc
            INNER JOIN disponibilidade_mes AS dm ON dc.disponibilidade_mes_id = dm.id
            WHERE dc.conciliador_id = ? AND dm.ano = ? AND dm.mes = ?
        `, [conciliador_id, ano, mes]);

        if (existingDisponibilidade.length > 0) {
            return res.status(400).json({ message: 'Já existe uma disponibilidade para este conciliador no ano e mês selecionados.' });
        }

        const [mesResult] = await db.query(`
            INSERT INTO disponibilidade_mes (conciliador_id, ano, mes, quantidade_dias)
            VALUES (?, ?, ?, ?)
        `, [conciliador_id, ano, mes, quantidade_dias]);

        const disponibilidade_mes_id = mesResult.insertId;

        for (const dia of dias_da_semana) {
            const [semanaResult] = await db.query(`
                INSERT INTO disponibilidade_semana (conciliador_id, dia_da_semana)
                VALUES (?, ?)
            `, [conciliador_id, dia]);
            const disponibilidade_semana_id = semanaResult.insertId;

            await db.query(`
                INSERT INTO disponibilidade_conciliador (conciliador_id, disponibilidade_mes_id, disponibilidade_semana_id, status_id)
                VALUES (?, ?, ?, ?)
            `, [conciliador_id, disponibilidade_mes_id, disponibilidade_semana_id, status_id]);
        }

        res.status(201).json({ message: "Disponibilidade adicionada com sucesso." });
    } catch (error) {
        console.error('Erro no servidor ao adicionar disponibilidade:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar disponibilidade' });
    }
}

export async function deleteDisponibilidade(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query(`DELETE FROM disponibilidade_conciliador WHERE id = ?`, [id]);
        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: "Disponibilidade excluída com sucesso." });
        } else {
            res.status(404).json({ message: "Disponibilidade não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao excluir disponibilidade' });
    }
}
