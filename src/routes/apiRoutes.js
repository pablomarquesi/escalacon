import { addConciliador, deleteConciliadores, fetchConciliadores, testDbConnection, updateConciliador } from '../controllers/conciliadorController.js';
import { fetchStatus, addStatus, updateStatus, deleteStatus } from '../controllers/statusController.js';
import { addComarca, deleteComarca, fetchComarcas, updateComarca } from '../controllers/comarcaController.js';

export function registerApiRoutes(app) {
    app.get('/testdb', testDbConnection);

    // Rotas para conciliadores
    app.get('/api/conciliadores', fetchConciliadores);
    app.put('/api/conciliadores/:id', updateConciliador);
    app.post('/api/conciliadores', addConciliador);
    app.delete('/api/conciliadores/:id', deleteConciliadores);

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
}
