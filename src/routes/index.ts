import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import filesRoutes from './files.routes';
import postsRoutes from './posts.routes';
import { applyProtectedRoute } from '@/utils/applyProtectedRoute';

const router = Router();

// ========== Public Routes ==========
router.use('/auth', authRoutes);

// ========== Protected Routes ==========
applyProtectedRoute(router, '/users', usersRoutes);
applyProtectedRoute(router, '/posts', postsRoutes);
applyProtectedRoute(router, '/files', filesRoutes, { allowUrlToken: true });

export default router;
