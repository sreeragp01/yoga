import { Router } from 'express';
import { store } from '../db/store.js';

export const teachersRouter = Router();

teachersRouter.get('/', (req, res) => {
  const teacher = store.getTeacher();
  res.json({ teachers: [teacher] });
});

teachersRouter.get('/:id/schedule', (req, res) => {
  const schedule = store.getSchedule();
  res.json({ schedule });
});
