import * as organizerServices from "../services/organizer.services";
import { Request, Response } from "express";

const getOrganizerByIDHandler = async (req: Request, res: Response) =>{
    try{
        const id: number = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await organizerServices.getOrganizerByID(id);
    
        if (!result) {
            return res.status(404).json({ error: "Organizer not found" });
        }

        res.status(200).json(result);
    } catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

const getOrganizerByUserIdHandler = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

        const organizer = await organizerServices.getOrganizerByUserId(userId);
        if (!organizer) return res.status(404).json({ error: "Organizer not found" });

        res.status(200).json(organizer);
    } catch(err) {
        res.status(500).json({ error: "Server error" });
    }
}



export {
    getOrganizerByIDHandler,
    getOrganizerByUserIdHandler,
};