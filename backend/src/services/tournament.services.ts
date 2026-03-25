import getAllTournaments from "../repositories/tournament.repository";
import { TournamentFilters } from "../types/tournament.types";
// тут бизнес логика какая то как то обрабатываем полученные рещультаты

async function getTournaments(filters: TournamentFilters){
    try{
        const res = await getAllTournaments(filters);
        return res;
    } catch(error){
        return error;
    }
}

export default getTournaments;