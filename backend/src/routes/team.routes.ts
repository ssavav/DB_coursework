import { Router } from "express";
import { createTeamPlayerByDataHandler, 
    deleteTeamPlayerByIDHandler,
    getTeamIDByUserIDHandler,
    getTeamNameByIDHandler,
    getTeamSquadByIDHandler,
    getTeamFullInfoHandler,
    getTeamIdByNameHandler } from "../controllers/team.controllers";

const teamRoutes = Router();

teamRoutes.get('/search', getTeamIdByNameHandler); 
teamRoutes.get('/card/:id', getTeamFullInfoHandler); 
teamRoutes.get('/squad/:id', getTeamSquadByIDHandler);
teamRoutes.delete('/player/:teamId', deleteTeamPlayerByIDHandler);
teamRoutes.post('/player', createTeamPlayerByDataHandler);
teamRoutes.get('/my-team/:userId', getTeamIDByUserIDHandler);
teamRoutes.get('/name/:teamId', getTeamNameByIDHandler);

export default teamRoutes;


