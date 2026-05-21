import { Router } from "express";
import { getMatchesHandler,
        getMatchByIdHandler,
        getMatchHistoryHandler,
        getMatchesByTournamentIdHandler,
        createMatchHandler,
        getApprovedTeamsHandler,
        updateMatchHandler,} from "../controllers/match.controllers";

const matchRoutes = Router();

matchRoutes.get('/', getMatchesHandler);
matchRoutes.get('/history/:team1Id/:team2Id', getMatchHistoryHandler);
matchRoutes.get('/tournament/:tournamentId', getMatchesByTournamentIdHandler);
matchRoutes.get('/tournament/:tournamentId/approved-teams', getApprovedTeamsHandler);
matchRoutes.get('/:id', getMatchByIdHandler);
matchRoutes.post('/', createMatchHandler);
matchRoutes.patch('/:id', updateMatchHandler);

export default matchRoutes;