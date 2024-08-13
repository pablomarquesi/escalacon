import db from '../config/database.js';

export const fetchAudiencias = async () => {
  try {
    const [results] = await db.query('SELECT * FROM audiencia');
    return results;
  } catch (error) {
    console.error('Erro ao buscar audiências:', error);
    throw error;
  }
};

export const addAudiencia = async (audiencia) => {
  try {
    const [result] = await db.query('INSERT INTO audiencia SET ?', audiencia);
    return result.insertId;
  } catch (error) {
    console.error('Erro ao adicionar audiência:', error);
    throw error;
  }
};

export const updateAudiencia = async (id, audiencia) => {
  try {
    await db.query('UPDATE audiencia SET ? WHERE audiencia_id = ?', [audiencia, id]);
  } catch (error) {
    console.error('Erro ao atualizar audiência:', error);
    throw error;
  }
};

export const deleteAudiencia = async (id) => {
  try {
    await db.query('DELETE FROM audiencia WHERE audiencia_id = ?', [id]);
  } catch (error) {
    console.error('Erro ao deletar audiência:', error);
    throw error;
  }
};
