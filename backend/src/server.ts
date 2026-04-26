import express, { Request, Response} from 'express'
import cors from 'cors'
import tournamentRoutes from './routes/tournament.routes';
import matchRoutes from './routes/match.routes';
import organizerRoutes from './routes/organizer.routes';


const app = express();
const port = process.env.PORT;

app.use(cors());

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/match', matchRoutes);

app.listen(port, ()=>{
    console.log("все работает!");
})


// main();