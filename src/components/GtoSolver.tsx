/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, BrainCircuit, ShieldCheck, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { getGTOPreflopAction } from "../utils/pokerMath";

export default function GtoSolver() {
  const [position, setPosition] = useState<"UTG" | "CO" | "BTN" | "SB" | "BB">("BTN");
  const [scenario, setScenario] = useState<"open" | "threebet" | "defense">("open");
  const [hoveredHand, setHoveredHand] = useState<string | null>(null);
  
  // Custom hand text fields for the AI Solver Coach
  const [customSituation, setCustomSituation] = useState("Hero no CO com KQs. UTG deu Raise para 2.2BB, HJ deu Call.");
  const [customActionHistory, setCustomActionHistory] = useState("Flop veio Ts Jh 4c. UTG deu Check, HJ apostou 3BB no pote de 6.5BB.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Deck rank lists
  const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

  // Determines color rendering for hand cell depending on simulated GTO ranges
  const getHandCellColor = (hand: string) => {
    const action = getGTOPreflopAction(hand, scenario);
    
    // Customize ranges by seat position
    let scoreMultiplier = 1;
    if (position === "UTG") scoreMultiplier = 0.3; // Very tight
    if (position === "CO") scoreMultiplier = 0.6; // Tight-Medium
    if (position === "BTN") scoreMultiplier = 0.95; // Loose aggressive
    if (position === "SB") scoreMultiplier = 0.7; // Medium
    if (position === "BB") scoreMultiplier = 0.85; // Wide defense

    const adjustedFold = Math.min(100, action.fold / scoreMultiplier);
    const adjustedRaise = Math.max(0, action.raise * scoreMultiplier);
    const adjustedCall = 100 - adjustedFold - adjustedRaise;

    if (adjustedRaise > 60) return "bg-emerald-600 border border-emerald-500 text-zinc-100 hover:bg-emerald-500";
    if (adjustedRaise > 25) return "bg-teal-700 border border-teal-600 text-zinc-200 hover:bg-teal-600";
    if (adjustedCall > 40) return "bg-amber-600/80 border border-amber-500/50 text-zinc-200 hover:bg-amber-500/80";
    if (adjustedFold > 85) return "bg-zinc-900 border border-zinc-800 text-zinc-600 hover:bg-zinc-800/80";
    
    return "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700";
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysisResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze-hand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation: `Posição Hero: ${position} | Tipo: ${scenario === "open" ? "Abertura Preflop" : scenario === "threebet" ? "3-Bet Preflop" : "Defesa"}. ${customSituation}`,
          cards: "KQs (Copas) no Board: Ts Jh 4c",
          history: customActionHistory,
          focus: "GTO vs Estratégias de Exploração de Vilão",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Houve um problema de servidor ao interagir com o Gemini.");
      }
      setAiAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erro de conexão ao servidor.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="gto-solver-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Visual Preflop Guide Panel - Column span 7 */}
      <section className="lg:col-span-7 bg-zinc-900 p-5 rounded-xl border border-zinc-800/80 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-zinc-100 font-sans font-semibold text-sm">Matriz de Ranges GTO Pré-Flop</h3>
          </div>
          
          {/* Quick preset positions */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-lg border border-zinc-800 self-start">
            {(["UTG", "CO", "BTN", "SB", "BB"] as const).map((pos) => (
              <button
                key={pos}
                id={`btn-pos-${pos}`}
                onClick={() => setPosition(pos)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${
                  position === pos
                    ? "bg-emerald-500 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Scenario selection selector */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <button
            id="gto-scen-open"
            onClick={() => setScenario("open")}
            className={`py-2 text-xs font-medium rounded-lg text-center transition-all ${
              scenario === "open"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Abertura RFI (Raise First In)
          </button>
          <button
            id="gto-scen-threebet"
            onClick={() => setScenario("threebet")}
            className={`py-2 text-xs font-medium rounded-lg text-center transition-all ${
              scenario === "threebet"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Contra 3-Bet (vs Reraise)
          </button>
          <button
            id="gto-scen-defense"
            onClick={() => setScenario("defense")}
            className={`py-2 text-xs font-medium rounded-lg text-center transition-all ${
              scenario === "defense"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Defesa de Blinds
          </button>
        </div>

        {/* The 13x13 Poker Range Grid Matrix */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-13 gap-1 min-w-[420px] aspect-square">
            {ranks.map((r1, rowIdx) =>
              ranks.map((r2, colIdx) => {
                let handStr = "";
                let isSuited = false;
                let isPair = r1 === r2;

                if (rowIdx < colIdx) {
                  handStr = `${r1}${r2}s`;
                  isSuited = true;
                } else if (rowIdx > colIdx) {
                  handStr = `${r2}${r1}o`;
                } else {
                  handStr = `${r1}${r2}`;
                }

                return (
                  <button
                    key={handStr}
                    id={`handcell-${handStr}`}
                    onMouseEnter={() => setHoveredHand(handStr)}
                    className={`aspect-square text-[9px] font-mono font-bold rounded-sm flex items-center justify-center transition-all cursor-crosshair leading-none ${getHandCellColor(
                      handStr
                    )}`}
                  >
                    {handStr}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Legends & Range statistics bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs border-t border-zinc-900 pt-3 text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span>
              Raise Forte
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-teal-700 rounded-xs"></span>
              Raise Freq
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-600 rounded-xs"></span>
              Call / Check
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-zinc-900 border border-zinc-800 rounded-xs"></span>
              Fold
            </span>
          </div>
          <div>
            {hoveredHand ? (
              <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md text-emerald-400">
                Mão: <span className="font-bold text-zinc-100">{hoveredHand}</span> ({hoveredHand.length === 2 ? "Par" : hoveredHand.endsWith("s") ? "Suited" : "Offsuit"})
              </div>
            ) : (
              <span className="text-zinc-500">Passe o mouse nas mãos para detalhes</span>
            )}
          </div>
        </div>
      </section>

      {/* Advanced AI Poker Coach Analyzer - Column span 5 */}
      <section className="lg:col-span-5 flex flex-col gap-5 mr-0">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800/80 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-violet-400 animate-pulse" />
            <span className="text-zinc-100 font-sans font-semibold text-sm">GTO Coach Inteligente</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Está com uma mão complicada na mesa? O nosso GTO Coach de Inteligência Artificial analisa a jogada, as cartas comunitárias e as pot odds com teoria matemática rigorosa.
          </p>

          <div className="flex flex-col gap-3 mt-1">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">MÃO DO HERO & POSIÇÕES</label>
              <input
                id="gto-ai-situation-input"
                type="text"
                value={customSituation}
                onChange={(e) => setCustomSituation(e.target.value)}
                className="w-full text-xs text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500/50"
                placeholder="Ex %Hero no CO com KQs..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">CENÁRIO DO BOARD / HISTÓRICO DE AÇÃO</label>
              <textarea
                id="gto-ai-history-input"
                rows={3}
                value={customActionHistory}
                onChange={(e) => setCustomActionHistory(e.target.value)}
                className="w-full text-xs text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500/50 resize-none"
                placeholder="Descreva a ação de apostas pré ou pós-flop..."
              />
            </div>

            <button
              id="btn-run-gto-ai"
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-sans font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-950/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer text-center"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Calculando Ranges e Processando GTO...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-violet-200 animate-spin-slow" />
                  <span>Analisar Cenário com GTO Coach IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display response box */}
        {(aiAnalysisResult || isAnalyzing || errorMessage) && (
          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800/80 flex flex-col gap-3 min-h-[160px] max-h-[420px] overflow-y-auto">
            <h4 className="text-xs font-mono font-bold tracking-wider text-violet-400 uppercase flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
              Relatório do Analisador GTO
            </h4>

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
                <p className="text-xs text-zinc-400 font-sans">
                  Processando milhões de simulações em árvore de decisão ...
                </p>
                <p className="text-[10px] text-zinc-500 font-mono italic">
                  Analisando ranges de {position} vs oponente
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/30 border border-rose-900/30 rounded-xl text-xs text-rose-300">
                <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Falha na análise</p>
                  <p className="text-rose-400/80 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {aiAnalysisResult && (
              <div className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap selection:bg-violet-500/20">
                {/* Parse Markdown elements cleanly, or render simply */}
                {aiAnalysisResult.split("\n").map((line, idx) => {
                  if (line.startsWith("###")) {
                    return <h5 key={idx} className="text-zinc-100 font-bold mt-4 mb-2 text-xs border-l-2 border-violet-500 pl-2">{line.replace("###", "")}</h5>;
                  }
                  if (line.startsWith("##")) {
                    return <h5 key={idx} className="text-emerald-400 font-bold mt-4 mb-2 text-sm">{line.replace("##", "")}</h5>;
                  }
                  if (line.startsWith("**") || line.startsWith("1.")) {
                    return <p key={idx} className="text-zinc-200 font-medium my-1.5">{line}</p>;
                  }
                  return <p key={idx} className="my-1 text-zinc-400">{line}</p>;
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
