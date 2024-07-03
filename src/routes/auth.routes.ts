import { Router } from 'express';

const router = Router();

// test
router.get('/', (req, res) => {
  res.send('✅ API is running...');
});

export default router;
