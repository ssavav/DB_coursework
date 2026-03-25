import getTournaments from "../services/tournament.services";
import { Request, Response } from "express";
import { TournamentFilters } from "../types/tournament.types";


const getAllTournamentsHandler = async (req: Request, res: Response) =>{
    try{
        const filters: TournamentFilters = {
            sportType : req.query.sport ? String(req.query.sport) : undefined,
            status : req.query.status ? String(req.query.status) : undefined,
            name : req.query.name ? String(req.query.name) : undefined,
        }

        const result = await getTournaments(filters);
        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

export default getAllTournamentsHandler;
