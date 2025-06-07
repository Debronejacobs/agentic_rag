// app/page.jsx (or wherever your main Page component is)
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from "../../../lib/pocketbase";
import ChatMessage from "@/components/ChatMessage";
// Import all components you might want to render
// Assuming these are the components you want to render
import PastChats from "@/components/PastChats";
import Profile from "@/components/Profile";
import UploadDocs from "@/components/UploadDocs";// You'll need to create this or rename your Document component

// Create theme context directly in this file
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Theme toggle button component (no changes needed here)
function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-gray-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // Moon icon for light mode (click to switch to dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        // Sun icon for dark mode (click to switch to light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}

export default function Page() {
  const router = useRouter();
  // Authentication states
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Theme state
  const [theme, setTheme] = useState('light');

  // New state to manage the active component based on sidebar selection
  const [activeView, setActiveView] = useState("new-conversation"); // Default to 'New Conversation'

  // Theme toggle function (no changes needed here)
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('clausefinder-theme', newTheme);
      }
      return newTheme;
    });
  };

  // Handler for sidebar item selection
  const handleSidebarSelect = (id) => {
    console.log("Selected sidebar item:", id); // For debugging
    setActiveView(id);
  };

  // Handle authentication check (no changes needed here)
  useEffect(() => {
    const isValidUser = pb.authStore.isValid;
    setIsAuthenticated(isValidUser); // Set authentication status

    if (!isValidUser) {
      router.push('/auth');
    }
    // Mark that the authentication check is complete, regardless of outcome
    setIsAuthChecked(true);
  }, [router]);

  // Theme persistence (no changes needed here)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('clausefinder-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Use saved theme, or user's preference, or default to light
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
    }
  }, []);

  // Apply theme class to document when theme changes (no changes needed here)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Conditional rendering for authentication
  if (!isAuthChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Function to render the active component
  const renderActiveComponent = () => {
    switch (activeView) {
      case "conversations":
        return <ChatMessage />;
      case "past_chats":
        return <PastChats />;
      case "upload_docs":
        return <UploadDocs />; // Make sure you create this component
      case "profile_settings":
        return <Profile />;
      default:
        return <ChatMessage />; // Default to ChatMessage if no match
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${theme === 'dark' ? 'dark' : ''}`}>
        <div className="min-h-screen  dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <SidebarProvider>
            {/* Pass the handleSidebarSelect function to AppSidebar */}
            <AppSidebar className="dark:bg-gray-800 dark:border-gray-700" onSelect={handleSidebarSelect} />
            <SidebarInset>
              <header
                className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] border-b dark:border-gray-800 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ">
                <div className="flex items-center gap-2 px-4 ">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          ClauseFinder
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div className="flex items-center gap-2 px-4 ">
                  <ThemeToggle />
                </div>
              </header>
              {/* Render the active component here */}
              {renderActiveComponent()}
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}