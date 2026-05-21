import * as tournamentRepository from "../repositories/tournament.repository";
import { TournamentFilters } from "../types/tournament.types";

async function getAllTournaments(filters: TournamentFilters){
    try{
        const res = await tournamentRepository.getAllTournaments(filters);
        return res;
    } catch(error){
        return error;
    }
}

async function getTournamentByID(id: number){
    try{
        const res = await tournamentRepository.getTournamentByID(id);
        return res;
    } catch(error){
        return error;
    }
}

async function getTournamentsByOrganizerID(organizerID: number){
    try{
        return await tournamentRepository.getTournamentsByOrganizerID(organizerID);
    } catch(err){
        throw err;
    }
}

async function createTournament(organizerId: number, data: any){
    try{
        const res = await tournamentRepository.createTournament(organizerId, data);
        return res;
    } catch(error){
        throw error;
    }
}

async function updateTournament(tournamentId: number, organizerId: number, data: any){
    try{
        const res = await tournamentRepository.updateTournament(tournamentId, organizerId, data);
        return res;
    } catch(error){
        throw error;
    }
}

export {
    getTournamentByID,
    getAllTournaments,
    getTournamentsByOrganizerID,
    createTournament,
    updateTournament
};