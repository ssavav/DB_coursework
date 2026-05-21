import * as tournamentRegistrationServices from "../services/tournamentRegistration.services";
import { Request, Response } from "express";



const getAvailableTournamentsForTeamHandler = async (req: Request, res: Response) => {
    try {
        const teamId: number = Number(req.params.teamId);

        if (isNaN(teamId)) {
            return res.status(400).json({ error: "Invalid team ID format" });
        }

        const result = await tournamentRegistrationServices.getAvailableTournamentsForTeam(teamId);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const getTeamRegistrationsHandler = async (req: Request, res: Response) => {
    try {
        const teamId: number = Number(req.params.teamId);

        if (isNaN(teamId)) {
            return res.status(400).json({ error: "Invalid team ID format" });
        }

        const result = await tournamentRegistrationServices.getTeamRegistrations(teamId);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
const getRegistrationsByOrganizerHandler = async (req: Request, res: Response) => {
    try {
        const organizerId: number = Number(req.params.organizerId);

        if (isNaN(organizerId)) {
            return res.status(400).json({ error: "Invalid organizer ID format" });
        }

        const result = await tournamentRegistrationServices.getRegistrationsByOrganizer(organizerId);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateRegistrationStatusHandler = async (req: Request, res: Response) => {
    try {
        const { tournamentId, teamId, newStatus } = req.body;

        if (isNaN(tournamentId) || isNaN(teamId) || !newStatus) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const result = await tournamentRegistrationServices.updateRegistrationStatus(tournamentId, teamId, newStatus);
        
        if (!result) {
            return res.status(400).json({ error: "Registration not found or is no longer 'pending'" });
        }
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const registerTeamForTournamentHandler = async (req: Request, res: Response) => {
    try {
        const { teamId, tournamentId } = req.body;

        if (isNaN(teamId) || isNaN(tournamentId)) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        await tournamentRegistrationServices.registerTeamForTournament(teamId, tournamentId);
        res.status(200).json({ success: true, message: "Team registered successfully" });
    } catch(error: any) {
        res.status(400).json({ error: error.message || "Error" });
    }
}

export {
    getAvailableTournamentsForTeamHandler,
    getTeamRegistrationsHandler,
    getRegistrationsByOrganizerHandler,
    updateRegistrationStatusHandler,
    registerTeamForTournamentHandler
};