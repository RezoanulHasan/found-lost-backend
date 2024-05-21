import prisma from '../src/shared/prisma';
import * as bcrypt from 'bcrypt';
import config from '../src/config/index';
import { UserRole } from '@prisma/client';

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SuperAdmin,
      },
    });

    if (isExistSuperAdmin) {
      console.log('Super admin already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.super_admin_password as string,
      12,
    );

    const superAdminData = await prisma.user.create({
      data: {
        name: config.super_admin_username as string,
        email: 'rezoanulhasan96@gmail.com',
        password: hashedPassword,
        phoneNumber: '01734639066',
        userImage: 'https://i.ibb.co/K0y7s31/rezoanulhasan.jpg',
        role: UserRole.SuperAdmin,

        profile: {
          create: {
            bio: 'Software Engineer',
            age: '25',
          },
        },
      },
    });

    console.log('Super Admin Created Successfully!', superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
