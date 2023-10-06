import 'dotenv/config';
import 'express-async-errors';
import express from 'express';

import * as usersController from './controllers/users.controller';
import responseError from './middleware/response-error';

const app = express();

app.use(express.json());

app.post('/users', usersController.create);

app.use(responseError);

app.listen(3000, () => console.log('🚀'))