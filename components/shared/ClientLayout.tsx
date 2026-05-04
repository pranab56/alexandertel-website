"use client";

import { Provider } from "react-redux";
import { store } from "@/utils/store";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import TopLoader from "@/components/ui/TopLoader";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SmoothScroll>
        <TopLoader />
        <Cursor />
        {children}
        <Toaster />
      </SmoothScroll>
    </Provider>
  );
}
