import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './src/config/database.js';

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Uma rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao backend!' });
});

// Rota de teste para verificar a conexão com o MySQL
app.get('/testdb', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ mysql: 'connected', solution: rows[0].solution });
  } catch (err) {
    console.error('Erro ao conectar ao MySQL', err);
    res.status(500).json({ error: 'Erro ao conectar ao MySQL' });
  }
});

// Nova rota para buscar conciliadores, incluindo o nome da comarca
app.get('/api/conciliadores', async (req, res) => {
  try {
    // Ajuste na consulta para incluir a junção com a tabela comarca
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
});


// Adicionando a rota para buscar comarcas
app.get('/api/comarcas', async (req, res) => {
  try {
    const [comarcas] = await db.query('SELECT comarca_id, nome_comarca FROM comarca;');
    res.json(comarcas);
  } catch (error) {
    console.error('Erro ao buscar comarcas:', error);
    res.status(500).send('Erro no servidor ao buscar comarcas');
  }
});


// Adicionando um conciliador
app.post('/api/conciliadores', async (req, res) => {
  const { matricula, nome_conciliador, cpf, telefone, email, comarca_id, data_credenciamento } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO conciliador (matricula, nome_conciliador, cpf, telefone, email, comarca_id, data_credenciamento)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [matricula, nome_conciliador, cpf, telefone, email, comarca_id, data_credenciamento]);

    if (result.affectedRows > 0) {
      res.status(201).json({ message: "Conciliador adicionado com sucesso." });
    } else {
      res.status(400).json({ message: "Não foi possível adicionar o conciliador." });
    }
  } catch (error) {
    console.error('Erro ao adicionar conciliador:', error);
    res.status(500).json({ error: 'Erro no servidor ao adicionar conciliador' });
  }
});



// Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
