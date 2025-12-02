import { Router } from 'express';

const routeur = Router();

// Routes placeholder - à implémenter
routeur.get('/', (req, res) => {
    res.json({ succes: true, donnees: [], message: 'Routes matchs - à implémenter' });
});

export default routeur;
