import React, { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, CheckCircle2, UploadCloud } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface KycModalProps {
  isVerified: boolean;
  onVerify: () => void;
  onClose: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({
  isVerified,
  onVerify,
  onClose,
}) => {
  const [docType, setDocType] = useState('id_card');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onVerify();
      alert('Verification documents approved! Your account is now verified.');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900">KYC Verification</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {isVerified ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Identity Verified</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Your TradoWix profile is fully verified with unrestricted trading, deposits, and withdrawal privileges.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                Complete rapid ID verification to unlock real-money automated withdrawals.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Document Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'id_card', label: 'National ID' },
                    { id: 'passport', label: 'Passport' },
                    { id: 'license', label: 'Driver License' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDocType(d.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        docType === d.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700 block">Click to upload document front & back</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">JPG, PNG or PDF (Max 10MB)</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying details...</span>
                  </>
                ) : (
                  <span>Verify Account Now</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
