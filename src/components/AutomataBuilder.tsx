import React, { useState } from 'react';
import { Automata, Transition } from '../types';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

type Props = {
  onBuild: (automata: Automata) => void;
};

export function AutomataBuilder({ onBuild }: Props) {
  const [statesInput, setStatesInput] = useState('q0, q1, q2');
  const [alphabetInput, setAlphabetInput] = useState('0, 1');
  const [startState, setStartState] = useState('q0');
  const [acceptStatesInput, setAcceptStatesInput] = useState('q2');
  
  const [transitions, setTransitions] = useState<Omit<Transition, 'id'>[]>([
    { from: 'q0', symbol: '0', to: 'q0' },
    { from: 'q0', symbol: '1', to: 'q0' },
    { from: 'q0', symbol: '0', to: 'q1' },
    { from: 'q1', symbol: '1', to: 'q2' },
  ]);

  const handleAddTransition = () => {
    setTransitions([...transitions, { from: '', symbol: '', to: '' }]);
  };

  const handleUpdateTransition = (index: number, field: keyof Transition, value: string) => {
    const newTrans = [...transitions];
    newTrans[index] = { ...newTrans[index], [field]: value };
    setTransitions(newTrans);
  };

  const handleRemoveTransition = (index: number) => {
    setTransitions(transitions.filter((_, i) => i !== index));
  };

  const handleBuild = () => {
    const states = statesInput.split(',').map(s => s.trim()).filter(Boolean);
    const alphabet = alphabetInput.split(',').map(s => s.trim()).filter(Boolean);
    const acceptStates = acceptStatesInput.split(',').map(s => s.trim()).filter(Boolean);
    
    const validTransitions = transitions
      .filter(t => t.from && t.to && t.symbol !== undefined)
      .map((t, i) => ({ ...t, id: i.toString() }));

    onBuild({
      states,
      alphabet,
      transitions: validTransitions,
      startState: startState.trim(),
      acceptStates
    });
  };

  return (
    <div className="bg-bg-tertiary p-6 rounded-2xl shadow-xl border border-border-subtle flex flex-col gap-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-text-main mb-1">Define NFA</h2>
        <p className="text-sm text-text-muted">Configure states and transitions.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">States (comma separated)</label>
          <input 
            type="text" 
            className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-accent-light focus:ring-2 focus:ring-accent-main outline-none transition-shadow placeholder:text-text-muted"
            value={statesInput}
            onChange={e => setStatesInput(e.target.value)}
            placeholder="e.g., q0, q1, q2"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Alphabet (comma separated)</label>
          <input 
            type="text" 
            className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-accent-light focus:ring-2 focus:ring-accent-main outline-none transition-shadow placeholder:text-text-muted"
            value={alphabetInput}
            onChange={e => setAlphabetInput(e.target.value)}
            placeholder="e.g., 0, 1 (use 'e' for epsilon)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Start State</label>
            <input 
              type="text" 
              className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-accent-light focus:ring-2 focus:ring-accent-main outline-none transition-shadow"
              value={startState}
              onChange={e => setStartState(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Accept States</label>
            <input 
              type="text" 
              className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-accent-light focus:ring-2 focus:ring-accent-main outline-none transition-shadow"
              value={acceptStatesInput}
              onChange={e => setAcceptStatesInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-0">Transitions</label>
          <button 
            onClick={handleAddTransition}
            className="text-sm flex items-center text-accent-light hover:text-accent-main font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </button>
        </div>
        
        <div className="space-y-2">
          {transitions.map((t, index) => (
            <div key={index} className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="From"
                className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-text-main focus:ring-2 focus:ring-accent-main outline-none placeholder:text-text-muted"
                value={t.from}
                onChange={e => handleUpdateTransition(index, 'from', e.target.value)}
              />
              <span className="text-text-muted font-bold">-</span>
              <input 
                type="text" 
                placeholder="Symbol"
                className="w-20 bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-text-main focus:ring-2 focus:ring-accent-main outline-none text-center placeholder:text-text-muted"
                value={t.symbol}
                onChange={e => handleUpdateTransition(index, 'symbol', e.target.value)}
              />
              <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input 
                type="text" 
                placeholder="To"
                className="w-full bg-bg-secondary border border-border-subtle rounded px-3 py-2 text-sm text-text-main focus:ring-2 focus:ring-accent-main outline-none placeholder:text-text-muted"
                value={t.to}
                onChange={e => handleUpdateTransition(index, 'to', e.target.value)}
              />
              <button 
                onClick={() => handleRemoveTransition(index)}
                className="p-2 text-text-muted hover:text-accent-main transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleBuild}
        className="mt-auto w-full py-3 bg-accent-main hover:bg-accent-hover text-white rounded-md font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent-main/20"
      >
        Visualize & Convert
      </button>
    </div>
  );
}
