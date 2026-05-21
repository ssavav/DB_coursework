import { createTeamPlayerByData, 
    deleteTeamPlayerByID, 
    getTeamSquadByID, 
    getTeamIDByUser,
    getTeamNameByTeamID, 
    getTeamIdByName,
    getTeamFullInfoById  } from "../services/team.services";
import { Request, Response } from "express";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CreatePlayerInput } from "../types/team.types";

dayjs.extend(customParseFormat);

async function getTeamSquadByIDHandler(req: Request, res: Response) {
    try{
        const id: number = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await getTeamSquadByID(id);
    
        if (!result) {
            return res.status(404).json({ error: "Team not found" });
        }

        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getTeamNameByIDHandler(req: Request, res: Response) {
    try{
        const id: number = Number(req.params.teamId);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await getTeamNameByTeamID(id);
    
        if (!result) {
            return res.status(404).json({ error: "Team not found" });
        }

        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteTeamPlayerByIDHandler(req: Request, res: Response) {
    try{
        const id: number = Number(req.params.teamId);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await deleteTeamPlayerByID(id);
        if (!result) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

async function createTeamPlayerByDataHandler(req: Request, res: Response) {
    try{
        const data: CreatePlayerInput = req.body;
        const id = data.teamId;
        const birthDate: string = data.birthDate;
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        
        const validBirthDate: boolean = dayjs(
            birthDate,
            "YYYY-MM-DD",
            true
        ).isValid();
        
        if (!validBirthDate){
            return res.status(400).json({ error: "Invalid birth date format" });
        }

        const result = await createTeamPlayerByData(data);
        if (!result) {
            return res.status(500).json({ error: "Internal server error???" });
        }
        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getTeamIDByUserIDHandler(req: Request, res: Response) {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) return res.status(400).json({ error: "Invalid ID" });

        const teamId = await getTeamIDByUser(userId);
        if (!teamId) return res.status(404).json({ error: "Team not found" });

        res.status(200).json({ teamId });
    } catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
}

async function getTeamIdByNameHandler(req: Request, res: Response) {
    try {
        const teamName = req.query.name as string;
        if (!teamName) return res.status(400).json({ error: "Name query parameter required" });

        const id = await getTeamIdByName(teamName);
        res.status(200).json({ id });
    } catch(error) {
        res.status(404).json({ error: "Team not found" });
    }
}

async function getTeamFullInfoHandler(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        const result = await getTeamFullInfoById(id);
        if (!result) return res.status(404).json({ error: "Team not found" });
        
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    getTeamSquadByIDHandler,
    deleteTeamPlayerByIDHandler,
    createTeamPlayerByDataHandler,
    getTeamIDByUserIDHandler,
    getTeamNameByIDHandler,
    getTeamIdByNameHandler,
    getTeamFullInfoHandler
};