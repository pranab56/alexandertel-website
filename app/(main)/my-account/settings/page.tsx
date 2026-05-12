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
    Image as ImageIcon,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/features/profile/profileApi";
import { imageBaseURL } from "@/utils/BaseURL";
import toast from "react-hot-toast";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().optional(),
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileQuery(undefined);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();


    const profile = profileResponse?.data;

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        reset,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: React.useMemo(() => {
            const names = profile?.userName?.split(' ') || [];
            return {
                firstName: names[0] || "",
                lastName: names.slice(1).join(' ') || "",
                email: profile?.email || "",
                phone: profile?.phoneNumber || "",
                address: profile?.location || "",
            };
        }, [profile])
    });

    // Reset form when profile data loads
    React.useEffect(() => {
        if (profile) {
            const names = profile.userName?.split(' ') || [];
            reset({
                firstName: names[0] || "",
                lastName: names.slice(1).join(' ') || "",
                email: profile.email || "",
                phone: profile.phoneNumber || "",
                address: profile.location || "",
            });
        }
    }, [profile, reset]);

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const onProfileSubmit = async (data: ProfileFormValues) => {
        try {
            const formData = new FormData();

            // Prepare data object for the "data" field as per screenshot
            const updateData = {
                userName: data.firstName + " " + data.lastName,
                phoneNumber: data.phone,
                email: data.email,
                location: data.address
            };

            formData.append('data', JSON.stringify(updateData));

            if (selectedImage) {
                formData.append('images', selectedImage);
            }

            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            console.log(err)
            toast.error(err?.data?.message || "Failed to update profile");
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        try {
            const response = await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }).unwrap();
            toast.success(response.message || "Password changed successfully!");
            resetPassword();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to change password");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error("Image size must be less than 1MB");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (isProfileLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Profile Image Section */}
            <div className="bg-white rounded-lg p-10 border border-gray-100 overflow-hidden relative group">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full border-4 border-gray-50 bg-gray-100 flex items-center justify-center overflow-hidden shadow-xl shadow-gray-200/50">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Profile Preview" fill className="p-4 rounded-full" />
                            ) : profile?.profile ? (
                                <Image src={imageBaseURL + profile.profile} alt="Profile" fill className="p-4 rounded-full" />
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
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="h-12 px-12 rounded-sm font-medium bg-primary hover:bg-primary/90 cursor-pointer text-white shadow-xl shadow-primary/20 active:scale-95 transition-all w-full md:w-auto disabled:opacity-50"
                        >
                            {isUpdating ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
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
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 pr-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        passwordErrors.currentPassword && "ring-2 ring-red-500 shadow-sm"
                                    )}
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {passwordErrors.currentPassword && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{passwordErrors.currentPassword.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">New Password</Label>
                            <div className="relative">
                                <Input
                                    {...registerPassword("newPassword")}
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 pr-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        passwordErrors.newPassword && "ring-2 ring-red-500 shadow-sm"
                                    )}
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {passwordErrors.newPassword && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{passwordErrors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    {...registerPassword("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "h-12 bg-gray-50 border-none rounded-sm px-6 pl-12 pr-12 font-medium placeholder:text-gray-300 transition-all focus-visible:ring-primary/20",
                                        passwordErrors.confirmPassword && "ring-2 ring-red-500 shadow-sm"
                                    )}
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {passwordErrors.confirmPassword && <p className="text-red-500 text-[10px] font-medium uppercase tracking-wider ml-1">{passwordErrors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <div className="">
                        <Button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full h-12 rounded-sm font-medium bg-primary hover:bg-primary/90 cursor-pointer text-white shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isChangingPassword ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                            Change Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
