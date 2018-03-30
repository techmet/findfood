import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import routes from './routes/routes';

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


const staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);

const router = express.Router();

// Adding the api
routes(router);

app.use(router);

app.use('/*', staticFiles);

app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}`)
});