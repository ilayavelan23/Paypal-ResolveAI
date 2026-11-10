import React, { useState } from 'react';
import {
  User,
  ExternalLink,
  ShieldCheck,
  Bell,
  Database,
  Sliders,
  Info,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Camera,
  ChevronRight,
  Plus,
  Lock,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUser,
    sandboxConfig,
    toggleSandboxConnection,
    conversations,
    selectConversation,
    startNewConversation,
    navigateTo,
    showToast
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'profile' | 'paypal' | 'security' | 'notifications' | 'privacy' | 'preferences' | 'conversations'
  >('overview');

  const [copiedClientId, setCopiedClientId] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [accountTypeInput, setAccountTypeInput] = useState(user.accountType);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [themePreference, setThemePreference] = useState(user.theme);

  const handleCopyClientId = () => {
    navigator.clipboard?.writeText(sandboxConfig.clientId);
    setCopiedClientId(true);
    showToast('Sandbox Client ID copied!');
    setTimeout(() => setCopiedClientId(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
      accountType: accountTypeInput as any
    });
    setActiveSection('overview');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Settings Navigation Menu */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-3 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'overview' ? 'bg-[#0070BA] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Settings Hub
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'profile' ? 'bg-[#0070BA] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account & Profile</span>
          </button>
          <button
            onClick={() => setActiveSection('paypal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'paypal' ? 'bg-[#0070BA] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="font-serif font-black italic">PP</span>
            <span>PayPal Connection</span>
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'security' ? 'bg-[#0070BA] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & 2FA</span>
          </button>
          <button
            onClick={() => setActiveSection('conversations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'conversations' ? 'bg-[#0070BA] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Saved Conversations</span>
          </button>
        </div>
      </div>

      {/* VIEW: OVERVIEW (matching Top of Image 3) */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/60 p-6 border border-blue-150/70 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your ResolveAI Account</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage your profile, connections, security, and app preferences.
              </p>
            </div>
            <div className="hidden sm:block text-blue-600 font-serif font-black italic text-4xl opacity-75">
              PP
            </div>
          </div>

          {/* 6 Quick-Access Cards matching Image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Account & Profile */}
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0070BA] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {user.avatarInitials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Account
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('profile')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0070BA] bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* 2. PayPal Connection */}
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070BA] font-black italic text-lg flex items-center justify-center shadow-xs">
                  P
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">PayPal Connection</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                    {sandboxConfig.connected ? 'Sandbox: Connected' : 'Disconnected'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Last synced: {sandboxConfig.lastSync}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('paypal')}
                className="px-3 py-1.5 text-xs font-semibold text-[#0070BA] hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Security */}
            <div
              onClick={() => setActiveSection('security')}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Security</h3>
                  <p className="text-xs text-slate-500">Password, 2FA and login activity</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  2FA Enabled
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* 4. Notifications */}
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <p className="text-xs text-slate-500">Payment, fraud and dispute alerts</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNotifications(!notifications);
                  updateUser({ notificationsEnabled: !notifications });
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications ? 'bg-[#0070BA]' : 'bg-slate-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notifications ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* 5. Data & Privacy */}
            <div
              onClick={() => showToast('Data exported in JSON format.')}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Data & Privacy</h3>
                  <p className="text-xs text-slate-500">Manage your data, export or delete</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 6. Preferences */}
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Preferences</h3>
                  <p className="text-xs text-slate-500">AI behavior, language and theme</p>
                </div>
              </div>
              {/* Theme Segmented Control */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
                {(['Light', 'System', 'Dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setThemePreference(t);
                      updateUser({ theme: t });
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      themePreference === t ? 'bg-[#0070BA] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PROFILE (matching Bottom 1st of Image 3) */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 max-w-2xl">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#0070BA] text-white font-bold text-xl flex items-center justify-center shadow-md">
                {user.avatarInitials}
              </div>
              <button className="absolute bottom-0 right-0 p-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs hover:bg-slate-50">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.email}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
                />
                <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Type</label>
              <select
                value={accountTypeInput}
                onChange={(e) => setAccountTypeInput(e.target.value as any)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
              >
                <option value="Personal Account">Personal Account</option>
                <option value="Premier Account">Premier Account</option>
                <option value="Business Account">Business Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0070BA]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0070BA] text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: PAYPAL CONNECTION (matching Bottom 2nd of Image 3) */}
      {activeSection === 'paypal' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 max-w-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Connected to PayPal (Sandbox)</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  sandboxConfig.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {sandboxConfig.connected ? 'Connected' : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Linked on {sandboxConfig.linkedDate} | Last sync: {sandboxConfig.lastSync}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Connection Details</h4>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="py-3 flex justify-between">
                <span className="text-slate-500">Environment</span>
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{sandboxConfig.environment}</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-500">Client ID</span>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-800">
                  <span>{sandboxConfig.clientId.slice(0, 8)}...{sandboxConfig.clientId.slice(-4)}</span>
                  <button onClick={handleCopyClientId} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                    {copiedClientId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">Active</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-500">Permissions</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {sandboxConfig.permissions.map((p, i) => (
                    <span key={i} className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => toggleSandboxConnection(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reconnect</span>
            </button>
            <button
              onClick={() => toggleSandboxConnection(!sandboxConfig.connected)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
            >
              {sandboxConfig.connected ? 'Disconnect' : 'Connect Sandbox'}
            </button>
          </div>
        </div>
      )}

      {/* VIEW: SECURITY (matching Bottom 3rd of Image 3) */}
      {activeSection === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 max-w-2xl space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Security & Authentication</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your password, two-factor authentication, and login activity</p>
          </div>

          <div className="space-y-4">
            {/* Password */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Password
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Update your account password regularly for better security.</p>
              </div>
              <button
                onClick={() => showToast('Password change email sent.')}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
              >
                Change Password
              </button>
            </div>

            {/* 2FA */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Two-Factor Authentication (2FA)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Enabled</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
              </div>
              <button
                onClick={() => {
                  setTwoFactor(!twoFactor);
                  updateUser({ twoFactorEnabled: !twoFactor });
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  twoFactor ? 'bg-[#0070BA]' : 'bg-slate-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  twoFactor ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Active Sessions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Active Sessions</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Manage devices that are currently signed in.</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1 Active Session
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SAVED CONVERSATIONS (matching Bottom 4th of Image 3) */}
      {activeSection === 'conversations' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 max-w-3xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Conversations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your saved AI conversations with ResolveAI</p>
            </div>
            <button
              onClick={() => {
                startNewConversation();
                navigateTo('ai-assistant');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0070BA] text-white hover:bg-blue-700 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Conversation</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  selectConversation(conv.id);
                  navigateTo('ai-assistant');
                }}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{conv.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{conv.preview}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{conv.timestamp}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
