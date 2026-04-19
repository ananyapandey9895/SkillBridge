import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const ctrl = new SessionController();

router.use(authenticate);

router.get('/my', ctrl.getMySessions);
router.get('/:id', ctrl.getById);
router.patch('/:id/start', ctrl.start);
router.patch('/:id/complete', ctrl.complete);
router.post('/:id/progress', ctrl.addProgress);
router.post('/:id/feedback', ctrl.addFeedback);

export default router;
