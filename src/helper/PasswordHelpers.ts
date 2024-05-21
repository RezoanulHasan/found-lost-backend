/* eslint-disable no-undef */
import * as bcrypt from 'bcrypt';

export const hashedPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  try {
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const errorMessages = {
  usernameExists: 'Username is already in use.',
  emailExists: 'This email is already in use.',
  passwordLength: 'Password must be at least 6 characters long.',
  passwordUppercase: 'Password must contain at least one uppercase letter.',
  passwordLowercase: 'Password must contain at least one lowercase letter.',
  usernameUppercase: 'Username must start with an uppercase letter.',
};
