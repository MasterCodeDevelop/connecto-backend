import { Router } from 'express';
import authRoutes from './auth.routes';

// Create a root router
const router = Router();

/**
 * Mount all module routes under /api/
 * e.g., /api/auth
 */
router.use('/auth', authRoutes);

export default router;
