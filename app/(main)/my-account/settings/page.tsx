'use client';

import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Camera, 
  Trash2, 
  KeyRound,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Physical address is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function MySettingsPage() {
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const onProfileSubmit = (data: ProfileFormValues) => {
        console.log("Profile Updated:", data);
        alert("Profile details updated successfully!");
    };

    const onPasswordSubmit = (data: PasswordFormValues) => {
        console.log("Password Changed:", data);
        alert("Password changed successfully!");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImg(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Profile Image Section */}
            <div className="bg-white rounded-lg p-10 border border-gray-100 overflow-hidden relative group">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full border-4 border-gray-50 bg-gray-100 flex items-center justify-center overflow-hidden shadow-xl shadow-gray-200/50">
                            {profileImg ? (
                                <Image src={profileImg} alt="Profile" fill className="object-cover" />
                            ) : (
                                <User size={64} className="text-gray-300" />
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                            <Camera size={18} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                        />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Profile Picture</h2>
                            <p className="text-gray-400 text-sm font-medium">Click the camera icon to upload a profile picture.</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-primary/10 text-primary hover:bg-primary/20 rounded-xl px-6 font-medium shadow-none border-none h-11 transition-all"
                            >
                                <ImageIcon size={18} className="mr-2" />
                                Change Photo
                            </Button>
                            {profileImg && (
                                <Button 
                                    onClick={removeImage}
                                    variant="outline" 
                                    className="border-red-100 text-red-500 hover:bg-red-50 rounded-xl px-6 font-medium h-11 transition-all"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Personal Information */}
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="xl:col-span-2 bg-white rounded-lg p-10 border border-gray-100 space-y-10">
                    <div>
                        <h3 className="text-2xl font-medium text-gray-900 tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                <User size={20} />
                            </div>
                            Personal Information
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                            <Input 
                                {...registerProfile("firstName")}
                                placeholder="Enter first name" 
                                className={cn(
                                    "h-12 bg-gray-50 border-none rounded-sm px-6 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                    profileErrors.firstName && "ring-2 ring-red-500 shadow-sm"
                                )} 
                            />
                            {profileErrors.firstName && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{profileErrors.firstName.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                            <Input 
                                {...registerProfile("lastName")}
                                placeholder="Enter last name" 
                                className={cn(
                                    "h-12 bg-gray-50 border-none rounded-sm px-6 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                    profileErrors.lastName && "ring-2 ring-red-500 shadow-sm"
                                )} 
                            />
                            {profileErrors.lastName && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{profileErrors.lastName.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                            <div className="relative">
                                <Input 
                                    {...registerProfile("email")}
                                    type="email" 
                                    placeholder="Enter email address" 
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        profileErrors.email && "ring-2 ring-red-500 shadow-sm"
                                    )} 
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {profileErrors.email && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{profileErrors.email.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
                            <div className="relative">
                                <Input 
                                    {...registerProfile("phone")}
                                    type="tel" 
                                    placeholder="Enter phone number" 
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        profileErrors.phone && "ring-2 ring-red-500 shadow-sm"
                                    )} 
                                />
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {profileErrors.phone && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{profileErrors.phone.message}</p>}
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Physical Address</Label>
                            <div className="relative">
                                <Input 
                                    {...registerProfile("address")}
                                    placeholder="Enter physical address" 
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        profileErrors.address && "ring-2 ring-red-500 shadow-sm"
                                    )} 
                                />
                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {profileErrors.address && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{profileErrors.address.message}</p>}
                        </div>
                    </div>

                    <div className="">
                        <Button type="submit" className="h-12 px-12 rounded-sm font-medium bg-primary hover:bg-primary/90 cursor-pointer text-white shadow-xl shadow-primary/20 active:scale-95 transition-all w-full md:w-auto">
                            Update Profile
                        </Button>
                    </div>
                </form>

                {/* Password / Security */}
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="bg-white rounded-lg p-5 border border-gray-100 space-y-10 h-auto">
                    <div>
                        <h3 className="text-2xl font-medium text-gray-900 tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                                <KeyRound size={20} />
                            </div>
                            Security
                        </h3>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Current Password</Label>
                            <div className="relative">
                                <Input 
                                    {...registerPassword("currentPassword")}
                                    type="password" 
                                    placeholder="••••••••" 
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        passwordErrors.currentPassword && "ring-2 ring-red-500 shadow-sm"
                                    )} 
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {passwordErrors.currentPassword && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{passwordErrors.currentPassword.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">New Password</Label>
                            <div className="relative">
                                <Input 
                                    {...registerPassword("newPassword")}
                                    type="password" 
                                    placeholder="••••••••" 
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        passwordErrors.newPassword && "ring-2 ring-red-500 shadow-sm"
                                    )} 
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {passwordErrors.newPassword && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{passwordErrors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</Label>
                            <div className="relative">
                                <Input 
                                    {...registerPassword("confirmPassword")}
                                    type="password" 
                                    placeholder="••••••••" 
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        passwordErrors.confirmPassword && "ring-2 ring-red-500 shadow-sm"
                                    )} 
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {passwordErrors.confirmPassword && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{passwordErrors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <div className="">
                        <Button type="submit" className="w-full h-12 rounded-sm font-medium bg-primary hover:bg-primary/90 cursor-pointer text-white shadow-xl shadow-primary/20 active:scale-95 transition-all">
                            Change Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
