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
router.patch('/reset-password/:token', AuthControllers.resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.patch('/update-my-password', AuthControllers.updatePassword);
router.get('/me', userControllers.getMe, userControllers.getUserById);
router.patch('/update-me', userControllers.updateMe);
router.delete('/delete-me', userControllers.deleteMe);

router.use(restrictTo('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUserById)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default router;
