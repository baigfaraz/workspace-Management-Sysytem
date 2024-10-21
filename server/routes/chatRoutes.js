import express from 'express';
import {
    sendMessage, getChatMessages 
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sendMessage', protect, sendMessage);
router.post('/getChatMessages', protect, getChatMessages);

export default router;