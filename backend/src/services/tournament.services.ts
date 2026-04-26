import * as tournamentRepository from "../repositories/tournament.repository";
import { TournamentFilters } from "../types/tournament.types";
// тут бизнес логика какая то как то обрабатываем полученные рещультаты

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

export {
    getTournamentByID,
    getAllTournaments
};