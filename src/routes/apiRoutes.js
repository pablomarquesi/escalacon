import { addConciliador, deleteConciliadores, fetchConciliadores, testDbConnection, updateConciliador, toggleConciliadorStatus } from '../controllers/conciliadorController.js';
import { fetchStatus, addStatus, updateStatus, deleteStatus } from '../controllers/statusController.js';
import { addComarca, deleteComarca, fetchComarcas, updateComarca } from '../controllers/comarcaController.js';
import { addDisponibilidade, deleteDisponibilidade, fetchDisponibilidades } from '../controllers/disponibilidadeController.js';
import { fetchJuizados, addJuizado, updateJuizado, deleteJuizado } from '../controllers/juizadoController.js';
import { fetchSalasVirtuais, addSalaVirtual, updateSalaVirtual, deleteSalaVirtual } from '../controllers/salaVirtualController.js';

export function registerApiRoutes(app) {
    app.get('/testdb', testDbConnection);

    // Rotas para conciliadores
    app.get('/api/conciliadores', fetchConciliadores);
    app.put('/api/conciliadores/:id', updateConciliador);
    app.post('/api/conciliadores', addConciliador);
    app.delete('/api/conciliadores/:id', deleteConciliadores);
    app.patch('/api/conciliadores/:id', toggleConciliadorStatus); // Nova rota para alterar status

    // Rotas para comarcas
    app.get('/api/comarcas', fetchComarcas);
    app.post('/api/comarcas', addComarca);
    app.put('/api/comarcas/:id', updateComarca);
    app.delete('/api/comarcas/:id', deleteComarca);

    // Rotas para status
    app.get('/api/status', fetchStatus);
    app.post('/api/status', addStatus);
    app.put('/api/status/:id', updateStatus);
    app.delete('/api/status/:id', deleteStatus);

    // Rotas para disponibilidades
    app.get('/api/disponibilidades', fetchDisponibilidades);
    app.post('/api/disponibilidades', addDisponibilidade);
    app.delete('/api/disponibilidades/:conciliador_id/:mes/:ano/:dia_da_semana', deleteDisponibilidade);

    // Rotas para juizados
    app.get('/api/juizados', fetchJuizados);
    app.post('/api/juizados', addJuizado);
    app.put('/api/juizados/:id', updateJuizado);
    app.delete('/api/juizados/:id', deleteJuizado);

    // Rotas para salas virtuais
    app.get('/api/salasvirtuais', fetchSalasVirtuais);
    app.post('/api/salasvirtuais', addSalaVirtual);
    app.put('/api/salasvirtuais/:id', updateSalaVirtual);
    app.delete('/api/salasvirtuais/:id', deleteSalaVirtual);
}
