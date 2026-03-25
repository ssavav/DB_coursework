import processMatches from '../services/match.services'
import { Request, Response } from 'express'
import { MatchFilters, Location } from '../types/match.types'


async function getMatcheshandler(req: Request, res: Response){
    try {
        const location: Location = {
            city: req.query.loc_city ? String(req.query.loc_city) : undefined,
            name: req.query.loc_name ? String(req.query.loc_name) : undefined,
        }
        const filters: MatchFilters={
            location: location,
            status: req.query.status ? String(req.query.status) : undefined,
            date: req.query.date ? String(req.query.date) : undefined,
        }
        // console.log(`${location.city}`)

        const result = await processMatches(filters);
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({error: "internal server error"});
    }
}

export default getMatcheshandler; 