import express from 'express';
import { addConciliador, deleteConciliadores, fetchConciliadores, updateConciliador, toggleConciliadorStatus } from '../controllers/conciliadorController.js';
import { fetchStatus, addStatus, updateStatus, deleteStatus, toggleStatus } from '../controllers/statusController.js';
import { addDisponibilidadeConciliador, fetchDisponibilidadesConciliadores, toggleDisponibilidadeConciliadorStatus } from '../controllers/disponibilidadeConciliadorController.js';
import { buscarDadosAudiencia  } from '../controllers/disponibilidadeSalaController.js';
import { addComarca, deleteComarca, fetchComarcas, updateComarca } from '../controllers/comarcaController.js';
import { fetchJuizados, addJuizado, updateJuizado, deleteJuizado } from '../controllers/juizadoController.js';
import { verificarSalaVirtual, addSalaVirtual, updateSalaVirtual, toggleSalaVirtualStatus, fetchSalasVirtuais, fetchTiposPauta } from '../controllers/salaVirtualController.js';
import { addTipoDePauta, fetchTiposDePauta, updateTipoDePauta, toggleTipoDePautaStatus } from '../controllers/tipoDePautaController.js';

const router = express.Router();

export function registerApiRoutes(app) {
    app.get('/testdb', (req, res) => res.send('Database connection is working'));

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
    app.patch('/api/status/:id', toggleStatus);

    // Rotas para disponibilidades dos conciliadores
    app.get('/api/disponibilidades-conciliadores', fetchDisponibilidadesConciliadores);
    app.post('/api/disponibilidades-conciliadores', addDisponibilidadeConciliador);
    app.patch('/api/disponibilidades-conciliadores/:id', toggleDisponibilidadeConciliadorStatus);

    // Rotas para disponibilidades das salas
    app.get('/api/disponibilidade-sala', buscarDadosAudiencia);

    // Rotas para juizados
    app.get('/api/juizados', fetchJuizados);
    app.post('/api/juizados', addJuizado);
    app.put('/api/juizados/:id', updateJuizado);
    app.delete('/api/juizados/:id', deleteJuizado);

    // Rotas para salas virtuais
    app.get('/api/salasvirtuais', fetchSalasVirtuais);
    app.get('/api/salasvirtuais/tipospauta', fetchTiposPauta);
    app.post('/api/salasvirtuais/verificar', verificarSalaVirtual);
    app.post('/api/salasvirtuais', addSalaVirtual);
    app.put('/api/salasvirtuais/:id', updateSalaVirtual);
    app.patch('/api/salasvirtuais/:id', toggleSalaVirtualStatus);

    // Rotas para tipos de pauta
    app.get('/api/tipodepauta', fetchTiposDePauta);
    app.post('/api/tipodepauta', addTipoDePauta);
    app.put('/api/tipodepauta/:id', updateTipoDePauta);
    app.patch('/api/tipodepauta/:id', toggleTipoDePautaStatus);

}

export default router;
