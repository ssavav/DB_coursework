import { Router } from "express";
import * as tournamentRegistrationControllers from "../controllers/tournamentRegistration.controllers";

const tournamentRegistrationRoutes = Router();

tournamentRegistrationRoutes.get('/available-for-team/:teamId', tournamentRegistrationControllers.getAvailableTournamentsForTeamHandler);
tournamentRegistrationRoutes.get('/all/:teamId', tournamentRegistrationControllers.getTeamRegistrationsHandler);
tournamentRegistrationRoutes.get('/organizer/:organizerId', tournamentRegistrationControllers.getRegistrationsByOrganizerHandler);

tournamentRegistrationRoutes.patch('/status', tournamentRegistrationControllers.updateRegistrationStatusHandler);

tournamentRegistrationRoutes.post('/register', tournamentRegistrationControllers.registerTeamForTournamentHandler);
export default tournamentRegistrationRoutes;