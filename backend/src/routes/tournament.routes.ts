import { Router } from "express";
import getAllTournamentsHandler from "../controllers/tournament.controllers";

const tournamentRoutes = Router();

tournamentRoutes.get('/', getAllTournamentsHandler);

export default tournamentRoutes;


