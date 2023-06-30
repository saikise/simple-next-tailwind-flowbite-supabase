import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
}
