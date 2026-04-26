import pool from '../config/db';
// import {}

async function getOrganizerByID(id: number) {
    try {
        const organizerQuery = `
            select *
            from sport.organizer 
            where id = $1
        `;
        const organizerResult = await pool.query(organizerQuery, [id]);


        if (organizerResult.rows.length === 0) {
            return null;
        }

        const organizer = organizerResult.rows[0];

        // const tournamentsQuery = `
        //     select id, name, sport_type, start_date, end_date, status, prize_pool 
        //     from sport.tournament 
        //     where organizer_id = $1
        // `;
        // const tournamentsResult = await pool.query(tournamentsQuery, [id]);

        // organizer.tournaments = tournamentsResult.rows;

        return organizer;
    } catch (error) {
        throw error;
    }
}

export {
    getOrganizerByID
};