import express, { Request, Response} from 'express'
import tournamentRoutes from './routes/tournament.routes';
import matchRoutes from './routes/match.routes';


const app = express();
const port = process.env.PORT;

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/match', matchRoutes);

app.listen(port, ()=>{
    console.log("все работает!");
})


// main();