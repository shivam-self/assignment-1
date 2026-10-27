import { Router } from 'express';
import {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { validateBody } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validators/userSchemas';

const router = Router();

// 1. Specific routes first! Must register /stats BEFORE /:id to prevent "stats" from being parsed as an ObjectId
router.get('/stats', getUserStats);

// 2. Collection routes
router.get('/', getUsers);
router.post('/', validateBody(createUserSchema), createUser);

// 3. Parameterized routes
router.get('/:id', getUserById);
router.put('/:id', validateBody(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
