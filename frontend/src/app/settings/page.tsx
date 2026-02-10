"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import ProfileSettings from "@/components/settings/ProfileSettings";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import PreferencesSettings from "@/components/settings/PreferencesSettings";
import LanguageSettings from "@/components/settings/LanguageSettings";
import PricingSettings from "@/components/settings/PricingSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
      switch(activeTab) {
          case "profile":
              return <ProfileSettings />;
          case "schedule":
              return <ScheduleSettings />;
          case "preferences":
              return <PreferencesSettings />;
          case "language":
              return <LanguageSettings />;
          case "pricing":
              return <PricingSettings />;
          default:
              return null;
      }
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
}
