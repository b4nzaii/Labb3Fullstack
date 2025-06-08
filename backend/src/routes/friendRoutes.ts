import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
    sendFriendRequest,
    getFriendRequests,
    respondToRequest,
    getFriends
} from '../controllers/friendController';

const router = express.Router();

router.post('/request/:username', authenticate, sendFriendRequest);
router.get('/requests', authenticate, getFriendRequests);
router.get("/list", authenticate, getFriends);
router.post('/requests/:id/respond', authenticate, respondToRequest);

export default router;
