import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { AppError } from '../middleware/validate';

// Whitelisted fields for create / update
const ALLOWED_FIELDS = ['name', 'email', 'role', 'phone', 'status'] as const;

function sanitizeBody(body: Record<string, any>) {
  const sanitized: Record<string, any> = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      sanitized[field] = body[field];
    }
  }
  return sanitized;
}

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search } = req.query;
    let query = {};

    if (typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query = {
        $or: [{ name: searchRegex }, { email: searchRegex }],
      };
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [result] = await User.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { status: 'active' } }, { $count: 'count' }],
          inactive: [{ $match: { status: 'inactive' } }, { $count: 'count' }],
          last7Days: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const total = result.total[0]?.count || 0;
    const active = result.active[0]?.count || 0;
    const inactive = result.inactive[0]?.count || 0;
    const last7Days = result.last7Days[0]?.count || 0;

    res.status(200).json({
      data: {
        total,
        active,
        inactive,
        last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid user ID format', 400, 'INVALID_ID');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cleanData = sanitizeBody(req.body);
    const user = new User(cleanData);
    await user.save();

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid user ID format', 400, 'INVALID_ID');
    }

    const cleanData = sanitizeBody(req.body);

    const updatedUser = await User.findByIdAndUpdate(id, cleanData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid user ID format', 400, 'INVALID_ID');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}
