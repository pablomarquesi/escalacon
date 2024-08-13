import db from '../config/database.js';

export const getAudiencias = async (req, res) => {
  try {
    const query = `
      SELECT 
        audiencia.audiencia_id,
        audiencia.data_audiencia,
        audiencia.status,
        juizado.nome_juizado,
        sala_virtual.nome_sala_virtual
      FROM audiencia
      JOIN juizado ON audiencia.juizado_id = juizado.juizado_id
      JOIN sala_virtual ON audiencia.sala_virtual_id = sala_virtual.sala_virtual_id
    `;
    
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar audiências:', error);
    res.status(500).json({ error: 'Erro ao buscar audiências' });
  }
};

export const createAudiencia = async (req, res) => {
  try {
    const { juizado_id, sala_virtual_id, data_audiencia, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO audiencia (juizado_id, sala_virtual_id, data_audiencia, status) VALUES (?, ?, ?, ?)',
      [juizado_id, sala_virtual_id, data_audiencia, status]
    );
    res.status(201).json({ audiencia_id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar audiência:', error);
    res.status(500).json({ error: 'Erro ao criar audiência' });
  }
};

export const updateAudienciaById = async (req, res) => {
  try {
    const { juizado_id, sala_virtual_id, data_audiencia, status } = req.body;
    const { id } = req.params;
    await db.query(
      'UPDATE audiencia SET juizado_id = ?, sala_virtual_id = ?, data_audiencia = ?, status = ? WHERE audiencia_id = ?',
      [juizado_id, sala_virtual_id, data_audiencia, status, id]
    );
    res.status(204).end();
  } catch (error) {
    console.error('Erro ao atualizar audiência:', error);
    res.status(500).json({ error: 'Erro ao atualizar audiência' });
  }
};

export const deleteAudienciaById = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM audiencia WHERE audiencia_id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Erro ao deletar audiência:', error);
    res.status(500).json({ error: 'Erro ao deletar audiência' });
  }
};
