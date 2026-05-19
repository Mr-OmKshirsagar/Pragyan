// src/services/auth.ts

import { prisma } from '@/lib/prisma';
import { MongoClient, ObjectId } from 'mongodb';
import { hashPassword, comparePasswords } from '@/utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '@/utils/errors';
import { RegisterInput, LoginInput, ProfileUpdateInput } from '@/validators/auth';

const userProfileSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  age: true,
  location: true,
  phone: true,
  linkedin: true,
  skills: true,
  interests: true,
  preferences: true,
  experience: true,
  experienceType: true,
  education: true,
  educationEntries: true,
  skillLevel: true,
  xp: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AuthService {
  private async upsertCurrentUserSnapshot(user: {
    _id: ObjectId;
    email: string;
    fullName: string;
    role: string;
    age: number | null;
    location: string | null;
    phone: string | null;
    linkedin: string | null;
    skills: string[];
    interests: string[];
    preferences: string[];
    experience: string | null;
    experienceType: string | null;
    education: string | null;
    educationEntries: unknown;
    skillLevel: string | null;
    xp: number;
    streak?: number;
    createdAt: Date;
    updatedAt: Date;
  }, active = true, lastLoginAt?: Date) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required');
    }

    const client = new MongoClient(process.env.DATABASE_URL);

    try {
      await client.connect();
      const db = client.db('Pragyan');
      const currentUsersCollection = db.collection('CurrentUser');

      await currentUsersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            age: user.age,
            location: user.location,
            phone: user.phone,
            linkedin: user.linkedin,
            skills: user.skills,
            interests: user.interests,
            preferences: user.preferences,
            experience: user.experience,
            experienceType: user.experienceType,
            education: user.education,
            educationEntries: user.educationEntries,
            skillLevel: user.skillLevel,
            xp: user.xp,
            streak: user.streak ?? 0,
            active,
            lastLoginAt: lastLoginAt ?? null,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    } finally {
      await client.close();
    }
  }

  async register(input: RegisterInput) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await hashPassword(input.password);
    const now = new Date();
    const userId = new ObjectId();

    // Use MongoDB client directly to avoid Prisma transaction requirement
    try {
      const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/Pragyan';
      const client = new MongoClient(mongoUrl);
      await client.connect();

      const db = client.db('Pragyan');
      const usersCollection = db.collection('User');

      // Create user document
      const userDoc = {
        _id: userId,
        email: input.email,
        fullName: input.fullName,
        password: hashedPassword,
        role: 'USER',
        age: null,
        location: null,
        phone: null,
        linkedin: null,
        skills: [],
        interests: [],
        preferences: [],
        experience: null,
        experienceType: 'fresher',
        education: null,
        educationEntries: [],
        skillLevel: null,
        xp: 0,
        streak: 0,
        createdAt: now,
        updatedAt: now,
      };

      await usersCollection.insertOne(userDoc as any);

      // Create refresh token
      const refreshTokensCollection = db.collection('RefreshToken');
      const refreshTokenStr = generateRefreshToken(userId.toString());
      await refreshTokensCollection.insertOne({
        token: refreshTokenStr,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: now,
      });

      await this.upsertCurrentUserSnapshot(userDoc, true, now);

      await client.close();

      // Format response
      const user = {
        id: userId.toString(),
        fullName: input.fullName,
        email: input.email,
        role: 'USER',
        age: null,
        location: null,
        phone: null,
        linkedin: null,
        skills: [],
        interests: [],
        preferences: [],
        experience: null,
        education: null,
        educationEntries: [],
        skillLevel: null,
        xp: 0,
        createdAt: now,
        updatedAt: now,
      };

      const accessToken = generateAccessToken({
        id: userId.toString(),
        email: input.email,
        role: 'USER',
      });

      return {
        user,
        accessToken,
        refreshToken: refreshTokenStr,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictError('Email already registered');
      }
      throw error;
    }
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await comparePasswords(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    const refreshToken = generateRefreshToken(user.id);

    // Use MongoDB driver directly to avoid transaction requirement
    try {
      const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/Pragyan';
      const client = new MongoClient(mongoUrl);
      await client.connect();

      const db = client.db('Pragyan');
      const refreshTokensCollection = db.collection('RefreshToken');
      
      await refreshTokensCollection.insertOne({
        token: refreshToken,
        userId: new ObjectId(user.id),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      });

      await this.upsertCurrentUserSnapshot(
        {
          _id: new ObjectId(user.id),
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          age: user.age ?? null,
          location: user.location ?? null,
          phone: user.phone ?? null,
          linkedin: user.linkedin ?? null,
          skills: Array.isArray(user.skills) ? user.skills : [],
          interests: Array.isArray(user.interests) ? user.interests : [],
          preferences: Array.isArray(user.preferences) ? user.preferences : [],
          experience: user.experience ?? null,
          experienceType: user.experienceType ?? null,
          education: user.education ?? null,
          educationEntries: user.educationEntries ?? [],
          skillLevel: user.skillLevel ?? null,
          xp: user.xp ?? 0,
          streak: user.streak ?? 0,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: new Date(),
        },
        true,
        new Date()
      );

      await client.close();
    } catch (error: any) {
      console.error('Failed to save refresh token:', error);
      throw error;
    }

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async updateUserProfile(userId: string, input: ProfileUpdateInput) {
    const data: ProfileUpdateInput = {
      ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
      ...(input.age !== undefined ? { age: input.age } : {}),
      ...(input.location !== undefined ? { location: input.location } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.linkedin !== undefined ? { linkedin: input.linkedin } : {}),
      ...(input.skills !== undefined ? { skills: input.skills } : {}),
      ...(input.interests !== undefined ? { interests: input.interests } : {}),
      ...(input.preferences !== undefined ? { preferences: input.preferences } : {}),
      ...(input.educationEntries !== undefined ? { educationEntries: input.educationEntries } : {}),
      ...(input.experience !== undefined ? { experience: input.experience } : {}),
      ...(input.experienceType !== undefined ? { experienceType: input.experienceType } : {}),
      ...(input.education !== undefined ? { education: input.education } : {}),
      ...(input.skillLevel !== undefined ? { skillLevel: input.skillLevel } : {}),
    };

    if (Object.keys(data).length === 0) {
      throw new BadRequestError('At least one profile field is required');
    }

    const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/Pragyan';
    const client = new MongoClient(mongoUrl);

    try {
      await client.connect();

      const db = client.db('Pragyan');
      const usersCollection = db.collection('User');
      const objectId = new ObjectId(userId);

      const updateDoc: Record<string, unknown> = {
        ...data,
        updatedAt: new Date(),
      };

      await usersCollection.updateOne(
        { _id: objectId },
        { $set: updateDoc },
        { upsert: false }
      );

      const user = await usersCollection.findOne({ _id: objectId });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      await this.upsertCurrentUserSnapshot(user as any, true, new Date());

      return {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        age: user.age,
        location: user.location,
        phone: user.phone,
        linkedin: user.linkedin,
        skills: Array.isArray(user.skills) ? user.skills : [],
        interests: Array.isArray(user.interests) ? user.interests : [],
        preferences: Array.isArray(user.preferences) ? user.preferences : [],
        experience: user.experience,
        experienceType: user.experienceType,
        education: user.education,
        skillLevel: user.skillLevel,
        xp: user.xp,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } finally {
      await client.close();
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    return {
      accessToken: newAccessToken,
    };
  }

  async logout(refreshToken: string) {
    // Use MongoDB client directly to avoid transaction requirement
    const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/Pragyan';
    const client = new MongoClient(mongoUrl);
    try {
      await client.connect();
      const db = client.db('Pragyan');
      const refreshTokenCollection = db.collection('RefreshToken');
      const currentUsersCollection = db.collection('CurrentUser');

      const tokenPayload = verifyRefreshToken(refreshToken);
      
      if (tokenPayload?.id) {
        await currentUsersCollection.updateOne(
          { _id: new ObjectId(tokenPayload.id) },
          {
            $set: {
              active: false,
              updatedAt: new Date(),
            },
          }
        );
      }

      await refreshTokenCollection.deleteMany({
        token: refreshToken,
      });
    } finally {
      await client.close();
    }
  }
}

export const authService = new AuthService();
