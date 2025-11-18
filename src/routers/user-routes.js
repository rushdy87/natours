import { Router } from 'express';

import userControllers from '../controllers/user-controllers.js';
import AuthControllers from '../controllers/auth-controllers.js';
import {
  protect,
  restrictTo,
} from '../middlewares/authorization-middlewares.js';

const router = Router();

router.post('/signup', AuthControllers.signup);
router.post('/login', AuthControllers.login);
router.post('/forgot-password', AuthControllers.forgotPassword);

router.get('/me', protect, userControllers.getMe, userControllers.getUserById);

router.patch('/reset-password/:token', AuthControllers.resetPassword);
router.patch('/update-my-password', protect, AuthControllers.updatePassword);
router.patch('/update-me', protect, userControllers.updateMe);

router.delete('/delete-me', protect, userControllers.deleteMe);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUserById)
  .patch(userControllers.updateUser)
  .delete(protect, restrictTo('admin'), userControllers.deleteUser);

export default router;
