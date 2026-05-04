'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotEmailMutation } from '@/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotEmail, { isLoading }] = useForgotEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: EmailFormValues) => {
    try {
      const res = await forgotEmail(data).unwrap();
      toast.success(res.message || 'OTP sent to your email!');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=reset`);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send OTP. Please check your email.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#D1D5DB]/30 backdrop-blur-3xl p-4 md:p-6">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#E5E7EB] via-[#F3F4F6] to-[#D1D5DB] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white/70 backdrop-blur-md rounded-lg p-8 md:p-12 shadow-2xl shadow-gray-200 border border-white/50"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-25 h-25">
            <Image src="/icons/Logo.png" alt="Logo" width={100} height={100} className="object-contain w-full h-full" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <KeyRound size={32} />
            </div>
            <h2 className="text-3xl font-medium text-gray-900 mb-2">Forgot Password</h2>
            <p className="text-gray-500 text-sm font-normal px-4">
              Enter your email address and we&apos;ll send you an OTP to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 ml-1">Email Address</Label>
              <Input
                placeholder="Enter your email address here..."
                {...register('email')}
                className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.email ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-sm text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer">
              {isLoading ? 'Sending...' : 'Send OTP Code'}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-all underline underline-offset-4 decoration-gray-200">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
