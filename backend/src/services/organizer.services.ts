import * as organizerRepository from "../repositories/organizer.repository";
import { getTournamentByOrganizerID } from "../repositories/tournament.repository";

async function getOrganizerByID(id: number){
    try{
        const oragnizerInfo = await organizerRepository.getOrganizerByID(id);
        const organizerTournaments = await getTournamentByOrganizerID(id);
        
        oragnizerInfo.tournaments = organizerTournaments;

        return oragnizerInfo;
    } catch(error){
        return error;
    }
}

export {
    getOrganizerByID
};