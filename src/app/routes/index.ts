import express from 'express';
import { UserRoutes } from '../Module/Users/user.route';
import { AuthRoutes } from '../Module/Auth/auth.routes';
import { ItemRoutes } from '../Module/Found/found.routes';
import { ClamRoutes } from '../Module/Clam/clam.routes';
import { ProfileRoutes } from '../Module/Profile/profile.routes';
import { CategoryRoutes } from '../Module/Found/category.routes';
import { LoginRoutes } from '../Module/Auth/login.routes';
import { RegistrationRoutes } from '../Module/Auth/registration.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },

  {
    path: '/login',
    route: LoginRoutes,
  },

  {
    path: '/register',
    route: RegistrationRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },

  {
    path: '/found-item-categories',
    route: CategoryRoutes,
  },

  {
    path: '/found-items',
    route: ItemRoutes,
  },

  {
    path: '/claims',
    route: ClamRoutes,
  },

  {
    path: '/my-profile',
    route: ProfileRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
