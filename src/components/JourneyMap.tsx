import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface JourneyMapProps {
  currentDay: number;
}

export default function JourneyMap({ currentDay }: JourneyMapProps) {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  
  const nodes = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  return (
    <div className="bg-brand-card border border-brand-border rounded p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold uppercase tracking-widest text-[10px] text-brand-muted">90-Day Journey Map</h3>
        <span className="text-xs font-bold text-brand-green">Block {Math.floor(currentDay / 10)} / 9</span>
      </div>

      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-border -translate-y-1/2 rounded" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-green -translate-y-1/2 rounded transition-all duration-1000"
          style={{ width: `${Math.min((currentDay / 90) * 100, 100)}%` }}
        />

        <div className="flex justify-between relative z-10">
          {nodes.map((node) => {
            const isCompleted = currentDay >= node;
            const isCurrentBlock = currentDay >= node - 10 && currentDay < node;
            const isSelected = selectedNode === node;

            return (
              <div key={node} className="relative flex flex-col items-center">
                <button
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all transform hover:scale-110",
                    isCompleted 
                      ? "bg-brand-green border-brand-green text-black" 
                      : isCurrentBlock
                        ? "bg-black border-brand-green text-brand-green"
                        : "bg-black border-brand-border text-brand-muted"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrentBlock ? (
                    <Unlock className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                </button>
                <span className={cn(
                  "text-[9px] font-bold mt-2 absolute -bottom-5",
                  isCompleted ? "text-brand-green" : "text-brand-muted"
                )}>
                  D{node}
                </span>

                {/* Popover for selected node */}
                {isSelected && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 bg-black border border-brand-border p-2 rounded shadow-xl z-20 text-center">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-l border-t border-brand-border rotate-45" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Block {node/10}</p>
                      <p className="text-[9px] text-brand-muted">
                        {isCompleted 
                          ? 'Unlocked and conquered.' 
                          : isCurrentBlock 
                            ? `In progress (${node - currentDay} days left).` 
                            : 'Locked. Keep pushing.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
