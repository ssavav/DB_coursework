import { getMatches,
        getMatchById,
        getMatchHistory,
        getMatchesByTournamentId,
        createMatchTransaction,
        getApprovedTeamsForTournament,
        updateMatchTransaction, } from "../repositories/match.repository";
import { MatchFilters } from "../types/match.types";

async function processMatches(filters: MatchFilters) {
    try {
        return await getMatches(filters);
    } catch(error) {
        throw error;
    }
}

async function processMatchById(id: number) {
    try {
        return await getMatchById(id);
    } catch(error) {
        throw error;
    }
}

async function processMatchHistory(team1_id: number, team2_id: number) {
    try {
        return await getMatchHistory(team1_id, team2_id);
    } catch(error) {
        throw error;
    }
}

async function processMatchesByTournamentId(tournamentId: number) {
    try {
        return await getMatchesByTournamentId(tournamentId);
    } catch(error) {
        throw error;
    }
}

async function createMatch(data: any) {
    try {
        return await createMatchTransaction(data);
    } catch(error) {
        throw error;
    }
}
async function getApprovedTeamsForTournamentById(tournamentId: number) {
    try {
        return await getApprovedTeamsForTournament(tournamentId);
    } catch(error) {
        throw error;
    }
}

async function processUpdateMatch(matchId: number, data: any) {
    try {
        return await updateMatchTransaction(matchId, data);
    } catch(error) {
        throw error;
    }
}

export { processMatches,
        processMatchById,
        processMatchHistory,
        processMatchesByTournamentId,
        createMatch,
        getApprovedTeamsForTournamentById,
        processUpdateMatch };