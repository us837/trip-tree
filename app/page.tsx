'use client';

import React, { useState, useEffect } from 'react';
import { encodeState, decodeState, UserProfile, LinkItem } from '../src/lib/encoder';
import { getBrandMeta } from '../src/lib/brandDetector';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Share2, 
  Check, 
  Layout, 
  User, 
  Link as LinkIcon 
} from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Jhon Doe',
  bio: 'Digital Creator & Tech Explorer | Building minimal web experiences.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  themeId: 'liquid-mesh',
  links: [
    { id: '1', title: 'Read my Medium stories', url: 'https://medium.com', enabled: true },
    { id: '2', title: 'Support on BuyMeACoffee', url: 'https://buymeacoffee.com', enabled: true },
    { id: '3', title: 'Digital Products on Gumroad', url: 'https://gumroad.com', enabled: true },
  ],
};

export default function TripTreeStudio() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isViewingMode, setIsViewingMode] = useState<boolean>(false);
  const [rawUrl, setRawUrl] = useState<string>('');
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Load state from URL Hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#data=', '');
      if (hash) {
        const decoded = decodeState(hash);
        if (decoded) {
          setProfile(decoded);
          setIsViewingMode(true);
        }
      }
    }
  }, []);

  // Link modification actions
  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'My New Link',
      url: 'https://',
      enabled: true,
    };
    setProfile((prev: UserProfile) => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string | boolean) => {
    setProfile((prev: UserProfile) => ({
      ...prev,
      links: prev.links.map((item: LinkItem) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeLink = (id: string) => {
    setProfile((prev: UserProfile) => ({
      ...prev,
      links: prev.links.filter((item: LinkItem) => item.id !== id),
    }));
  };

  // Instant Publish (Clean URL Generation without shortener)
  const handlePublish = () => {
    const rawHandle = profile.name || 'user';
    const userSlug = rawHandle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '');

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://triptree.ujwalsharma.space';
    const finalUrl = `${baseUrl}/${userSlug}`;

    setRawUrl(finalUrl);
    setShowPublishModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Published Page Viewer (When a user visits a generated hash link)
  if (isViewingMode) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${getThemeBackground(profile.themeId)}`}>
        <div className="w-full max-w-md mx-auto space-y-6 text-center">
          <img
            src={profile.avatarUrl || 'https://via.placeholder.com/150'}
            alt={profile.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-black/10 shadow-xl"
          />
          <div>
            <h1 className={`text-2xl font-bold ${getThemeTextColor(profile.themeId)}`}>
              {profile.name}
            </h1>
            <p className={`text-sm mt-1 ${getThemeBioColor(profile.themeId)}`}>
              {profile.bio}
            </p>
          </div>
          <div className="space-y-3 pt-2">
            {profile.links.filter((l: LinkItem) => l.enabled).map((link: LinkItem) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full p-4 font-medium transition-all duration-200 ${getThemeCardStyle(profile.themeId)}`}
              >
                {link.title}
              </a>
            ))}
          </div>
          <div className="pt-8">
            <button
              onClick={() => setIsViewingMode(false)}
              className={`text-xs underline transition ${
                profile.themeId === 'funk-suburban' || profile.themeId === 'tokyo-minimal'
                  ? 'text-black/60 hover:text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Created with TripTree · Build Yours
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">TripTree</span>
        </div>
        <button
          onClick={handlePublish}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          Publish & Share
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      {/* Main Studio View */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left Panel: Studio Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Profile Information
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name or Brand Title"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
              <textarea
                placeholder="Short bio..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={2}
                className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
              <input
                type="url"
                placeholder="Avatar Image URL(Add a publicly accessible image URL)"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Theme Selector (2x2 Grid) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-400" /> Choose Aesthetic
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'liquid-mesh', label: 'Liquid Mesh' },
                { id: 'funk-suburban', label: 'Funk Suburban' },
                { id: 'cyberpunk', label: 'Cyberpunk' },
                { id: 'tokyo-minimal', label: 'Tokyo Minimal' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, themeId: theme.id as UserProfile['themeId'] })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    profile.themeId === theme.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm'
                      : 'border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Links Builder */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-400" /> Social Links
              </h2>
              <button
                onClick={addLink}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            <div className="space-y-3">
              {profile.links.map((link: LinkItem) => {
                const brand = getBrandMeta(link.url);
                return (
                  <div key={link.id} className="p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-zinc-300">
                        {brand.name}
                      </span>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-700/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL (e.g. https://medium.com/@username)"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-700/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Live Mobile Mockup */}
        <div className="lg:col-span-5 flex justify-center sticky top-24 h-[calc(100vh-8rem)]">
          <div className="w-full max-w-sm bg-black border-4 border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
            <div className="w-32 h-4 bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />
            <div className={`flex-1 p-6 pt-12 flex flex-col items-center text-center overflow-y-auto ${getThemeBackground(profile.themeId)}`}>
              <img
                src={profile.avatarUrl || 'https://via.placeholder.com/150'}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-black/10 shadow-md mb-3"
              />
              <h3 className={`text-lg font-bold ${getThemeTextColor(profile.themeId)}`}>
                {profile.name || 'Your Name'}
              </h3>
              <p className={`text-xs mt-1 max-w-[220px] ${getThemeBioColor(profile.themeId)}`}>
                {profile.bio || 'Your short bio here...'}
              </p>

              <div className="w-full space-y-2.5 mt-6">
                {profile.links.filter((l: LinkItem) => l.enabled).map((link: LinkItem) => (
                  <div
                    key={link.id}
                    className={`w-full p-3 text-xs font-semibold cursor-pointer transition ${getThemeCardStyle(profile.themeId)}`}
                  >
                    {link.title || 'Untitled Link'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-center">
            <h3 className="text-xl font-bold">Your TripTree Link is Ready! 🎉</h3>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs font-mono break-all text-indigo-400 flex items-center justify-between">
              <span>{rawUrl}</span>
              <button
                onClick={() => copyToClipboard(rawUrl)}
                className="p-1.5 hover:bg-zinc-800 rounded text-zinc-300 transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl max-w-[160px] mx-auto">
              <QRCodeSVG value={rawUrl} size={140} />
            </div>

            <button
              onClick={() => setShowPublishModal(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              Close Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Visual theme background helper
function getThemeBackground(themeId: string) {
  switch (themeId) {
    case 'funk-suburban':
      return 'bg-[#CCFF00] text-black bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:16px_16px]';
    case 'cyberpunk':
      return 'bg-zinc-950 text-cyan-400';
    case 'tokyo-minimal':
      return 'bg-[#fbf9f5] text-stone-900';
    case 'liquid-mesh':
    default:
      return 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-800 text-white';
  }
}

// Visual theme card button helper
function getThemeCardStyle(themeId: string) {
  switch (themeId) {
    case 'funk-suburban':
      return 'bg-white text-black border-2 border-black font-extrabold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl';
    case 'cyberpunk':
      return 'bg-zinc-900/90 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-xl';
    case 'tokyo-minimal':
      return 'bg-white border border-stone-200 text-stone-900 shadow-sm hover:shadow-md rounded-2xl';
    case 'liquid-mesh':
    default:
      return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl';
  }
}

// Visual theme text color helpers for readability
function getThemeTextColor(themeId: string) {
  switch (themeId) {
    case 'funk-suburban':
    case 'tokyo-minimal':
      return 'text-black';
    case 'cyberpunk':
      return 'text-cyan-400';
    case 'liquid-mesh':
    default:
      return 'text-white';
  }
}

function getThemeBioColor(themeId: string) {
  switch (themeId) {
    case 'funk-suburban':
      return 'text-black/80 font-semibold';
    case 'tokyo-minimal':
      return 'text-stone-700 font-medium';
    case 'cyberpunk':
      return 'text-cyan-400/80';
    case 'liquid-mesh':
    default:
      return 'text-white/80';
  }
}