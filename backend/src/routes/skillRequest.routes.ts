import { Router } from 'express';
import { SkillRequestController } from '../controllers/SkillRequestController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const ctrl = new SkillRequestController();

router.use(authenticate);

router.post('/', ctrl.create);
router.get('/sent', ctrl.getSent);
router.get('/received', ctrl.getReceived);
router.get('/pending', ctrl.getPending);
router.patch('/:id/accept', ctrl.accept);
router.patch('/:id/reject', ctrl.reject);

export default router;
