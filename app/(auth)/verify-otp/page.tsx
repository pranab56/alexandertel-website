'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyEmailMutation, useResendOTPMutation } from '@/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type OTPFormValues = z.infer<typeof otpSchema>;

function VerifyOTPContent() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleDigitChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];
    
    if (value.length > 1) {
      const pastedData = value.split('').slice(0, 6 - index);
      pastedData.forEach((char, i) => {
        if (index + i < 6) newDigits[index + i] = char;
      });
      setOtpDigits(newDigits);
      setValue('otp', newDigits.join(''), { shouldValidate: true });
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = value;
    setOtpDigits(newDigits);
    setValue('otp', newDigits.join(''), { shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newDigits = [...otpDigits];
    pastedData.forEach((char, i) => {
      if (i < 6 && /^\d$/.test(char)) newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    setValue('otp', newDigits.join(''), { shouldValidate: true });
    inputRefs.current[Math.min(pastedData.length - 1, 5)]?.focus();
  };

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Redirecting to login...');
      router.push('/login');
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onSubmit = async (data: OTPFormValues) => {
    try {
      const payload = {
        email: email,
        oneTimeCode: Number(data.otp),
      };
      const res = await verifyEmail(payload).unwrap();
      const isReset = searchParams.get('type') === 'reset';
      
      toast.success(res.message || 'OTP verified successfully!');
      setIsSuccess(true);

      setTimeout(() => {
        if (isReset) {
          const token = res.data || '';
          router.push(`/reset-password?token=${encodeURIComponent(token)}`);
        } else {
          router.push('/login');
        }
      }, 2000);
    } catch (error: any) {
      toast.error(error.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOTP({ email }).unwrap();
      toast.success(res.message || 'OTP resent successfully!');
      setResendTimer(30);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to resend OTP.');
    }
  };

  if (!email) return null;

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
              key="otp-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <Mail size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
                <p className="text-gray-500 text-sm font-normal">
                  We&apos;ve sent a 6-digit verification code to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 ml-1 block text-center uppercase tracking-wider">Verification Code</Label>
                  <div className="flex justify-between gap-2 sm:gap-4 px-2" onPaste={handlePaste}>
                    {otpDigits.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 bg-gray-200/50 border-none rounded-sm text-center text-3xl font-bold text-gray-900 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all ${errors.otp ? 'ring-2 ring-red-500/20 bg-red-50/30' : ''}`}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-xs font-semibold mt-2 text-center uppercase tracking-tight">{errors.otp.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer">
                  {isLoading ? 'Verifying Code...' : 'Verify & Continue'}
                </Button>

                <div className="text-center space-y-4">
                  <p className="text-gray-500 text-sm font-medium">
                    Didn&apos;t receive the code?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-primary font-bold">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-primary font-bold hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    )}
                  </p>
                  <Link href="/register" className="block text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
                    Back to Register
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">OTP Verified!</h2>
              <p className="text-gray-500 max-w-xs mx-auto mb-10 text-lg">
                Your verification was successful. Redirecting you to the next step...
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

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
