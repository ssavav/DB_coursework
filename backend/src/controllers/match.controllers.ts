import { processMatches,
        processMatchById,
        processMatchHistory,
        processMatchesByTournamentId,
        createMatch,
        getApprovedTeamsForTournamentById,
        processUpdateMatch, } from '../services/match.services';
import { Request, Response } from 'express';
import { MatchFilters, Location } from '../types/match.types';

async function getMatchesHandler(req: Request, res: Response) {
    try {
        const location: Location = {
            city: req.query.loc_city ? String(req.query.loc_city) : undefined,
            name: req.query.loc_name ? String(req.query.loc_name) : undefined,
        }
        const filters: MatchFilters = {
            location: location,
            status: req.query.status ? String(req.query.status) : undefined,
            date: req.query.date ? String(req.query.date) : undefined,
            teamName: req.query.team_name ? String(req.query.team_name) : undefined,
        }

        const result = await processMatches(filters);
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({error: "internal server error"});
    }
}

async function getMatchByIdHandler(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid match ID format" });
        }

        const result = await processMatchById(id);
        if (!result) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: "internal server error"});
    }
}

async function getMatchHistoryHandler(req: Request, res: Response) {
    try {
        const team1Id = Number(req.params.team1Id);
        const team2Id = Number(req.params.team2Id);

        if (isNaN(team1Id) || isNaN(team2Id)) {
            return res.status(400).json({ error: "Invalid team IDs format" });
        }

        const result = await processMatchHistory(team1Id, team2Id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: "internal server error"});
    }
}

async function getMatchesByTournamentIdHandler(req: Request, res: Response) {
    try {
        const tournamentId = Number(req.params.tournamentId);
        if (isNaN(tournamentId)) return res.status(400).json({ error: "Invalid tournament ID" });
        
        const result = await processMatchesByTournamentId(tournamentId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: "internal server error"});
    }
}

async function getApprovedTeamsHandler(req: Request, res: Response) {
    try {
        const tournamentId = Number(req.params.tournamentId);
        const teams = await getApprovedTeamsForTournamentById(tournamentId);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}

async function createMatchHandler(req: Request, res: Response) {
    try {
        const matchId = await createMatch(req.body); 
        res.status(201).json({ id: matchId });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}

async function updateMatchHandler(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid match ID format" });
        }
        await processUpdateMatch(id, req.body);
        res.status(200).json({ message: "Match updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}

export { getMatchesHandler,
        getMatchByIdHandler,
        getMatchHistoryHandler,
        getMatchesByTournamentIdHandler,
        getApprovedTeamsHandler,
        createMatchHandler,
        updateMatchHandler, };