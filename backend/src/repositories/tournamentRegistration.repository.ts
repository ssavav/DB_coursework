import pool from '../config/db'

async function getAvailableTournamentsForTeam(teamId: number) {
    try {
        const query: string = `
            select t.*, o.company_name as organizer_company_name
            from sport.tournament t
            left join sport.organizer o on t.organizer_id = o.id
            where t.status = 'registration'
              and t.id not in (
                  select tournament_id
                  from sport.tournament_registration
                  where team_id = $1
              )
        `;
        const result = await pool.query(query, [teamId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function getTeamRegistrations(teamId: number) {
    try {
        const query: string = `
            select 
                t.id as tournament_id,
                t.name as tournament_name,
                t.sport_type,
                t.start_date,
                t.end_date,
                t.organizer_id,
                tr.registration_date,
                tr.status_registration,
                o.company_name as organizer_company_name
            from sport.tournament_registration tr
            join sport.tournament t on tr.tournament_id = t.id
            left join sport.organizer o on t.organizer_id = o.id
            where tr.team_id = $1
            order by tr.registration_date desc;
        `;
        const result = await pool.query(query, [teamId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}
async function getRegistrationsByOrganizer(organizerId: number) {
    try {
        const query = `
            select 
                tr.tournament_id,
                t.name as tournament_name,
                tr.team_id,
                tm.name as team_name,
                tr.registration_date,
                tr.status_registration
            from sport.tournament_registration tr
            join sport.tournament t on tr.tournament_id = t.id
            join sport.team tm on tr.team_id = tm.id
            where t.organizer_id = $1
            order by tr.registration_date desc;
        `;
        const result = await pool.query(query, [organizerId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function updateRegistrationStatus(tournamentId: number, teamId: number, newStatus: string) {
    try {
        const query = `
            update sport.tournament_registration
            set status_registration = $1
            where tournament_id = $2 and team_id = $3 and status_registration = 'pending'
            returning *;
        `;
        const result = await pool.query(query, [newStatus, tournamentId, teamId]);
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}

async function registerTeamForTournament(teamId: number, tournamentId: number) {
    try {
        const query = `call sport.register_team($1, $2)`;
        await pool.query(query, [teamId, tournamentId]);
        return true; 
    } catch (error) {
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