import express, { Request, Response} from 'express'
import cors from 'cors'
import tournamentRoutes from './routes/tournament.routes';
import matchRoutes from './routes/match.routes';
import organizerRoutes from './routes/organizer.routes';
import authRoutes from './routes/auth.routes';
import teamRoutes from './routes/team.routes';
import tournamentRegistrationRoutes from './routes/tournamentRegistration.routes';


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/auth/', authRoutes)
app.use('/api/team/', teamRoutes)
app.use('/api/tournament-registration', tournamentRegistrationRoutes)

app.listen(port, ()=>{
    console.log("все работает!");
})


// main();