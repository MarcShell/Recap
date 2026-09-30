import express from 'express';
import { getUser, getUsers } from '../controllers/user.js';

const router = express.Router();

router.get('/find/:userId', getUser);

router.get('/', getUsers);

export default router;
