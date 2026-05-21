import * as tournamentServices from "../services/tournament.services";
import { Request, Response } from "express";
import { TournamentFilters } from "../types/tournament.types";


const getAllTournamentsHandler = async (req: Request, res: Response) =>{
    try{
        const filters: TournamentFilters = {
            sportType : req.query.sport ? String(req.query.sport) : undefined,
            status : req.query.status ? String(req.query.status) : undefined,
            name : req.query.name ? String(req.query.name) : undefined,
        }

        const result = await tournamentServices.getAllTournaments(filters);
        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

const getTournamentByIDHandler = async (req: Request, res: Response) =>{
    try{
        const id: number = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await tournamentServices.getTournamentByID(id);
    
        if (!result) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

const getTournamentsByOrganizerIDHandler = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.organizerId);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
        const result = await tournamentServices.getTournamentsByOrganizerID(id);
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({ error: "Server error" });
    }
}

const createTournamentHandler = async (req: Request, res: Response) => {
    try {
        const organizerId = req.body.organizerId;
        if (!organizerId) return res.status(400).json({ error: "Organizer ID is required" });

        const newTournament = await tournamentServices.createTournament(organizerId, req.body);
        res.status(201).json(newTournament);
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateTournamentHandler = async (req: Request, res: Response) => {
    try {
        const tournamentId = Number(req.params.id);
        const organizerId = req.body.organizerId;

        if (isNaN(tournamentId) || !organizerId) {
            return res.status(400).json({ error: "Invalid ID or Missing organizerId" });
        }

        const updated = await tournamentServices.updateTournament(tournamentId, organizerId, req.body);
        if (!updated) {
            return res.status(403).json({ error: "No permission or tournament not found" });
        }
        res.status(200).json(updated);
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    getTournamentByIDHandler,
    getAllTournamentsHandler,
    createTournamentHandler,
    updateTournamentHandler,
    getTournamentsByOrganizerIDHandler
};