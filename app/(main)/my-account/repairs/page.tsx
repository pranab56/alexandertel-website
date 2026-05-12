'use client';

import {
  Search,
  Wrench,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  Calendar as CalendarIcon,
  Info,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAllRepairQuery } from '@/features/repair/repairApi';
import { imageBaseURL } from '@/utils/BaseURL';

const statusStyles = {
  pending: 'bg-blue-50 text-blue-600 border-blue-100',
  processing: 'bg-orange-50 text-orange-600 border-orange-100',
  completed: 'bg-green-50 text-green-600 border-green-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const statusIcons = {
  pending: Clock,
  processing: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export default function MyRepairsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  
  const { data: repairResponse, isLoading } = useGetAllRepairQuery(undefined);
  const repairs = repairResponse?.data || [];

  const tabs = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

  const filteredRepairs = repairs.filter((repair: any) => {
    const matchesTab = activeTab === 'All' || repair.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = repair._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         repair.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const calculateTotal = (repair: any) => {
    const serviceTotal = repair.service?.reduce((sum: number, s: any) => sum + s.price, 0) || 0;
    const fee = repair.serviceType === 'pickup' ? 10 : 0;
    return serviceTotal + fee;
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Search & Filter Header */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-100/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Repair History</h2>
            <p className="text-gray-400 text-sm font-normal">Track your device repairs and service status.</p>
          </div>
          <div className="relative w-full md:w-[350px]">
            <Input
              placeholder="Search by ID or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 bg-gray-50 border-none rounded-sm placeholder:text-gray-400 font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "cursor-pointer px-6 py-2.5 rounded-sm text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Dialog>
        <div className="space-y-6">
          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((repair: any) => {
              const StatusIcon = statusIcons[repair.status as keyof typeof statusIcons] || Clock;
              return (
                <div
                  key={repair._id}
                  className="group bg-white rounded-lg p-6 md:p-8 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-gray-50">
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Repair ID</p>
                        <h4 className="font-medium text-gray-900">{repair._id.slice(-8).toUpperCase()}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Request Date</p>
                        <h4 className="font-medium text-gray-900">{new Date(repair.createdAt).toLocaleDateString()}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
                        <Badge className={cn("px-4 py-1.5 rounded-full border flex items-center gap-2 font-medium shadow-none capitalize", statusStyles[repair.status as keyof typeof statusStyles])}>
                          <StatusIcon size={14} />
                          {repair.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Estimated Cost</p>
                        <h4 className="font-medium text-primary text-lg">€{calculateTotal(repair)}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <DialogTrigger render={
                        <Button
                          onClick={() => setSelectedRepair(repair)}
                          className="h-12 px-8 rounded-sm font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all cursor-pointer"
                        >
                          View Details
                        </Button>
                      } />
                    </div>
                  </div>

                  <div className="pt-8">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl pr-6 border border-transparent">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0 p-2">
                          <Image 
                            src={repair.product?.images?.[0] ? (repair.product.images[0].startsWith('http') ? repair.product.images[0] : imageBaseURL + repair.product.images[0]) : "/images/placeholder.jpg"} 
                            alt={repair.product?.name || "Device"} 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-bold text-gray-900">{repair.product?.name}</h5>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-tight">{repair.serviceType} Service</p>
                        </div>
                      </div>
                      
                      <div className="flex -space-x-3 overflow-hidden p-2">
                        {repair.service?.map((s: any, i: number) => (
                          <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20" title={s.name}>
                            <Wrench size={14} />
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-400">
                        {repair.service?.length} services selected
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg p-20 flex flex-col items-center justify-center text-center border border-dashed border-gray-200">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Wrench size={40} />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">No repairs found</h3>
              <p className="text-gray-400 max-w-xs mb-8">We couldn&apos;t find any repair requests matching your current filters.</p>
              <Button onClick={() => { setActiveTab('All'); setSearchTerm(''); }} variant="outline" className="h-12 rounded-xl font-medium px-10 border-gray-200">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {selectedRepair && (
          <DialogContent className="max-w-4xl w-[95vw] bg-white rounded-lg p-0 border-none shadow-2xl overflow-hidden">
            <DialogHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Badge className={cn("px-4 py-1 rounded-full border flex items-center gap-2 font-medium shadow-none text-xs capitalize", statusStyles[selectedRepair.status as keyof typeof statusStyles])}>
                  {selectedRepair.status}
                </Badge>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <CalendarIcon size={14} />
                  {new Date(selectedRepair.createdAt).toLocaleDateString()}
                </div>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">
                Repair Request #{selectedRepair._id.slice(-8).toUpperCase()}
              </DialogTitle>
            </DialogHeader>

            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h5 className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest">
                    <MapPin size={14} /> Service Info
                  </h5>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900 capitalize">{selectedRepair.serviceType} Service</p>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">{selectedRepair.address}</p>
                    <p className="text-sm font-medium text-gray-500"><span className="text-gray-900 font-bold">Slot:</span> {selectedRepair.pickupDate ? new Date(selectedRepair.pickupDate).toLocaleDateString() : ''} at {selectedRepair.timeSlot}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest">
                    <Info size={14} /> Problem Description
                  </h5>
                  <p className="text-sm font-medium text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-xl italic">
                    &quot;{selectedRepair.description}&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest">
                  <Wrench size={14} /> Selected Services
                </h5>
                <div className="space-y-3">
                  {selectedRepair.service.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50 group transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-gray-100">
                          <Wrench size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{s.name}</p>
                          <p className="text-xs font-medium text-gray-400 line-clamp-1">{s.description}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">€{s.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-400">Services Total</span>
                  <span className="font-bold text-gray-900">€{selectedRepair.service.reduce((a: number, b: any) => a + b.price, 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-400">{selectedRepair.serviceType === 'pickup' ? 'Pickup Fee' : 'Service Fee'}</span>
                  <span className="font-bold text-gray-900">€{selectedRepair.serviceType === 'pickup' ? 10 : 0}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold text-gray-900">Total Charged</span>
                  <span className="text-2xl font-black text-primary">€{calculateTotal(selectedRepair)}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
