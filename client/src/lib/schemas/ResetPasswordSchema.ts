import { requiredString } from '../util/util';
import { z } from 'zod';

export const resetPasswordSchema = z.object({
    newPassword: requiredString('New Password'),
    confirmPassword: requiredString('Confirm Password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password must match',
    path: ['confirmPassword'],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;