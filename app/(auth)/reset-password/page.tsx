'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPasswordMutation } from '@/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error('Reset token missing. Please check your email link.');
      // router.push('/login'); // Optional: redirect if no token
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      const payload = {
        token: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      const res = await resetPassword(payload).unwrap();
      toast.success(res.message || 'Password reset successful!');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reset password. Token might be expired.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#D1D5DB]/30 backdrop-blur-3xl p-4 md:p-6">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#E5E7EB] via-[#F3F4F6] to-[#D1D5DB] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white/70 backdrop-blur-md rounded-lg p-8 md:p-10 border border-white/50 shadow-2xl shadow-gray-200"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <Lock size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-500 text-sm font-normal">
                  Create a new strong password for your account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">New Password</Label>
                  <div className="relative">
                    <Input
                      {...register('newPassword')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className={`h-12 bg-gray-200/50 border-none rounded-xl px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.newPassword ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className={`h-12 bg-gray-200/50 border-none rounded-xl px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.confirmPassword ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading || !token} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    Back to Login
                  </Link>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-10"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-xl shadow-green-500/10">
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Success!</h2>
              <p className="text-gray-500 max-w-xs mx-auto mb-10 text-lg">
                Your password has been successfully reset. You can now login with your new password.
              </p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3 }}
                  className="h-full bg-green-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
