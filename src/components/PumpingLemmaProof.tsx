import React from 'react';
import { PumpingLemmaState } from '../types';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const PumpingLemmaProof = ({ plState, isSimulating }: { plState: PumpingLemmaState, isSimulating?: boolean }) => {
  const { language, p, w, x, y, z, i } = plState;
  const pNum = typeof p === 'number' ? p : 0;
  const iNum = typeof i === 'number' ? i : 0;

  const isPrime = (num: number) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

    const isInLanguage = (str: string, lang: string) => {
    if (lang === 'anbn') {
      if (!/^a*b*$/.test(str)) return false;
      return (str.match(/a/g) || []).length === (str.match(/b/g) || []).length;
    }
    if (lang === '0n1n') {
      if (!/^0*1*$/.test(str)) return false;
      return (str.match(/0/g) || []).length === (str.match(/1/g) || []).length;
    }
    if (lang === 'anbncn') {
      if (!/^a*b*c*$/.test(str)) return false;
      const countA = (str.match(/a/g) || []).length;
      const countB = (str.match(/b/g) || []).length;
      const countC = (str.match(/c/g) || []).length;
      return countA === countB && countB === countC;
    }
    if (lang === '0n1n2n') {
      if (!/^0*1*2*$/.test(str)) return false;
      const count0 = (str.match(/0/g) || []).length;
      const count1 = (str.match(/1/g) || []).length;
      const count2 = (str.match(/2/g) || []).length;
      return count0 === count1 && count1 === count2;
    }
    if (lang === '0n1n0n') {
      if (!/^0*1*0*$/.test(str)) return false;
      const match = str.match(/^(0*)(1*)(0*)$/);
      if (!match) return false;
      return match[1].length === match[2].length && match[2].length === match[3].length;
    }
    if (lang === 'ww') {
      if (str.length % 2 !== 0) return false;
      const half1 = str.substring(0, str.length / 2);
      const half2 = str.substring(str.length / 2);
      return half1 === half2;
    }
    if (lang === 'anbm_neq') {
      if (!/^a*b*$/.test(str)) return false;
      const countA = (str.match(/a/g) || []).length;
      const countB = (str.match(/b/g) || []).length;
      return countA !== countB;
    }
    if (lang === 'eq_01') {
      if (!/^[01]*$/.test(str)) return false;
      const count0 = (str.match(/0/g) || []).length;
      const count1 = (str.match(/1/g) || []).length;
      return count0 === count1;
    }
    if (lang === 'wwR') {
      if (!/^[ab]*$/.test(str)) return false;
      if (str.length % 2 !== 0) return false;
      const half1 = str.substring(0, str.length / 2);
      const half2 = str.substring(str.length / 2).split('').reverse().join('');
      return half1 === half2;
    }
    if (lang === 'wwR_01') {
      if (!/^[01]*$/.test(str)) return false;
      if (str.length % 2 !== 0) return false;
      const half1 = str.substring(0, str.length / 2);
      const half2 = str.substring(str.length / 2).split('').reverse().join('');
      return half1 === half2;
    }
    if (lang === 'prime') {
      if (!/^a*$/.test(str)) return false;
      return isPrime(str.length);
    }
    if (lang === 'prime_0') {
      if (!/^0*$/.test(str)) return false;
      return isPrime(str.length);
    }
    return false;
  };

  const normalize = (val: string) => { const t = val.trim(); return (t === 'ε' || t === 'e' || t === 'E') ? '' : t; };
  const wVal = normalize(w);
  const xVal = normalize(x);
  const yVal = normalize(y);
  const zVal = normalize(z);

  const isConcatValid = xVal + yVal + zVal === wVal;
  const isLengthValid = wVal.length >= pNum;
  const isXYValid = (xVal + yVal).length <= pNum;
  const isYValid = yVal.length > 0;
  const isWInL = isInLanguage(wVal, language);

  const pumpedString = xVal + yVal.repeat(iNum) + zVal;
  const isPumpedInL = isInLanguage(pumpedString, language);

  const validationErrors = [];
  if (!isWInL) validationErrors.push(`'w' (${wVal}) is not in the language L.`);
  if (!isLengthValid) validationErrors.push(`|w| (${wVal.length}) must be ≥ p (${p}).`);
  if (!isConcatValid) validationErrors.push(`x + y + z (${xVal + yVal + zVal}) does not equal w (${wVal}).`);
  if (!isXYValid) validationErrors.push(`|xy| (${(xVal + yVal).length}) must be ≤ p (${p}).`);
  if (!isYValid) validationErrors.push(`|y| must be > 0.`);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-primary text-text-main flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-mono tracking-tight mb-2 text-accent-main">
            Pumping Lemma Analyzer
          </h2>
          <p className="text-sm text-text-muted">
            Proving a language is non-regular via contradiction.
          </p>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
          <h3 className="font-bold border-b border-border-subtle pb-2">1. The Theorem Conditions</h3>
          <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
            <li>For any regular language <span className="font-mono text-accent-light">L</span>, there exists a pumping length <span className="font-mono text-accent-light">p ≥ 1</span>.</li>
            <li>For any string <span className="font-mono text-accent-light">w ∈ L</span> with <span className="font-mono text-accent-light">|w| ≥ p</span>, <span className="font-mono text-accent-light">w</span> can be split into <span className="font-mono text-accent-light">w = xyz</span> such that:</li>
            <ul className="pl-6 space-y-1 mt-1 font-mono text-xs text-text-main">
              <li>1. |y| &gt; 0</li>
              <li>2. |xy| ≤ p</li>
              <li>3. ∀ i ≥ 0, xyⁱz ∈ L</li>
            </ul>
          </ul>
        </div>

        
        {!isSimulating ? (
          <div className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm text-center flex flex-col items-center justify-center py-12">
             <div className="w-16 h-16 rounded-full bg-accent-main/10 text-accent-main flex items-center justify-center mb-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <h3 className="font-bold text-lg mb-2">Ready to Validate</h3>
             <p className="text-sm text-text-muted max-w-md mx-auto">Fill in the options on the sidebar and click <strong>Run Simulator</strong> at the top right to validate your choices and see the pumping contradiction.</p>
          </div>
        ) : (
          <>
        <div className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
          <h3 className="font-bold border-b border-border-subtle pb-2">2. Your Validations</h3>
          
          <div className="space-y-3">
            <ValidationRow 
              label="w ∈ L" 
              isValid={isWInL} 
              desc={`Is '${wVal}' in the target language?`} 
            />
            <ValidationRow 
              label="|w| ≥ p" 
              isValid={isLengthValid} 
              desc={`${wVal.length} ≥ ${pNum}`} 
            />
            <ValidationRow 
              label="w = xyz" 
              isValid={isConcatValid} 
              desc={`'${x}' + '${y}' + '${z}' == '${wVal}'`} 
            />
            <ValidationRow 
              label="|y| > 0" 
              isValid={isYValid} 
              desc={`${yVal.length} > 0`} 
            />
            <ValidationRow 
              label="|xy| ≤ p" 
              isValid={isXYValid} 
              desc={`${(xVal + yVal).length} ≤ ${pNum}`} 
            />
          </div>

          {validationErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <div className="font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Validation Errors:</div>
              <ul className="list-disc list-inside">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              <div className="mt-2 text-xs italic text-text-muted">Please fix these in the sidebar before proceeding with the pump.</div>
            </div>
          )}
        </div>

        {validationErrors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-secondary p-6 rounded-xl border border-border-subtle shadow-sm space-y-6"
          >
            <h3 className="font-bold border-b border-border-subtle pb-2">3. The Pump (i = {iNum})</h3>
            
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="font-mono text-lg text-center break-all">
                <span className="text-text-muted">xy<sup className="text-accent-main">{iNum}</sup>z = </span>
                <span className="text-blue-400">{xVal}</span>
                <span className="text-accent-main font-bold">
                  {yVal.repeat(iNum)}
                </span>
                <span className="text-emerald-400">{zVal}</span>
              </div>
              <div className="text-xs text-text-muted uppercase tracking-widest mt-2 border-t border-border-subtle pt-2 w-full text-center">
                Pumped String: <span className="font-mono text-text-main ml-2">{pumpedString === '' ? 'ε (Empty String)' : pumpedString}</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg flex items-start gap-3 ${!isPumpedInL ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {!isPumpedInL ? (
                <>
                  <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base mb-1">Contradiction Reached!</h4>
                    <p className="text-sm">The pumped string <strong>{pumpedString}</strong> is NOT in the language L. Since the lemma states it must be in L for all i ≥ 0, this proves by contradiction that the language is <strong>NOT REGULAR</strong>.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base mb-1">String remains in Language</h4>
                    <p className="text-sm">The pumped string is still in L. Try pumping a different value of <strong>i</strong> (or picking a different w, x, y, z partition) to find the contradiction.</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

const ValidationRow = ({ label, isValid, desc }: { label: string, isValid: boolean, desc: string }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      {isValid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
      <span className="font-mono font-bold text-text-main">{label}</span>
    </div>
    <span className="text-text-muted text-xs font-mono">{desc}</span>
  </div>
);
