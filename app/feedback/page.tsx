"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "fehler", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Hier später z.B. Supabase-Eintrag oder E-Mail-Versand
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Danke für dein Feedback!</h2>
          <p className="text-gray-500 text-sm">Wir nehmen uns deine Nachricht zu Herzen und melden uns falls nötig.</p>
          <button
            onClick={() => { setSent(false); setForm({ name: "", email: "", type: "fehler", message: "" }); }}
            className="mt-6 text-blue-600 text-sm hover:underline"
          >
            Weiteres Feedback senden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback</h1>
        <p className="text-gray-500 mb-8">Fehler gefunden, eine Toilette vermisst oder einen Verbesserungsvorschlag? Schreib uns!</p>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Optional"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Optional"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Art des Feedbacks</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="fehler">🐛 Fehler melden</option>
                <option value="neu">📍 Neue Toilette vorschlagen</option>
                <option value="verbesserung">💡 Verbesserungsvorschlag</option>
                <option value="sonstiges">💬 Sonstiges</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Deine Nachricht..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Feedback absenden
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
