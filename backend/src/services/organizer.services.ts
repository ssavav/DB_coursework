import * as organizerRepository from "../repositories/organizer.repository";
import { getTournamentsByOrganizerID } from "../repositories/tournament.repository";

async function getOrganizerByID(id: number){
    try{
        const oragnizerInfo = await organizerRepository.getOrganizerByID(id);
        const organizerTournaments = await getTournamentsByOrganizerID(id);
        
        oragnizerInfo.tournaments = organizerTournaments;

        return oragnizerInfo;
    } catch(error){
        return error;
    }
}

async function getOrganizerByUserId(userId: number) {
        try{
        const oragnizerInfo = await organizerRepository.getOrganizerByUserId(userId);
        
        return oragnizerInfo;
    } catch(error){
        return error;
    }
}

export {
    getOrganizerByID,
    getOrganizerByUserId,
};