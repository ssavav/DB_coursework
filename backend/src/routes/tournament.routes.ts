import { Router } from "express";
import * as tournamentControllers from "../controllers/tournament.controllers";

const tournamentRoutes = Router();

tournamentRoutes.get('/', tournamentControllers.getAllTournamentsHandler);
tournamentRoutes.post('/', tournamentControllers.createTournamentHandler);

tournamentRoutes.get('/organizer/:organizerId', tournamentControllers.getTournamentsByOrganizerIDHandler); 

tournamentRoutes.get('/:id', tournamentControllers.getTournamentByIDHandler);
tournamentRoutes.put('/:id', tournamentControllers.updateTournamentHandler); 

export default tournamentRoutes;