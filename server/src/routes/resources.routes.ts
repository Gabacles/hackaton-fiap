import { Router } from 'express';
import * as controller from '../controllers/resourceController';
import { authenticate, requireTeacher } from '../middlewares/auth';

const router = Router();

// All routes under /api/resources require authentication
router.use(authenticate);

// GET /api/resources -> list resources
router.get('/', controller.list);

// POST /api/resources -> create new resource (teachers only)
router.post('/', requireTeacher, controller.create);

export default router;