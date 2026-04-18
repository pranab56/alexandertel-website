'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  remember: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      remember: false,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Register Data:', data);
    setIsSuccess(true);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#D1D5DB]/30 backdrop-blur-3xl">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#E5E7EB] via-[#F3F4F6] to-[#D1D5DB] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white/70 backdrop-blur-md rounded-lg p-8 md:p-5 shadow-2xl shadow-gray-200 border border-white/50 my-10"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="register-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-25 h-25">
                  <Image src="/icons/Logo.png" alt="Logo" width={1000} height={1000} className="object-contain w-full h-full" />
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-gray-500 text-sm font-normal">Create Account to manage your hub and services.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Full Name</Label>
                  <Input
                    {...register('fullName')}
                    placeholder="Enter your full name here..."
                    className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.fullName ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Email Address</Label>
                  <Input
                    {...register('email')}
                    placeholder="Enter your email address here..."
                    className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.email ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Create Password</Label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="• • • • • • • •"
                      className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.password ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="• • • • • • • •"
                      className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.confirmPassword ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
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

                <div className="flex items-center space-x-3 ml-1">
                  <Checkbox
                    id="remember"
                    {...register('remember')}
                    className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer">Remember Me</Label>
                </div>

                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-bold rounded-sm text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer">
                  Create Account
                </Button>
              </form>

              {/* Footer Link */}
              <p className="text-center text-gray-600 font-medium">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-xl shadow-green-500/10">
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Created!</h2>
              <p className="text-gray-500 max-w-xs mx-auto mb-10 text-lg">
                Your account has been successfully created. You can now log in.
              </p>
              <Link href="/login" className="w-full">
                <Button className="w-full h-14 bg-[#6366F1] hover:bg-[#5558E3] text-white font-bold rounded-xl text-lg transition-all cursor-pointer">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
