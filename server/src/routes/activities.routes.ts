import { Router } from 'express';
import * as controller from '../controllers/activityController';
import { authenticate, requireTeacher } from '../middlewares/auth';

const router = Router();

// All routes under /api/activities require authentication
router.use(authenticate);

// GET /api/activities -> list all activities
router.get('/', controller.list);

// POST /api/activities -> create new activity (teachers only)
router.post('/', requireTeacher, controller.create);

// POST /api/activities/question -> add question to activity (teachers only)
router.post('/question', requireTeacher, controller.add);

export default router;