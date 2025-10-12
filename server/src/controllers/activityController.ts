import { Request, Response } from 'express';
import { createActivity, listActivities, addQuestion } from '../services/activityService';

// Creates a new activity. Only teachers may call this; middleware should
// enforce the role. Expects title and optional description in the body.
export async function create(req: Request, res: Response) {
  const { title, description } = req.body;
  const teacherId = req.user!.id;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const activity = await createActivity(teacherId, title, description || null);
  return res.status(201).json(activity);
}

// Lists all activities. Includes associated questions. Accessible by all
// authenticated users (teachers and students).
export async function list(req: Request, res: Response) {
  const activities = await listActivities();
  return res.json(activities);
}

// Adds a question to an existing activity. Only teachers may call this.
export async function add(req: Request, res: Response) {
  const { activityId, text, options } = req.body;
  if (!activityId || !text || !options) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const question = await addQuestion(activityId, text, options);
  return res.status(201).json(question);
}