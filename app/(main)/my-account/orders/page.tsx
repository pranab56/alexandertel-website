'use client';

import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';
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
import { useGetAllMyProductQuery } from '@/features/repair/repairApi';
import { imageBaseURL } from '@/utils/BaseURL';
import { Loader2 } from 'lucide-react';

// Demo data removed
const orders: any[] = [];

const statusStyles = {
  Delivered: 'bg-green-50 text-green-600 border-green-100',
  Processing: 'bg-blue-50 text-blue-600 border-blue-100',
  Shipped: 'bg-orange-50 text-orange-600 border-orange-100',
  Cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const statusIcons = {
  Delivered: CheckCircle2,
  Processing: Clock,
  Shipped: Truck,
  Cancelled: XCircle,
};

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const tabs = ['All', 'Ongoing', 'Completed', 'Cancelled'];
  
  const { data: billingResponse, isLoading } = useGetAllMyProductQuery(undefined);
  
  const mappedOrders = useMemo(() => {
    if (!billingResponse?.data) return [];
    
    // The API returns a flat list of billing items. 
    // For now we map each item as a separate "order" entry
    return billingResponse.data.map((item: any) => ({
      id: item.productId.slice(-8).toUpperCase(),
      date: 'Recent', // Date not in item response
      status: 'Delivered', // Assuming delivered for successful billing
      total: item.price * item.quantity,
      subtotal: item.price * item.quantity,
      shipping: 0,
      paymentMethod: 'Paid',
      address: 'N/A',
      items: [
        {
          name: item.name,
          image: item.image ? (item.image.startsWith('http') ? item.image : imageBaseURL + item.image) : "/images/placeholder.jpg",
          price: item.price,
          qty: item.quantity
        }
      ]
    }));
  }, [billingResponse]);

  const filteredOrders = mappedOrders.filter((order: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing') return order.status === 'Processing' || order.status === 'Shipped';
    return order.status === activeTab || (activeTab === 'Completed' && order.status === 'Delivered');
  });

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
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Order History</h2>
            <p className="text-gray-400 text-sm font-normal">Manage and track your recent orders.</p>
          </div>
          <div className="relative w-full md:w-[350px]">
            <Input
              placeholder="Search by Order ID..."
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
                "ml-4 cursor-pointer px-6 py-2.5 rounded-sm text-sm font-medium transition-all whitespace-nowrap",
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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => {
              const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Package;
              return (
                <div
                  key={order.id}
                  className="group bg-white rounded-lg p-6 md:p-8 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-gray-50">
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</p>
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date Placed</p>
                        <h4 className="font-medium text-gray-900">{order.date}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
                        <Badge className={cn("px-4 py-1.5 rounded-full border flex items-center gap-2 font-medium shadow-none", statusStyles[order.status as keyof typeof statusStyles])}>
                          <StatusIcon size={14} />
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Estimated Total</p>
                        <h4 className="font-medium text-primary text-lg">€{order.total.toFixed(2)}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* <Button variant="outline" className="h-12 px-8 rounded-2xl font-bold border-gray-100 hover:bg-gray-50 transition-all group-hover:border-primary/20">
                        Invoice
                      </Button> */}
                      <DialogTrigger
                        render={
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            className="h-12 px-8 rounded-sm font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all cursor-pointer"
                          >
                            View Details
                          </Button>
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-8">
                    <div className="flex flex-wrap items-center gap-6">
                      {order.items.slice(0, 3).map((item: any, id: number) => (
                        <div key={id} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl pr-6 border border-transparent hover:border-gray-100 transition-all">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-50 flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[150px]">{item.name}</h5>
                            <p className="text-xs font-medium text-gray-400">Qty: {item.qty} &bull; €{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="h-16 flex items-center justify-center text-sm font-medium text-gray-400">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border border-dashed border-gray-200">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Package size={40} />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-400 max-w-xs mb-8">We couldn&apos;t find any orders matching your current filters.</p>
              <Button onClick={() => setActiveTab('All')} variant="outline" className="h-12 rounded-2xl font-medium px-10 border-gray-200">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {selectedOrder && (
          <DialogContent className="max-w-6xl w-[95vw] bg-white rounded-lg p-0 border-none shadow-2xl overflow-hidden sm:rounded-lg">
            <DialogHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Badge className={cn("px-4 py-1 rounded-full border flex items-center gap-2 font-medium shadow-none text-xs", statusStyles[selectedOrder.status as keyof typeof statusStyles])}>
                  {selectedOrder.status}
                </Badge>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <CalendarIcon size={14} />
                  {selectedOrder.date}
                </div>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">
                Order {selectedOrder.id}
              </DialogTitle>
            </DialogHeader>

            <div className="p-8 h-auto w-full overflow-y-auto custom-scrollbar space-y-8 text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h5 className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest">
                    <MapPin size={14} /> Shipping Address
                  </h5>
                  <p className="text-sm font-medium leading-relaxed">{selectedOrder.address}</p>
                </div>
                <div className="space-y-3">
                  <h5 className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest">
                    <CreditCard size={14} /> Payment Method
                  </h5>
                  <p className="text-sm font-medium leading-relaxed">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest">
                  <Package size={14} /> Items List
                </h5>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50 group hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-white">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-xs font-medium text-gray-400">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-400">Subtotal</span>
                  <span className="font-medium">€{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-400">Shipping</span>
                  <span className="font-medium">€{selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-black tracking-tight">Total Amount</span>
                  <span className="text-2xl font-black tracking-tight text-primary">€{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* <div className="p-6 bg-gray-50 flex gap-3">
              <Button onClick={() => window.print()} variant="outline" className="flex-1 h-12 rounded-xl font-bold bg-white border-gray-200">
                Print Invoice
              </Button>
              <Button className="flex-1 h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Track Shipment
              </Button>
            </div> */}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
