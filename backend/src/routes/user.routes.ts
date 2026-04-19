import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRole } from '../entities/User';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
const ctrl = new UserController();

router.use(authenticate);

router.get('/me', ctrl.getMe);
router.put('/me', ctrl.updateProfile);
router.get('/mentors', ctrl.getMentors);
router.get('/', requireRole(UserRole.admin), ctrl.getAll);
router.patch('/:id/block', requireRole(UserRole.admin), ctrl.blockUser);
router.patch('/:id/unblock', requireRole(UserRole.admin), ctrl.unblockUser);

export default router;
