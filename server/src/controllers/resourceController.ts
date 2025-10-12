import { Request, Response } from 'express';
import { createResource, listResources } from '../services/resourceService';

// Creates a new resource (link or document) by a teacher.
export async function create(req: Request, res: Response) {
  const { title, url } = req.body;
  const teacherId = req.user!.id;
  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }
  const resource = await createResource(teacherId, title, url);
  return res.status(201).json(resource);
}

// Lists all resources. Accessible by all authenticated users.
export async function list(req: Request, res: Response) {
  const resources = await listResources();
  return res.json(resources);
}