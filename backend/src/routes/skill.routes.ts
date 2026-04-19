import { Router } from 'express';
import { SkillController } from '../controllers/SkillController';
import { UserRole } from '../entities/User';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
const ctrl = new SkillController();

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Protected
router.use(authenticate);
router.post('/', ctrl.create);
router.get('/my/skills', ctrl.getMySkills);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
router.patch('/:id/moderate', requireRole(UserRole.ADMIN), ctrl.moderate);

export default router;
