import db from '../config/database.js';

// Função para testar a conexão com o banco de dados MySQ
export async function testDbConnection(req, res) {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ mysql: 'connected', solution: rows[0].solution });
    } catch (err) {
        console.error('Erro ao conectar ao MySQL', err);
        res.status(500).json({ error: 'Erro ao conectar ao MySQL' });
    }
}

// Função para buscar informações de conciliadores do banco de dados
export async function fetchConciliadores(req, res) {
    try {
        const [conciliadores] = await db.query(`
            SELECT conc.conciliador_id, conc.comarca_id, conc.matricula, conc.nome_conciliador, 
                   conc.cpf, conc.telefone, conc.email, conc.data_credenciamento, 
                   com.nome_comarca 
            FROM conciliador AS conc 
            INNER JOIN comarca AS com 
            ON conc.comarca_id = com.comarca_id;
        `);
        res.json(conciliadores);
    } catch (error) {
        console.error('Erro ao buscar conciliadores:', error);
        res.status(500).send('Erro no servidor ao buscar conciliadores');
    }
}

// Função para buscar informações de comarcas do banco de dados.
export async function fetchComarcas(req, res) {
    try {
        const [comarcas] = await db.query('SELECT comarca_id, nome_comarca FROM comarca;');
        res.json(comarcas);
    } catch (error) {
        console.error('Erro ao buscar comarcas:', error);
        res.status(500).send('Erro no servidor ao buscar comarcas');
    }
}

// Função para adicionar um novo conciliador no banco de da
export async function addConciliador(req, res) {
    console.log(req.body);
    const { matricula, nome_conciliador, cpf, telefone, email, comarca_id, data_credenciamento } = req.body;
    try {
        const result = await db.query(`
            INSERT INTO conciliador (matricula, nome_conciliador, cpf, telefone, email, comarca_id, data_credenciamento)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [matricula, nome_conciliador, cpf, telefone, email, comarca_id, data_credenciamento]);

        console.log(result);
        console.log('resulta log');
        if (result.affectedRows > 0) {
            res.status(201).json({ message: "Conciliador adicionado com sucesso." });
        } else {
            res.status(400).json({ message: "Não foi possível adicionar o conciliador." });
        }
    } catch (error) {
        console.error('Erro ao adicionar conciliador:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar conciliador' });
    }
}

// Função para excluir conciliadores pelo ID
export async function deleteConciliadores(req, res) {
    const { id } = req.params;
    console.log(id);
    // Constrói a lista de placeholders para a query
    // const placeholders = ids.map(() => '?').join(',');
    try {
        const result = await db.query(`
            DELETE FROM conciliador WHERE conciliador_id = ${id}
        `);

        if (result.length > 0) {                        
            if (result[0].affectedRows > 0) {
                console.log('affectedRows');
                res.json({ message: "Conciliadores excluídos com sucesso.", affectedRows: result[0].affectedRows });
            } else {
                res.status(404).json({ message: "Conciliadores não encontrados." });
            }
        }        
    } catch (error) {
        console.error('Erro ao excluir conciliadores:', error);
        res.status(500).json({ error: 'Erro no servidor ao excluir conciliadores' });
    }
}

