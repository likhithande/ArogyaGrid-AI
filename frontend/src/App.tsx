import React, { useState, useEffect } from 'react';
import { AppSidebar } from './components/AppSidebar';
import { AppTopBar, GeographicContext } from './components/AppTopBar';
import { CommandPalette } from './components/CommandPalette';

/* ── Primary Executive Pages (Sections 4 - 15) ── */
import { CommandCenterView } from './pages/CommandCenterView';
import { IntelligenceView } from './pages/IntelligenceView';
import { DemandForecastingView } from './pages/DemandForecastingView';
import { InventoryIntelligenceView } from './pages/InventoryIntelligenceView';
import { SupplyNetworkView } from './pages/SupplyNetworkView';
import { EmergencyOperationsView } from './pages/EmergencyOperationsView';
import { HospitalsView } from './pages/HospitalsView';
import { MedicinesView } from './pages/MedicinesView';
import { PersonnelView } from './pages/PersonnelView';
import { ColdChainView } from './pages/ColdChainView';
import { SuppliersView } from './pages/SuppliersView';
import { ArogyaCopilotView } from './pages/ArogyaCopilotView';
import { DigitalTwinView } from './pages/DigitalTwinView';
import { AiAgentsView } from './pages/AiAgentsView';
import { AnalyticsView } from './pages/AnalyticsView';
import { ExecutiveReportView } from './pages/ExecutiveReportView';
import { AlertCenterView } from './pages/AlertCenterView';
import { ModelHealthView } from './pages/ModelHealthView';
import { SettingsView } from './pages/SettingsView';

export function App() {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [currentContext, setCurrentContext] = useState<GeographicContext>('India (National)');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Global ⌘K / Ctrl+K listener (Section 3, 22)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCopilot = () => {
    setCurrentView('copilot');
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Left Sidebar (~250px enterprise navigation) ── */}
      <AppSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* ── Main View Container ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* ── Top Header Navigation ── */}
        <AppTopBar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenCopilot={handleOpenCopilot}
          onOpenNotifications={() => setCurrentView('alerts')}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          currentContext={currentContext}
          onSelectContext={setCurrentContext}
        />

        {/* ── Page Content Area (Scrollable) ── */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px 48px',
            background: 'var(--bg-app)',
          }}
        >
          {/* COMMAND CENTER */}
          {currentView === 'overview' && (
            <CommandCenterView
              onNavigateToView={setCurrentView}
              onOpenCopilot={handleOpenCopilot}
              selectedContext={currentContext}
              onSelectContext={setCurrentContext}
            />
          )}

          {currentView === 'intelligence' && (
            <IntelligenceView
              onNavigateToView={setCurrentView}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {currentView === 'forecasting' && (
            <DemandForecastingView
              onNavigateToView={setCurrentView}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryIntelligenceView
              onNavigateToView={setCurrentView}
            />
          )}

          {currentView === 'supply-network' && (
            <SupplyNetworkView />
          )}

          {currentView === 'emergency-operations' && (
            <EmergencyOperationsView />
          )}

          {/* RESOURCE MANAGEMENT */}
          {currentView === 'hospitals' && (
            <HospitalsView />
          )}

          {currentView === 'medicines' && (
            <MedicinesView />
          )}

          {currentView === 'personnel' && (
            <PersonnelView />
          )}

          {currentView === 'cold-chain' && (
            <ColdChainView />
          )}

          {currentView === 'suppliers' && (
            <SuppliersView />
          )}

          {/* AI & SIMULATION */}
          {currentView === 'copilot' && (
            <ArogyaCopilotView
              onNavigateToView={setCurrentView}
            />
          )}

          {(currentView === 'digital-twin' || currentView === 'what-if') && (
            <DigitalTwinView />
          )}

          {currentView === 'ai-agents' && (
            <AiAgentsView />
          )}

          {/* INSIGHTS */}
          {currentView === 'analytics' && (
            <AnalyticsView />
          )}

          {currentView === 'reports' && (
            <ExecutiveReportView />
          )}

          {currentView === 'alerts' && (
            <AlertCenterView />
          )}

          {currentView === 'model-health' && (
            <ModelHealthView />
          )}

          {/* SYSTEM SETTINGS */}
          {currentView === 'settings' && (
            <SettingsView
              currentRole="National Health Administrator"
              onRoleChange={() => {}}
              language="en"
              onLanguageChange={() => {}}
              darkMode={false}
              onToggleTheme={() => {}}
              highContrast={false}
              onToggleHighContrast={() => {}}
              fontScale="normal"
              onChangeFontScale={() => {}}
            />
          )}
        </main>
      </div>

      {/* ── Global ⌘K Command Palette Modal (Section 22) ── */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(viewId) => {
          setCurrentView(viewId);
          setIsCommandPaletteOpen(false);
        }}
        onOpenCopilot={() => {
          setCurrentView('copilot');
          setIsCommandPaletteOpen(false);
        }}
      />
    </div>
  );
}
export default App;
