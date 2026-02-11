
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save, User, Loader2, Check, Mail, GraduationCap, BookOpen, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserProfile, Theme } from '../types';

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
  const [photoUrl, setPhotoUrl] = useState(userProfile.photoUrl || userProfile.photo_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Get username from userProfile (it's stored in localStorage)
  const storedUser = localStorage.getItem('user');
  let username = 'N/A';
  let userId = '';
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      username = userData.username || 'N/A';
      userId = userData.id;
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== username) return;

    setIsSaving(true);
    try {
      // Delete user's photo if exists
      if (userProfile.photo_url) {
        const fileName = userProfile.photo_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('user-photos')
            .remove([`avatars/${fileName}`]);
        }
      }

      // Delete user record
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('username', username);

      if (error) throw error;

      // Log out
      await onLogout();
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setName(userProfile.name);
    setPhotoUrl(userProfile.photoUrl || userProfile.photo_url || '');
  }, [userProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

    // Placeholder for future database integration
    setTimeout(() => {
      const updatedProfile: UserProfile = {
        ...userProfile,
        name: name.trim(),
        photoUrl: photoUrl,
        photo_url: photoUrl,
      };
      onSave(updatedProfile);
      setIsSaving(false);
      setShowSuccess(true);
      setSelectedFile(null);
      setIsEditingPersonal(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 500);
  };

  if (!isOpen) return null;

  // Username and ID are now handled at the top of the component

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl transition-all duration-500 animate-in zoom-in slide-in-from-bottom-8
          ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
      >
        {/* Header with Profile */}
        <div className={`p-8 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between mb-6">
            <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Settings
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className={`w-24 h-24 rounded-[28px] overflow-hidden border-4 shadow-xl transition-all duration-500 group-hover:scale-105
                ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-white'}`}
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-3xl font-bold ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                    {getInitials(name)}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera size={20} className="mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Change</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white p-2 rounded-xl shadow-xl">
                <Camera size={16} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {name}
              </h3>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-orange-500' : 'text-orange-600'}`}>
                {userProfile.role === 'admin' ? 'Admin' : 'Student'}
              </p>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                {userProfile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Personal Information
            </h3>
            {!isEditingPersonal && (
              <button
                onClick={() => setIsEditingPersonal(true)}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-all active:scale-95 shadow-lg shadow-orange-900/20"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Full Name
              </label>
              {isEditingPersonal ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-semibold
                    ${isDark
                      ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-orange-500/50'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-orange-500'}`}
                />
              ) : (
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'}`}>
                  {name}
                </div>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Username
              </label>
              <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700'}`}>
                {username}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Email Address
              </label>
              <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700'}`}>
                {userProfile.email}
              </div>
            </div>

            {/* Student ID */}
            {userProfile.student_id && (
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Student ID
                </label>
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700'}`}>
                  {userProfile.student_id}
                </div>
              </div>
            )}

            {/* Grade/Section */}
            {userProfile.grade_section && (
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Grade / Year & Section
                </label>
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700'}`}>
                  {userProfile.grade_section}
                </div>
              </div>
            )}

            {/* Course */}
            {userProfile.course && (
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Course
                </label>
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700'}`}>
                  {userProfile.course}
                </div>
              </div>
            )}

            {/* User Role */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                User Role
              </label>
              <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700'}`}>
                {userProfile.role === 'admin' ? 'Admin' : 'Student'}
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-8 border-t border-red-500/10 bg-red-500/5">
          <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
            <ShieldAlert size={20} />
            Danger Zone
          </h3>
          <div className="flex items-center justify-between p-4 rounded-2xl border border-red-500/10 bg-red-500/5">
            <div>
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Account</h4>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Permanently delete your account and all of your content.
              </p>
            </div>
            <button
              onClick={() => setIsDeleting(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-900/20"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-8 pt-4 flex gap-3 border-t ${isDark ? 'border-white/10 bg-zinc-800/30' : 'border-gray-200 bg-gray-50/50'}`}>
          <button
            onClick={onClose}
            className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              setIsLoggingOut(true);
              try {
                await onLogout();
                onClose();
              } catch (error) {
                console.error('Error during logout:', error);
                setIsLoggingOut(false);
              }
            }}
            disabled={isLoggingOut}
            className="flex-1 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>

          {isEditingPersonal && (
            <button
              onClick={handleSave}
              disabled={isSaving || showSuccess}
              className={`flex-[2] flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-xl disabled:opacity-70
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
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl ${isDark ? 'bg-zinc-900 border-red-500/20' : 'bg-white border-red-200'}`}>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <ShieldAlert size={32} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Account?</h3>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Type <span className="text-red-500">{username}</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-semibold
                    ${isDark
                      ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-red-500/50'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-red-500'}`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsDeleting(false);
                    setDeleteConfirmation('');
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== username || isSaving}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsModal;
