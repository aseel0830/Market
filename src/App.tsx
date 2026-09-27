/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MockupStudio } from './components/MockupStudio';
import { AIImageEditor } from './components/AIImageEditor';
import { ProHDGenerator } from './components/ProHDGenerator';
import { HelpModal } from './components/HelpModal';
import { SAMPLE_LOGOS } from './data/mockupTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'editor' | 'pro'>('studio');
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(SAMPLE_LOGOS[0].svgDataUri);
  const [mockupToEdit, setMockupToEdit] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // When user clicks "Edit mockup with AI" from the studio
  const handleSendToAIEditor = (mockupDataUrl: string) => {
    setMockupToEdit(mockupDataUrl);
    setActiveTab('editor');
  };

  // When user clicks "Generate Pro 4K Shoot" from the studio
  const handleSendToProGen = (logoDataUrl: string) => {
    setCurrentLogoUrl(logoDataUrl);
    setActiveTab('pro');
  };

  // When user clicks "Use as Logo" from AI Image Editor or Pro Generator
  const handleApplyAsLogo = (newLogoUrl: string) => {
    setCurrentLogoUrl(newLogoUrl);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Active Tab View */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'studio' && (
          <MockupStudio
            currentLogoUrl={currentLogoUrl}
            setCurrentLogoUrl={setCurrentLogoUrl}
            onSendToAIEditor={handleSendToAIEditor}
            onSendToProGen={handleSendToProGen}
          />
        )}

        {activeTab === 'editor' && (
          <AIImageEditor
            initialImage={mockupToEdit}
            onApplyAsLogo={handleApplyAsLogo}
            onSwitchToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'pro' && (
          <ProHDGenerator
            currentLogoUrl={currentLogoUrl}
            onApplyAsLogo={handleApplyAsLogo}
            onSwitchToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Help & Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
