"use client";

import { auth } from "@/lib/firebase";

export default function TestFirebasePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-4xl mb-4">🔥</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Firebase Connected Successfully
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          project: <span className="font-mono text-slate-700">mba-learning-hub</span>
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm font-mono space-y-2">
          <div>
            <span className="text-slate-400">auth initialized: </span>
            <span className="text-emerald-600 font-semibold">{JSON.stringify(!!auth)}</span>
          </div>
          <div>
            <span className="text-slate-400">auth.app.name: </span>
            <span className="text-slate-700">{auth.app.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
