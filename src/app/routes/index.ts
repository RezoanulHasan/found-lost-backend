import express from 'express';
import { UserRoutes } from '../Module/Users/user.route';
import { AuthRoutes } from '../Module/Auth/auth.routes';
import { ItemRoutes } from '../Module/Found/found.routes';
import { ClamRoutes } from '../Module/Clam/clam.routes';
import { ProfileRoutes } from '../Module/Profile/profile.routes';

import { LoginRoutes } from '../Module/Auth/login.routes';
import { RegistrationRoutes } from '../Module/Auth/registration.routes';
import { LostRoutes } from '../Module/LostIteams/lost.routes';
import { LostItemByUserRoutes } from '../Module/LostIteams/userlost.route';
import { FoundItemByUserRoutes } from '../Module/Found/userfound.route';
import { ClamItemByUserRoutes } from '../Module/Clam/userclam.route';
import { CountRoutes } from '../Module/ActivityMonitoring/count.routes';

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
    path: '/lost-items',
    route: LostRoutes,
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

  {
    path: '/my',
    route: ClamItemByUserRoutes,
  },

  {
    path: '/my',
    route: FoundItemByUserRoutes,
  },

  {
    path: '/my',
    route: LostItemByUserRoutes,
  },

  {
    path: '/counts',
    route: CountRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
