import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import TabBar from "./TabBar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <AppHeader />
      <TabBar homeTitle="Home" homePath="/" />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
