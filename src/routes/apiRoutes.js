import { addConciliador, deleteConciliadores, fetchConciliadores, testDbConnection, updateConciliador, toggleConciliadorStatus } from '../controllers/conciliadorController.js';
import { fetchStatus, addStatus, updateStatus, deleteStatus, toggleStatus } from '../controllers/statusController.js';
import { addDisponibilidade, fetchDisponibilidades, toggleDisponibilidadeStatus } from '../controllers/disponibilidadeController.js';
import { addComarca, deleteComarca, fetchComarcas, updateComarca } from '../controllers/comarcaController.js';
import { fetchJuizados, addJuizado, updateJuizado, deleteJuizado } from '../controllers/juizadoController.js';
import { fetchSalasVirtuais, addSalaVirtual, updateSalaVirtual, deleteSalaVirtual, fetchTiposPauta } from '../controllers/salaVirtualController.js';

export function registerApiRoutes(app) {
    app.get('/testdb', testDbConnection);

    // Rotas para conciliadores
    app.get('/api/conciliadores', fetchConciliadores);
    app.put('/api/conciliadores/:id', updateConciliador);
    app.post('/api/conciliadores', addConciliador);
    app.delete('/api/conciliadores/:id', deleteConciliadores);
    app.patch('/api/conciliadores/:id', toggleConciliadorStatus);

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
    app.patch('/api/status/:id', toggleStatus); // Corrigido aqui

    // Rotas para disponibilidades
    app.get('/api/disponibilidades', fetchDisponibilidades);
    app.post('/api/disponibilidades', addDisponibilidade);
    app.patch('/api/disponibilidades/:id', toggleDisponibilidadeStatus);

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

    // Rota para tipos de pauta
    app.get('/api/tipospauta', fetchTiposPauta);
}
