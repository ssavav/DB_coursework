import { Router } from "express";
import * as tournamentControllers from "../controllers/tournament.controllers";

const tournamentRoutes = Router();

tournamentRoutes.get('/', tournamentControllers.getAllTournamentsHandler);

tournamentRoutes.get('/:id', tournamentControllers.getTournamentByIDHandler);

export default tournamentRoutes;


