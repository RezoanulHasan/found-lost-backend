import dotenv from 'dotenv';
import path from 'path';

//dotenv.config({ path: path.join(process.cwd(), '.env') });
const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_secret: process.env.REFRESH_SECRET,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
    passwordResetTokenExpirationTime: process.env.PASS_RESET_EXPIRATION_TIME,
  },
  reset_link: process.env.RESET_LINK,
  email: process.env.EMAIL,
  app_pass: process.env.APP_PASS,
  bycrypt_salt_rounds: process.env.SALT_ROUND,

  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  super_admin_username: process.env.SUPER_ADMIN_USERNAME,
};
