import db from '../config/database.js';
import { verificarSalaVirtual, addSalaVirtual } from './salaVirtualController.js';

export async function importarAudiencias(req, res) {
    const { audiencias, juizado_id } = req.body;

    try {
        for (const audiencia of audiencias) {
            // Verificar se a sala existe
            const salaExiste = await verificarSalaVirtual(juizado_id, audiencia.nomeSala);
            
            let salaVirtualId;
            if (!salaExiste) {
                // Criar nova sala virtual se não existir
                const novaSala = { juizado_id, nome_sala_virtual: audiencia.nomeSala, tipo_pauta_id: audiencia.tipoPautaId };
                const novaSalaResult = await addSalaVirtual({ body: novaSala }, res);
                salaVirtualId = novaSalaResult.sala_virtual_id;
            } else {
                // Buscar ID da sala existente
                const [salaVirtual] = await db.query(
                    'SELECT sala_virtual_id FROM sala_virtual WHERE juizado_id = ? AND nome_sala_virtual = ?',
                    [juizado_id, audiencia.nomeSala]
                );
                salaVirtualId = salaVirtual[0].sala_virtual_id;
            }

            // Adicionar audiência
            await db.query(
                `INSERT INTO audiencia (juizado_id, sala_virtual_id, data_audiencia, status)
                VALUES (?, ?, ?, ?)`,
                [juizado_id, salaVirtualId, audiencia.data, 'Ativo']
            );
        }

        res.status(201).json({ message: 'Audiências importadas com sucesso' });
    } catch (error) {
        console.error('Erro ao importar audiências:', error);
        res.status(500).json({ error: 'Erro ao importar audiências' });
    }
}

export async function getEscala(req, res) {
    const { juizado_id } = req.params;

    try {
        const [escala] = await db.query(
            `SELECT 
                a.audiencia_id, 
                a.data_audiencia, 
                s.nome_sala_virtual, 
                j.nome_juizado, 
                a.status
            FROM 
                audiencia AS a
            INNER JOIN 
                sala_virtual AS s ON a.sala_virtual_id = s.sala_virtual_id
            INNER JOIN 
                juizado AS j ON a.juizado_id = j.juizado_id
            WHERE 
                a.juizado_id = ?`,
            [juizado_id]
        );
        
        res.json(escala);
    } catch (error) {
        console.error('Erro ao buscar escala:', error);
        res.status(500).json({ error: 'Erro ao buscar escala' });
    }
}
