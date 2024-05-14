import { addConciliador, deleteConciliadores, fetchComarcas, fetchConciliadores, testDbConnection, updateConciliador } from '../controllers/conciliadorController.js';
import { fetchStatus, addStatus, updateStatus, deleteStatus } from '../controllers/statusController.js';

export function registerApiRoutes(app) {
    app.get('/testdb', testDbConnection);
    
    app.get('/api/conciliadores', fetchConciliadores);
    app.put('/api/conciliadores/:id', updateConciliador);
    app.post('/api/conciliadores', addConciliador);
    app.delete('/api/conciliadores/:id', deleteConciliadores);
    
    app.get('/api/comarcas', fetchComarcas);
    
    // Rotas para status
    app.get('/api/status', fetchStatus);
    app.post('/api/status', addStatus);
    app.put('/api/status/:id', updateStatus);
    app.delete('/api/status/:id', deleteStatus);
}
