import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Settings, Save, CheckCircle2, ShieldCheck, AlertCircle, Palette, Sparkles, Scale } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const [brandName, setBrandName] = useState('MEGAMIND PLUS');
  const [subBrand, setSubBrand] = useState('IELTS MOCK TEST');
  const [tagline, setTagline] = useState('Practice Like the Real Test. Perform With Confidence.');
  const [primaryColor, setPrimaryColor] = useState('#C7202D');
  const [roundingMode, setRoundingMode] = useState('standard');
  const [registrationEnabled, setRegistrationEnabled] = useState('true');
  const [maintenanceMode, setMaintenanceMode] = useState('false');
  const [contactEmail, setContactEmail] = useState('support@megamindplus.com');
  const [contactPhone, setContactPhone] = useState('+880 1700-000000');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await api.getSettings();
        const s = res.settings || {};
        if (s.brand_name) setBrandName(s.brand_name);
        if (s.sub_brand) setSubBrand(s.sub_brand);
        if (s.tagline) setTagline(s.tagline);
        if (s.primary_color) setPrimaryColor(s.primary_color);
        if (s.rounding_mode) setRoundingMode(s.rounding_mode);
        if (s.registration_enabled) setRegistrationEnabled(s.registration_enabled);
        if (s.maintenance_mode) setMaintenanceMode(s.maintenance_mode);
        if (s.contact_email) setContactEmail(s.contact_email);
        if (s.contact_phone) setContactPhone(s.contact_phone);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);

      await api.saveSettings({
        brand_name: brandName,
        sub_brand: subBrand,
        tagline: tagline,
        primary_color: primaryColor,
        rounding_mode: roundingMode,
        registration_enabled: registrationEnabled,
        maintenance_mode: maintenanceMode,
        contact_email: contactEmail,
        contact_phone: contactPhone
      });

      setSuccessMsg('System settings and scoring configuration saved successfully.');
      setSaving(false);
    } catch (err) {
      alert(err.message || 'Failed to save settings.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
            Configuration
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Settings className="w-6 h-6 text-megamind-400" />
            Platform & Scoring Settings
          </h1>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Identity Settings */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Palette className="w-4 h-4 text-megamind-400" />
            Brand Identity & Positioning
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Brand Name</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sub-Brand Name</label>
              <input
                type="text"
                required
                value={subBrand}
                onChange={(e) => setSubBrand(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tagline</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Support Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Scoring Engine & Rounding Settings */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Scale className="w-4 h-4 text-megamind-400" />
            IELTS Scoring & Rounding Rule Engine
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Overall Band Rounding Algorithm
              </label>
              <select
                value={roundingMode}
                onChange={(e) => setRoundingMode(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
              >
                <option value="standard">Standard IELTS Rule (.25 & .75 Round Up)</option>
                <option value="exact">Exact Mathematical Average (Single Decimal)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard: 6.25 -&gt; 6.5, 6.75 -&gt; 7.0, 6.125 -&gt; 6.0
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Public Student Registration
              </label>
              <select
                value={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
              >
                <option value="true">Enabled (Open to Public)</option>
                <option value="false">Disabled (Invite Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
