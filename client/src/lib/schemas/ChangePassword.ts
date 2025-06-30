import { requiredString } from '../util/util';
import { z } from 'zod';

export const changePasswordSchema = z.object({
    currentPassword: requiredString('Current Password'),
    newPassword: requiredString('New Password'),
    confirmPassword: requiredString('Confirm Password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password must match',
    path: ['confirmPassword'],
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;