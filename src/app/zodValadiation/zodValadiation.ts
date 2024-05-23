import { z } from 'zod';

const UserRole = z.enum(['USER', 'ADMIN']);

const User = z.object({
  id: z.string().optional(),

  name: z.string({
    required_error: 'Name is required',
  }),

  email: z.string({
    required_error: 'Email is required',
  }),

  password: z.string({
    required_error: 'Password is required',
  }),

  userImage: z.string({
    required_error: ' Image is required',
  }),
  phoneNumber: z.string({
    required_error: 'phoneNumber',
  }),
  role: UserRole.optional().default('USER'),
  status: z.boolean().optional(),
  needPasswordChange: z.boolean().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  foundItems: z.array(z.unknown()).optional(), // Assuming FoundItem type is not defined here
  claims: z.array(z.unknown()).optional(), // Assuming Claim type is not defined here

  profile: z
    .object({
      id: z.string().optional(),
      userId: z.string().optional(),
      bio: z.string().optional(),
      age: z.string().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })
    .optional(),
});

// Extract the schema for UserProfile
const UserProfile = z
  .object({
    profile: z.object({
      id: z.string().optional(),
      userId: z.string().optional(),
      bio: z.string().optional(),
      age: z.string().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }),
  })
  .optional();
export { User, UserProfile };
