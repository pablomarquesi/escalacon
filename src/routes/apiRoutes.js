import { addConciliador, deleteConciliadores, fetchComarcas, fetchConciliadores, testDbConnection } from '../controllers/conciliadorController.js';

export function registerApiRoutes(app) {
    app.get('/testdb', testDbConnection);
    
    app.get('/api/conciliadores', fetchConciliadores);
    // app.get('/api/conciliadores/:id', getByIdConciliadores);
    // app.put('/api/conciliadores', updateConciliadores);
    app.post('/api/conciliadores', addConciliador);
    app.delete('/api/conciliadores/:id', deleteConciliadores);
    
    app.get('/api/comarcas', fetchComarcas);
}
