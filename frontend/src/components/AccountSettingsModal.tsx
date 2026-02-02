
import React, { useState, useRef } from 'react';
import { X, Camera, Save, User, Loader2, Check } from 'lucide-react';
import { UserProfile, Theme } from '../types';
import { supabase } from '../lib/supabase';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  theme: Theme;
  onLogout: () => Promise<void>;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
  theme,
  onLogout
}) => {
  const [name, setName] = useState(userProfile.name);
  const [photoUrl, setPhotoUrl] = useState(userProfile.photoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (n: string) => {
    return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Name cannot be empty");

    setIsSaving(true);
    try {
      console.log('[PROFILE SAVE] Starting profile update...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log('[PROFILE SAVE] Updating profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
        })
        .eq('id', user.id)
        .select();

      if (error) {
        console.error("[PROFILE SAVE] Supabase error:", error);
        throw error;
      }

      console.log("[PROFILE SAVE] Profile updated successfully:", data);

      // Update parent state
      onSave({
        ...userProfile,
        name: name.trim(),
        photoUrl: photoUrl,
        initials: getInitials(name.trim())
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error("[PROFILE SAVE] Failed:", err);
      alert(`Save failed: ${err.message || "Unknown error"}`);
      setIsSaving(false); // Reset spinner on error
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className={`w-full max-w-md overflow-hidden rounded-[40px] border shadow-2xl transition-all duration-500 animate-in zoom-in slide-in-from-bottom-8
          ${isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/90 border-white/40'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-6 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-500 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className={`w-32 h-32 rounded-[40px] overflow-hidden border-4 shadow-2xl transition-all duration-500 group-hover:scale-105 group-active:scale-95
                ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-white'}`}
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                    {getInitials(name)}
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera size={24} className="mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2.5 rounded-2xl shadow-xl">
                <Camera size={18} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <p className={`mt-6 text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
              Profile Photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className={`text-xs font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Full Name
              </label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-600 group-focus-within:text-blue-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full pl-12 pr-4 py-4 rounded-[20px] outline-none transition-all text-sm font-semibold
                    ${isDark
                      ? 'bg-white/5 border border-white/5 text-white focus:bg-white/10 focus:ring-4 focus:ring-orange-500/10'
                      : 'bg-gray-100 border border-transparent text-gray-900 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500'}`}
                />
              </div>
            </div>

            {/* READ-ONLY Student Information */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2 col-span-2">
                <label className={`text-xs font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Student ID
                </label>
                <div className={`w-full px-5 py-4 rounded-[20px] text-sm font-bold border ${isDark ? 'bg-white/5 border-white/5 text-zinc-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                  {userProfile.student_id || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Grade / Section
                </label>
                <div className={`w-full px-5 py-4 rounded-[20px] text-sm font-medium border ${isDark ? 'bg-white/5 border-white/5 text-zinc-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                  {userProfile.grade_section || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Course
                </label>
                <div className={`w-full px-5 py-4 rounded-[20px] text-sm font-medium border ${isDark ? 'bg-white/5 border-white/5 text-zinc-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                  {userProfile.course || "N/A"}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className={`text-xs font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Account Status
                </label>
                <div className={`w-full px-5 py-4 rounded-[20px] flex items-center gap-3 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  {(!userProfile.status || userProfile.status === 'active') && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                      <span className="text-sm font-bold text-green-500">Active</span>
                    </>
                  )}
                  {userProfile.status === 'fines' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      <span className="text-sm font-bold text-yellow-500">With Fines</span>
                    </>
                  )}
                  {userProfile.status === 'suspended' && (
                    <>
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      <span className="text-sm font-bold text-red-500">Suspended</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden technical field, kept for debug if needed but pushed down */}
            <div className="space-y-2 opacity-30 mt-4 hidden">
              <label className="text-[10px] uppercase font-bold">System ID</label>
              <input type="text" disabled value={userProfile.id} className="text-xs bg-transparent" />
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className={`p-8 pt-4 flex gap-3 transition-all duration-300 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50/50'}`}>
          <button
            onClick={onClose}
            className={`flex-1 py-4 rounded-[20px] font-bold text-sm transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              console.log('[MODAL] 🔴 Sign Out button clicked!');
              try {
                await onLogout();
                console.log('[MODAL] ✅ onLogout() completed');
              } catch (error) {
                console.error('[MODAL] ❌ Error during logout:', error);
              }
            }}
            className="flex-1 py-4 rounded-[20px] font-bold text-sm transition-all active:scale-95 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
          >
            Sign Out
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || showSuccess}
            className={`flex-[2] flex items-center justify-center gap-3 py-4 rounded-[20px] font-bold text-sm transition-all active:scale-95 shadow-xl disabled:opacity-70
              ${showSuccess
                ? 'bg-green-500 text-white shadow-green-900/20'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/40'}`}
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : showSuccess ? (
              <>
                <Check size={20} strokeWidth={3} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
