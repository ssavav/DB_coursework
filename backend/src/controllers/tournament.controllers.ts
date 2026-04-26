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

export {
    getTournamentByIDHandler,
    getAllTournamentsHandler
};
