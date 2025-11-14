import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user-controllers.js';
import AuthControllers from '../controllers/auth-controllers.js';
import { protect } from '../middlewares/authorization-middlewares.js';

const router = Router();

router.post('/signup', AuthControllers.signup);
router.post('/login', AuthControllers.login);
router.post('/forgot-password', AuthControllers.forgotPassword);

router.patch('/reset-password/:token', AuthControllers.resetPassword);
router.patch('/update-my-password', protect, AuthControllers.updatePassword);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
