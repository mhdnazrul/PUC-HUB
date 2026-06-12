import express from 'express';
import { googleLogin, googleCallback, authMe } from '../controllers/googleAuthController.js';

const router = express.Router();

router.get('/auth/google/login', googleLogin);
router.get('/auth/google/callback', googleCallback);
router.get('/auth/me', authMe);

export default router;
