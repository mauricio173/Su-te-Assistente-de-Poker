/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Header from "./components/Header";
import GtoSolver from "./components/GtoSolver";
import EquityCalc from "./components/EquityCalc";
import Multitabler from "./components/Multitabler";
import PokerTracker from "./components/PokerTracker";
import PokerHud from "./components/PokerHud";
import { Sparkles, Info, Play, Shield, HelpCircle, Spade, Heart, Diamond, Club } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("solver");
  const [showQuickTips, setShowQuickTips] = useState<boolean>(true);

  // Dynamic Tab Router
  const renderTabContent = () => {
    switch (activeTab) {
      case "solver":
        return <GtoSolver />;
      case "equity":
        return <EquityCalc />;
      case "multitasking":
        return <Multitabler />;
      case "tracker":
        return <PokerTracker />;
      case "hud":
        return <PokerHud />;
      default:
        return <GtoSolver />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/10 selection:text-emerald-400">
      {/* Visual Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Suite Content Arena */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
        
        {/* Quick Tips Welcome Banner */}
        {showQuickTips && (
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/30 to-zinc-900 border border-emerald-900/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Background absolute decor icons */}
            <div className="absolute right-10 top-0 bottom-0 flex items-center justify-center gap-2 opacity-[0.03] select-none pointer-events-none text-8xl">
              <Spade />
              <Heart />
              <Diamond />
              <Club />
            </div>

            <div className="flex gap-3 items-start relative z-10">
              <div className="bg-emerald-500/15 p-2 rounded-xl text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/10">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-sans font-bold text-zinc-100 flex items-center gap-1.5">
                  Bem-vindo ao Poker Pro Suite!
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-2xl">
                  Grind inteligente com teoria e suporte em tempo real: analise árvores de decisões no <strong>Solucionador GTO</strong>, simule ranges no <strong>Simulador Multitabela</strong> com teclas de atalho de altíssima velocidade, e alimente o <strong>HUD</strong> com registros de jogadas!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 shrink-0">
              <button
                id="btn-hide-welcome"
                onClick={() => setShowQuickTips(false)}
                className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-sans text-xs hover:text-zinc-200 hover:bg-zinc-850 rounded-lg cursor-pointer transition-all"
              >
                Esconder Dicas
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Mounted Router View */}
        <div className="transition-all duration-300">
          {renderTabContent()}
        </div>

        {/* Global Footer Credits and security indicators */}
        <footer className="border-t border-zinc-900 mt-12 pt-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-sans font-bold text-zinc-400">POKER_OS v4.2.1-PRO</span>
            <span>CPU: 12%</span>
            <span>RAM: 1.4GB</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              GTO_ENGINE_ONLINE
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>SERVER LATENCY: 22ms</span>
            <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden inline-block align-middle">
              <div className="bg-blue-500 h-full w-[80%]"></div>
            </div>
            <span>•</span>
            <span>Estágios de Cálculo Local Desconectados</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
