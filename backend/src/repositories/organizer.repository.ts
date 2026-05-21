import pool from '../config/db';

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

async function createOrganizerProfile(userId: number, companyName: string, email: string, phone: string) {
    const query = `insert into sport.organizer (user_id, company_name, email, phone) 
        values ($1, $2, $3, $4)`;
    await pool.query(query, [userId, companyName, email, phone]);
}

async function getOrganizerByUserId(userId: number) {
    try {
        const query = `select * from sport.organizer where user_id = $1`;
        const res = await pool.query(query, [userId]);
        return res.rows[0] || null;
    } catch(err) {
        throw err;
    }
}

export {
    getOrganizerByID,
    createOrganizerProfile,
    getOrganizerByUserId,
};