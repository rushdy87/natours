import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user-controllers.js';
import AuthControllers from '../controllers/auth-controllers.js';

const router = Router();

router.post('/signup', AuthControllers.signup);
router.post('/login', AuthControllers.login);
router.post('/forgot-password', AuthControllers.forgotPassword);
router.patch('/reset-password/:token', AuthControllers.resetPassword);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
