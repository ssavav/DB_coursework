import getMatches from "../repositories/match.repository";
import { MatchFilters } from "../types/match.types";

async function processMatches(filters: MatchFilters) {
    try{
        const res = await getMatches(filters);
        return res;
    } catch(error){
        return error;
    }
    
}

export default processMatches;