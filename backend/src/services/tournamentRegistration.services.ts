import * as tournamentRegistrationRepository from "../repositories/tournamentRegistration.repository";
async function getAvailableTournamentsForTeam(teamId: number){
    try{
        const res = await tournamentRegistrationRepository.getAvailableTournamentsForTeam(teamId);
        return res;
    } catch(error){
        throw error;
    }
}

async function getTeamRegistrations(teamId: number){
    try{
        const res = await tournamentRegistrationRepository.getTeamRegistrations(teamId);
        return res;
    } catch(error){
        throw error;
    }
}

async function getRegistrationsByOrganizer(organizerId: number){
    try{
        return await tournamentRegistrationRepository.getRegistrationsByOrganizer(organizerId);
    } catch(error){
        throw error;
    }
}

async function updateRegistrationStatus(tournamentId: number, teamId: number, newStatus: string){
    try{
        return await tournamentRegistrationRepository.updateRegistrationStatus(tournamentId, teamId, newStatus);
    } catch(error){
        throw error;
    }
}

async function registerTeamForTournament(teamId: number, tournamentId: number){
    try{
        return await tournamentRegistrationRepository.registerTeamForTournament(teamId, tournamentId);
    } catch(error){
        throw error;
    }
}

export {
    getAvailableTournamentsForTeam,
    getTeamRegistrations,
    getRegistrationsByOrganizer,
    updateRegistrationStatus,
    registerTeamForTournament
};