'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onEmailSubmit = (data: EmailFormValues) => {
    console.log('Reset Email:', data);
    setStep(2);
  };

  const onVerifyOtp = () => {
    if (otp.some(digit => digit === '')) {
      setOtpError('Please enter the full 6-digit code');
      return;
    }
    setStep(3);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log('New Password Data:', data);
    setStep(4);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#D1D5DB]/30 backdrop-blur-3xl p-4 md:p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#E5E7EB] via-[#F3F4F6] to-[#D1D5DB] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white/70 backdrop-blur-md rounded-lg p-8 md:p-12 shadow-2xl shadow-gray-200 border border-white/50"
      >
        <AnimatePresence mode="wait">
          {step !== 4 && (
            <div className="flex flex-col items-center mb-10">
              <div className="w-25 h-25">
                <Image src="/icons/Logo.png" alt="Logo" width={1000} height={1000} className="object-contain w-full h-full" />
              </div>
            </div>
          )}

          {step === 1 && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-medium text-gray-900 mb-2">Forgot Password</h2>
                <p className="text-gray-500 text-sm font-normal px-4">
                  Enter your email address and we&apos;ll send you an OTP to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Email Address</Label>
                  <Input
                    placeholder="Enter your email address here..."
                    {...emailForm.register('email')}
                    className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${emailForm.formState.errors.email ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-sm text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer">
                  Send OTP Codes
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-all underline underline-offset-4 decoration-gray-200">
                    Back to Login
                  </Link>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-medium text-gray-900 mb-2">Verify Account</h2>
                <p className="text-gray-500 text-sm font-normal">
                  We&apos;ve sent a unique 6-digit verification code to your email address.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center gap-2 md:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-10 h-12 md:w-12 md:h-12 text-center text-lg font-bold text-gray-800 bg-gray-200/50 border-none rounded-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all ${otpError ? 'ring-2 ring-red-500/20' : ''}`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-xs font-medium text-center">{otpError}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-medium px-1">
                <span className="text-gray-500">Didn&apos;t receive the code?</span>
                <button onClick={() => setOtp(['', '', '', '', '', ''])} className="text-primary hover:underline font-bold transition-all cursor-pointer">Resend OTP</button>
              </div>

              <Button
                onClick={onVerifyOtp}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-sm text-lg transition-all shadow-none active:scale-[0.98] cursor-pointer"
              >
                Verify & Continue
              </Button>

              <div className="text-center text-sm font-medium">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 transition-all cursor-pointer underline underline-offset-4">Cancel and Restart</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-medium text-gray-900 mb-2">New Password</h2>
                <p className="text-gray-500 text-sm font-normal leading-relaxed">
                  Please create a new secure password for your account.
                </p>
              </div>

              <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Create New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="• • • • • • • •"
                      {...passwordForm.register('password')}
                      className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${passwordForm.formState.errors.password ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.password && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{passwordForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 ml-1">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="• • • • • • • •"
                      {...passwordForm.register('confirmPassword')}
                      className={`h-12 bg-gray-200/50 border-none rounded-sm px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${passwordForm.formState.errors.confirmPassword ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-sm text-lg transition-all shadow-none active:scale-[0.98] cursor-pointer">
                  Update Password
                </Button>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-xl shadow-green-500/10">
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Changed</h2>
              <p className="text-gray-500 max-w-xs mx-auto mb-10 text-lg">
                Your password has been reset successfully. You can now login with your new credentials.
              </p>
              <Link href="/login" className="w-full">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-sm text-lg transition-all cursor-pointer">
                  Go to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
