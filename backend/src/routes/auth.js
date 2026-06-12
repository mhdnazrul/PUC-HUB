import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { cleanInput, checkValidation } from '../utils/sanitizer.js';

const router = express.Router();

router.post('/auth/register', cleanInput(['student_id', 'username', 'password']), checkValidation, register);
router.post('/auth/login', cleanInput(['student_id', 'password']), checkValidation, login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

export default router;
