import express from 'express';
import {
	getFriends,
	addRelationship,
	removeRelationship,
} from '../controllers/relationship.js';

const router = express.Router();

router.get('/friends', getFriends);
router.post('/', addRelationship);
router.delete('/:userId', removeRelationship);

export default router;
