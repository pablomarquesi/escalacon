import { testDbConnection, fetchConciliadores, fetchComarcas, addConciliador, deleteConciliadores } from '../controllers/conciliadorController.js';

export function registerApiRoutes(app) {
    app.get('/testdb', testDbConnection);
    app.get('/api/conciliadores', fetchConciliadores);
    app.get('/api/comarcas', fetchComarcas);
    app.post('/api/conciliadores', addConciliador);
    router.post('/conciliadores/delete', deleteConciliadores);
}
