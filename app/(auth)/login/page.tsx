'use client';

import { setAuthCookie } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login Data:', data);
    try {
      const res = await login(data).unwrap();
      toast.success(res.message);
      await setAuthCookie(res.data.accessToken);
      setIsSuccess(true);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#D1D5DB]/30 backdrop-blur-3xl p-4 md:p-6">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#E5E7EB] via-[#F3F4F6] to-[#D1D5DB] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white/70 backdrop-blur-md rounded-lg p-8 md:p-5 border border-white/50"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="flex flex-col items-center">
                <div className="w-25 h-25">
                  <Image src="/icons/Logo.png" alt="Logo" width={1000} height={1000} className="object-contain w-full h-full" />
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-2">Welcome back!</h1>
                <p className="text-gray-500 text-sm font-normal">Sign in to access your premium property dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Email Address</Label>
                  <div className="relative">
                    <Input
                      {...register('email')}
                      placeholder="Enter your email address here..."
                      className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.email ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Password</Label>
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
                  <div className="flex justify-end pt-1">
                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline transition-all">Forget Password?</Link>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-sm text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer">
                  Login
                </Button>
              </form>

              {/* Social Login */}
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-4 text-gray-400 font-medium tracking-widest">Instant Login</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 bg-gray-200/50 border-none rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all cursor-pointer">
                    <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" />
                    Google
                  </Button>
                  <Button variant="outline" className="h-12 bg-gray-200/50 border-none rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all cursor-pointer">
                    <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" width={20} height={20} alt="Facebook" />
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Footer Link */}
              <p className="text-center text-gray-600 font-normal text-sm">
                Don&apos;t have any account? <Link href="/register" className="text-[#6366F1] font-bold hover:underline">Register Now</Link>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Successful</h2>
              <p className="text-gray-500 max-w-xs mx-auto mb-10 text-lg">
                Welcome back! You have been successfully logged in.
              </p>
              <Link href="/" className="w-full">
                <Button className="w-full h-14 bg-[#6366F1] hover:bg-[#5558E3] text-white font-bold rounded-xl text-lg transition-all cursor-pointer">
                  Go to Website
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
