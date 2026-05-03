import React from "react";
import { HomePageClient } from "./HomePageClient";
import { HomeNavigationProvider } from "./_providers/HomeNavigationProvider";

export default function HomePage() {
  return (
    <HomeNavigationProvider>
      <HomePageClient />
    </HomeNavigationProvider>
  );
}   
