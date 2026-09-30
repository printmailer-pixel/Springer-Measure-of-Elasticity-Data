import React, { useState } from 'react';
import { AppState, DemographicsData } from './types';
import {
  SPRINGER_STATEMENT,
  SPRINGER_QUESTIONS,
  getSpringerOptions,
  getTierForScore,
  SCORING_TIERS,
  RESOURCES
} from './data';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Mail,
  Copy,
  CheckCheck,
  Printer,
  RefreshCw,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react';

declare global {
  interface Window {
    TEST?: boolean;
    WEBHOOK_URL?: string;
  }
}

const INITIAL_DEMOGRAPHICS: DemographicsData = {
  callSign: '',
  email: '',
  age: '',
  gender: '',
  role: '',
  status: '',
  years: '',
  leadership: '',
  military: '',
  setting: ''
};

const INITIAL_STATE: AppState = {
  demographics: INITIAL_DEMOGRAPHICS,
  springer: {}
};

export default function App() {
  const [step, setStep] = useState(0); // 0: Intro, 1: Demographics, 2: Measure, 3: Results
  const [data, setData] = useState<AppState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showDevAlert, setShowDevAlert] = useState(false);

  const updateDemographics = (values: Partial<DemographicsData>) => {
    setData(prev => ({
      ...prev,
      demographics: { ...prev.demographics, ...values }
    }));
  };

  const updateSpringer = (index: number, val: number) => {
    setData(prev => ({
      ...prev,
      springer: { ...prev.springer, [index]: val }
    }));
  };

  const nextStep = () => {
    setStep(s => s + 1);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const prevStep = () => {
    setStep(s => Math.max(0, s - 1));
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const restartAssessment = () => {
    setData(INITIAL_STATE);
    setStep(0);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const preloadMockData = (targetStep: number = 1) => {
    setData({
      demographics: {
        callSign: 'Kestrel528',
        email: 'test@example.com',
        age: '42',
        gender: 'Male',
        role: 'Fire service',
        status: 'Active',
        years: '11–20',
        leadership: 'Supervisor',
        military: 'Veteran',
        setting: 'Suburban'
      },
      springer: {
        0: 2,
        1: 3,
        2: 2,
        3: 3,
        4: 2,
        5: 3,
        6: 2,
        7: 3,
        8: 2,
        9: 2,
        10: 2,
        11: 3
      }
    });
    setStep(targetStep);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  // Compute Springer Score (sum of all answered items)
  const springerScore = Object.values(data.springer).reduce(
    (sum: number, val: any) => sum + Number(val),
    0
  ) as number;
  const currentTier = getTierForScore(springerScore);

  const handleSubmit = async () => {
    const alertMessage =
      "The project is still in development. Once the form design is reviewed please feedback to developer (make better).";

    // Trigger browser alert (if supported and allowed in current context)
    try {
      window.alert(alertMessage);
    } catch {
      // Ignored if window.alert is blocked in the iframe
    }

    // Always trigger the modal alert and return without submitting
    setShowDevAlert(true);
    return;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('Doc@thinlineadvisory.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Brand Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ThinLineLogo />
            <div>
              <div className="text-xs font-black tracking-widest text-slate-800 uppercase">
                Thin Line Advisory
              </div>
              <div className="text-[11px] font-semibold text-rose-700 tracking-wider uppercase">
                Springer Measure of Elasticity
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => preloadMockData(2)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Preload mock data and jump directly to Measure screen"
            >
              ⚡ Preload Mock Data
            </button>
            {data.demographics.callSign && (
              <div className="hidden sm:flex items-center text-xs font-semibold px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-700">
                <span className="text-slate-400 mr-1.5">ID:</span>
                <span className="font-mono text-slate-900 font-bold">{data.demographics.callSign}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {step === 0 && (
          <IntroScreen
            nextStep={nextStep}
            preloadMock={(s?: number) => preloadMockData(s ?? 1)}
          />
        )}

        {step === 1 && (
          <DemographicsScreen
            data={data.demographics}
            updateData={updateDemographics}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 2 && (
          <MeasureScreen
            data={data.springer}
            updateSpringer={updateSpringer}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <ResultsScreen
            score={springerScore}
            tier={currentTier}
            data={data}
            handleCopyEmail={handleCopyEmail}
            copiedEmail={copiedEmail}
            restart={restartAssessment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-slate-500 border-t border-slate-200 mt-10 print:hidden">
        <p className="font-medium text-slate-600">
          Springer Measure of Elasticity (SME); 2025. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Confidential self-assessment for first responders and operational personnel.
        </p>
      </footer>

      {/* Development Alert Modal */}
      {showDevAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 mb-1">
                  Development Notice
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Form In Development
                </h3>
              </div>
            </div>

            <div className="p-4 bg-amber-50/90 rounded-xl border border-amber-200 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
              The project is still in development. Once the form design is reviewed please feedback to developer (make better).
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Returned without submitting so you can review and inspect the questions, layout, and scoring design. No live data was submitted.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowDevAlert(false)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Return to Form (Without Submitting)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDevAlert(false);
                  setStep(3);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                }}
                className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Preview Results Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   COMPONENTS
   ========================================================================= */

function ThinLineLogo() {
  return (
    <div className="w-8 h-8 flex-shrink-0 relative flex items-center justify-center">
      {/* Stylized geometric star emblem matching Thin Line Advisory */}
      <svg viewBox="0 0 100 100" className="w-8 h-8 text-rose-800 drop-shadow-xs" fill="currentColor">
        <polygon points="50,5 61,38 95,38 68,59 79,95 50,72 21,95 32,59 5,38 39,38" fill="#991B1B" />
        <polygon points="50,5 50,72 79,95 68,59 95,38 61,38" fill="#B91C1C" />
      </svg>
    </div>
  );
}

function IntroScreen({
  nextStep,
  preloadMock
}: {
  nextStep: () => void;
  preloadMock: (step?: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden animate-in fade-in duration-300">
      {/* Crimson Banner from PDF header */}
      <div className="bg-rose-900 text-white px-6 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Activity className="w-5 h-5 text-rose-300" />
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
            Elasticity: A Self-Assessment
          </span>
        </div>
        <span className="text-[11px] tracking-wider font-semibold text-rose-200 uppercase">
          Thin Line Advisory
        </span>
      </div>

      <div className="p-6 sm:p-10 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Springer Measure of Elasticity (SME)
          </h1>
          <p className="text-rose-800 font-semibold text-sm sm:text-base mt-1">
            A confidential, direct assessment for first responders
          </p>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
          <p>
            How many times have you been asked to fill out forms – and been given no feedback at all?
          </p>
          <div className="p-4 bg-slate-50 border-l-4 border-rose-800 rounded-r-xl">
            <p className="text-slate-800 font-medium">
              Maybe your results were used to inform a mental health provider about your symptoms, or were captured for research, and NO ONE gave you feedback on your results and what they mean.{' '}
              <strong className="text-rose-950 font-black tracking-wide">THIS IS NOT THAT.</strong>
            </p>
          </div>
          <p>
            This assessment is designed to give both of us private, useful insight into challenges you may be facing right now.
          </p>
          <p>
            If you meet with me or my team, we can talk through your results—you can share them with us or give us your unique call sign so we can look them up. Let’s drop in…
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap gap-3">
          <button
            onClick={nextStep}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-rose-900 text-white hover:bg-rose-950 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            Let's drop in <ChevronRight className="w-5 h-5 ml-2" />
          </button>

          <button
            onClick={() => preloadMock(1)}
            className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
            title="Preload mock data and view demographics form"
          >
            ⚡ Preload Mock Data (Step 1)
          </button>

          <button
            onClick={() => preloadMock(2)}
            className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors cursor-pointer shadow-xs"
            title="Preload mock data and go straight to Measure screen (ready to test submit)"
          >
            🎯 Preload & Jump to Measure (Ready to Submit)
          </button>
        </div>
      </div>
    </div>
  );
}

function DemographicsScreen({
  data,
  updateData,
  nextStep,
  prevStep
}: {
  data: DemographicsData;
  updateData: (v: Partial<DemographicsData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}) {
  // Required fields: callSign, email, age, role, status, years, leadership, military, setting
  // Gender is explicitly optional per instructions!
  const isComplete = Boolean(
    data.callSign.trim() &&
    data.email.trim() &&
    data.age.trim() &&
    data.role &&
    data.status &&
    data.years &&
    data.leadership &&
    data.military &&
    data.setting
  );

  const handleRadioSelect = (field: keyof DemographicsData, nextElementId?: string) => (value: string) => {
    updateData({ [field]: value });
    if (nextElementId) {
      setTimeout(() => {
        const nextElem = document.getElementById(nextElementId);
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="bg-rose-900 text-white px-6 sm:px-8 py-3.5 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
          Step 1: Background & Identifier
        </span>
        <span className="text-xs text-rose-200 font-medium">Confidential</span>
      </div>

      <div className="p-6 sm:p-10 space-y-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Getting Started</h2>
          <p className="text-slate-600 text-sm mt-1">
            Please fill out your background details. This information helps us understand your context.
          </p>
        </div>

        {/* 1) Identifier */}
        <div id="field-identifier" className="space-y-3">
          <label className="block text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase">
            1) Identifier
          </label>
          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
            You can either share your actual name, make up a name, or enter a very unique{' '}
            <strong className="text-rose-900 font-bold">"CALL SIGN"</strong> - something like{' '}
            <span className="font-mono font-bold text-rose-950">"Kestrel528"</span> not something like{' '}
            <span className="italic text-slate-500">"Maverick."</span> Your chosen identifier will allow my team to review your data with you if you'd like.
          </div>
          <input
            type="text"
            value={data.callSign}
            onChange={e => updateData({ callSign: e.target.value })}
            placeholder='Your name or unique Call Sign (e.g. Kestrel528)'
            className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:border-rose-800 focus:bg-white focus:ring-4 focus:ring-rose-800/10 outline-none transition-all"
          />
        </div>

        {/* 2) Email address */}
        <div id="field-email" className="space-y-3">
          <label className="block text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase">
            2) Email address
          </label>
          <p className="text-xs sm:text-sm text-slate-600 italic">
            (feel free to use a non-work email address for privacy. This will allow us to directly send your results to you.)
          </p>
          <input
            type="email"
            value={data.email}
            onChange={e => updateData({ email: e.target.value })}
            placeholder="Email address (e.g. personal@gmail.com)"
            className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:border-rose-800 focus:bg-white focus:ring-4 focus:ring-rose-800/10 outline-none transition-all"
          />
        </div>

        {/* 3) Current age */}
        <div id="field-age" className="space-y-3">
          <label className="block text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase">
            3) Current age
          </label>
          <input
            type="number"
            min="18"
            max="100"
            value={data.age}
            onChange={e => updateData({ age: e.target.value })}
            placeholder="Your age"
            className="w-full sm:w-48 p-4 bg-slate-50 border-2 border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:border-rose-800 focus:bg-white focus:ring-4 focus:ring-rose-800/10 outline-none transition-all"
          />
        </div>

        {/* 4) Gender identity (Optional) */}
        <div id="field-gender">
          <RadioSection
            label="4) Gender identity (Optional)"
            subtext="Feel free to leave blank or select an option."
            options={['Male', 'Female', 'Other designation']}
            value={data.gender}
            onChange={handleRadioSelect('gender', 'field-role')}
            isOptional={true}
            onClear={() => updateData({ gender: '' })}
          />
        </div>

        {/* 5) Primary role */}
        <div id="field-role">
          <RadioSection
            label="5) Primary role"
            options={[
              'Law enforcement',
              'Fire service',
              'EMS',
              'Emergency communications/dispatch',
              'Corrections',
              'Military (active duty)',
              'Veteran',
              'Other'
            ]}
            value={data.role}
            onChange={handleRadioSelect('role', 'field-status')}
          />
        </div>

        {/* 6) Current status */}
        <div id="field-status">
          <RadioSection
            label="6) Current status"
            options={['Active', 'Retired', 'Former', 'Reserve/National Guard']}
            value={data.status}
            onChange={handleRadioSelect('status', 'field-years')}
          />
        </div>

        {/* 7) Years of service */}
        <div id="field-years">
          <RadioSection
            label="7) Years of service"
            options={['<5', '5–10', '11–20', '21+']}
            value={data.years}
            onChange={handleRadioSelect('years', 'field-leadership')}
          />
        </div>

        {/* 8) Leadership level */}
        <div id="field-leadership">
          <RadioSection
            label="8) Leadership level"
            options={[
              'Frontline/member',
              'Supervisor',
              'Manager/command staff',
              'Executive leadership'
            ]}
            value={data.leadership}
            onChange={handleRadioSelect('leadership', 'field-military')}
          />
        </div>

        {/* 9) Military service */}
        <div id="field-military">
          <RadioSection
            label="9) Military service"
            options={['Never served', 'Active duty', 'Reserve/Guard', 'Veteran']}
            value={data.military}
            onChange={handleRadioSelect('military', 'field-setting')}
          />
        </div>

        {/* 10) Current geographic setting (skipping 11 Combat and 12 Org Type) */}
        <div id="field-setting">
          <RadioSection
            label="10) Current geographic setting"
            options={['Urban', 'Suburban', 'Rural']}
            value={data.setting}
            onChange={(val: string) => updateData({ setting: val })}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="pt-8 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-between gap-4">
          <button
            onClick={prevStep}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-bold bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 mr-1.5" /> Back
          </button>

          <button
            onClick={nextStep}
            disabled={!isComplete}
            className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-md cursor-pointer ${
              isComplete
                ? 'bg-rose-900 text-white hover:bg-rose-950 hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Continue to Measure <ChevronRight className="w-5 h-5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MeasureScreen({
  data,
  updateSpringer,
  handleSubmit,
  prevStep,
  isSubmitting
}: {
  data: Record<string, number | string>;
  updateSpringer: (index: number, val: number) => void;
  handleSubmit: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}) {
  const answeredCount = SPRINGER_QUESTIONS.filter((_, i) => data[i] !== undefined).length;
  const isComplete = answeredCount === SPRINGER_QUESTIONS.length;

  const handleSelectOption = (qIndex: number, val: number) => {
    updateSpringer(qIndex, val);
    if (qIndex < SPRINGER_QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextElem = document.getElementById(`sme-q-${qIndex + 1}`);
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Measure Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        <div className="bg-rose-900 text-white px-6 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-rose-300" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
              Thin Line Advisory • Self-Assessment
            </span>
          </div>
          <span className="text-xs font-bold text-rose-200">
            {answeredCount} of {SPRINGER_QUESTIONS.length} Answered
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The Springer Measure of Elasticity
          </h2>
          <div className="p-4 bg-slate-50 border-l-4 border-rose-800 rounded-r-xl">
            <p className="text-slate-800 font-medium text-base sm:text-lg leading-relaxed">
              {SPRINGER_STATEMENT}
            </p>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-rose-800 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / SPRINGER_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* The 12 items */}
      <div className="space-y-5">
        {SPRINGER_QUESTIONS.map((q, i) => {
          const selectedValue = data[i];
          const options = getSpringerOptions(i);

          return (
            <div
              key={i}
              id={`sme-q-${i}`}
              className={`bg-white p-6 sm:p-7 rounded-2xl shadow-sm border transition-all duration-200 ${
                selectedValue !== undefined
                  ? 'border-slate-300/80 bg-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3 mb-5">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug pt-0.5">
                  {q}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {options.map(opt => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(i, opt.value)}
                      className={`p-3 sm:py-3.5 sm:px-2 rounded-xl border-2 text-xs sm:text-sm font-bold flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-900 bg-rose-900 text-white shadow-sm scale-[1.01]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="leading-tight">{opt.label}</span>
                      <span
                        className={`text-[10px] mt-1 font-mono font-bold ${
                          isSelected ? 'text-rose-200' : 'text-slate-400'
                        }`}
                      >
                        ({opt.value})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation & Submit */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col-reverse sm:flex-row justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-bold bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 mr-1.5" /> Back to Demographics
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-md cursor-pointer ${
            isComplete && !isSubmitting
              ? 'bg-rose-900 text-white hover:bg-rose-950 hover:shadow-lg active:scale-[0.99]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⏳</span> Submitting Assessment...
            </span>
          ) : (
            <span className="flex items-center">
              Submit Assessment ({answeredCount}/12) <Check className="w-5 h-5 ml-2" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({
  score,
  tier,
  data,
  handleCopyEmail,
  copiedEmail,
  restart
}: {
  score: number;
  tier: ReturnType<typeof getTierForScore>;
  data: AppState;
  handleCopyEmail: () => void;
  copiedEmail: boolean;
  restart: () => void;
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        <div className="bg-rose-900 text-white px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ThinLineLogo />
            <div>
              <div className="text-xs font-black tracking-widest uppercase">Thin Line Advisory</div>
              <div className="text-[11px] text-rose-200 uppercase font-semibold">Elasticity Self-Assessment Results</div>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center px-3 py-1.5 bg-rose-950/60 hover:bg-rose-950 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Save
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
                <Check className="w-3.5 h-3.5 mr-1" /> Assessment Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Elasticity Snapshot
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Completed for Identifier:{' '}
                <strong className="text-slate-800 font-mono">{data.demographics.callSign || 'Respondent'}</strong> •{' '}
                {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Score Pill */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl text-center flex-shrink-0 min-w-[160px] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                Total Score (12–60)
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {score}
              </div>
              <span className="text-xs font-bold text-rose-300 block mt-1">
                {tier.category}
              </span>
            </div>
          </div>

          {/* Visual Gauge Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Nervous System Regulation Scale</span>
              <span>Range: 12 to 60</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-5 rounded-lg overflow-hidden bg-slate-100 p-0.5">
              <div className="bg-emerald-500 rounded-l relative flex items-center justify-center" title="12-24: Well regulated">
                <span className="text-[10px] font-black text-white">12–24</span>
              </div>
              <div className="bg-amber-400 relative flex items-center justify-center" title="25-36: Mildly dysregulated">
                <span className="text-[10px] font-black text-white">25–36</span>
              </div>
              <div className="bg-orange-500 relative flex items-center justify-center" title="37-48: Moderately dysregulated">
                <span className="text-[10px] font-black text-white">37–48</span>
              </div>
              <div className="bg-rose-600 rounded-r relative flex items-center justify-center" title="49-60: Severely dysregulated">
                <span className="text-[10px] font-black text-white">49–60</span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold px-0.5">
              <span className="text-emerald-700">Well regulated</span>
              <span className="text-amber-700">Mildly</span>
              <span className="text-orange-700">Moderately</span>
              <span className="text-rose-700">Severely dysregulated</span>
            </div>
          </div>

          {/* Primary Result Box */}
          <div className={`p-6 sm:p-7 rounded-2xl border-2 ${tier.accentBorder} ${tier.bgLight} space-y-3`}>
            <div className="flex items-center space-x-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${tier.badgeBg} ${tier.badgeText}`}>
                {tier.label}: {tier.category}
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
              {tier.description}
            </p>
          </div>

          {/* Sidebar / Reach out Box from Page 3 */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-white">
                Want to “sidebar” about this or anything else we covered today?
              </h4>
              <p className="text-slate-300 text-sm">
                Dr. Springer and our advisory team are available to talk through your data privately.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <a
                href={`mailto:Doc@thinlineadvisory.com?subject=Springer%20Measure%20Results%20-%20${encodeURIComponent(data.demographics.callSign)}&body=Identifier:%20${encodeURIComponent(data.demographics.callSign)}%0AScore:%20${score}%20(${encodeURIComponent(tier.category)})`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 mr-2" /> Email Doc
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Copy email address"
              >
                {copiedEmail ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official SME Reference Scoring Table (Page 3 of Document) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Springer Measure of Elasticity — Scoring Reference
            </h3>
            <span className="text-xs font-mono text-slate-400 uppercase">SME 2025</span>
          </div>
          <p className="text-xs text-slate-500">
            Total score is calculated by summing your scores across all 12 items (Range: 12 to 60).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-20">Score</th>
                  <th className="py-3 px-3 w-40">Classification</th>
                  <th className="py-3 px-3">Clinical Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SCORING_TIERS.map(t => {
                  const isCurrent = t.label === tier.label;
                  return (
                    <tr
                      key={t.label}
                      className={isCurrent ? `${t.bgLight} font-medium` : 'hover:bg-slate-50/60'}
                    >
                      <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {t.label}
                        {isCurrent && (
                          <span className="ml-1 text-[10px] font-black text-rose-800 uppercase block sm:inline">
                            (You: {score})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${t.badgeBg} ${t.badgeText}`}>
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 leading-relaxed text-xs sm:text-sm">
                        {t.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resources & Support */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-rose-800" />
          <h3 className="text-lg font-bold text-slate-900">
            First Responder & Veteran Support Resources
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Confidential, specialized resources available 24/7.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {RESOURCES.map(res => (
            <a
              key={res.title}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-rose-900 flex items-center justify-between">
                  <span>{res.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-800 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {res.description}
                </p>
              </div>
              <span className="text-[11px] text-rose-700 font-mono mt-2 block truncate">
                {res.url.replace(/^https?:\/\//, '')}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Retake button (print hidden) */}
      <div className="flex justify-center pt-2 print:hidden">
        <button
          onClick={restart}
          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Start New Assessment
        </button>
      </div>
    </div>
  );
}

function RadioSection({
  label,
  subtext,
  options,
  value,
  onChange,
  isOptional = false,
  onClear
}: {
  label: string;
  subtext?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  isOptional?: boolean;
  onClear?: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase">
          {label}
        </label>
        {isOptional && value && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-slate-400 hover:text-rose-700 cursor-pointer"
          >
            Clear selection
          </button>
        )}
      </div>
      {subtext && <p className="text-xs text-slate-500 italic">{subtext}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map(opt => {
          const isSelected = value === opt;
          return (
            <label
              key={opt}
              className={`flex items-center p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-rose-900 bg-rose-900 text-white shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name={label}
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange(opt)}
              />
              <span className="text-sm sm:text-base font-bold select-none">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
