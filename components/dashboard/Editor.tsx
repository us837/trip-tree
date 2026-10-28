'use client';

import { useRef } from 'react';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { Eye, EyeOff, GripVertical, Layout, Link as LinkIcon, Lock, Plus, Trash2, Upload, User } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcon';
import { getBrandMeta } from '@/src/lib/brands';
import { PLAN_LIMITS } from '@/src/lib/plans';
import { THEMES } from '@/src/lib/themes';
import type { LinkItem, Plan, ProfileInput } from '@/src/lib/types';
import { LIMITS } from '@/src/lib/validate';

interface EditorProps {
  draft: ProfileInput;
  plan: Plan;
  onChange: (next: ProfileInput) => void;
  onError: (message: string) => void;
}

const inputClass =
  'w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-grape-500 focus:border-transparent';

/** Resizes an uploaded photo to a 256px square JPEG data URI, small enough to store with the profile. */
async function resizeAvatar(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 256;
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.85);
}

const newLinkId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function Editor({ draft, plan, onChange, onError }: EditorProps) {
  const limits = PLAN_LIMITS[plan];
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<ProfileInput>) => onChange({ ...draft, ...patch });

  const updateLink = (id: string, patch: Partial<LinkItem>) =>
    set({ links: draft.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });

  const addLink = () =>
    set({ links: [...draft.links, { id: newLinkId(), title: '', url: '', enabled: true }] });

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || destination.index === source.index) return;
    const links = [...draft.links];
    const [moved] = links.splice(source.index, 1);
    links.splice(destination.index, 0, moved);
    set({ links });
  };

  const onAvatarFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      set({ avatar: await resizeAvatar(file) });
    } catch {
      onError('That image could not be read. Try a JPG or PNG.');
    }
  };

  const atLinkLimit = draft.links.length >= limits.maxLinks;
  const avatarIsUpload = draft.avatar.startsWith('data:');

  return (
    <div className="space-y-6">
      {/* Profile */}
      <section className="bg-white border border-black/5 rounded-3xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-grape-500" /> Profile
        </h2>
        <input
          type="text"
          placeholder="Name or brand"
          value={draft.name}
          maxLength={LIMITS.name}
          onChange={(e) => set({ name: e.target.value })}
          className={inputClass}
        />
        <div>
          <textarea
            placeholder="Short bio"
            value={draft.bio}
            maxLength={LIMITS.bio}
            onChange={(e) => set({ bio: e.target.value })}
            rows={2}
            className={inputClass}
          />
          <p className="text-xs text-zinc-400 text-right">
            {draft.bio.length}/{LIMITS.bio}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Photo URL (https://…)"
            value={avatarIsUpload ? '' : draft.avatar}
            onChange={(e) => set({ avatar: e.target.value })}
            className={inputClass}
            disabled={avatarIsUpload}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              void onAvatarFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-medium flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
          {draft.avatar && (
            <button
              type="button"
              onClick={() => set({ avatar: '' })}
              className="px-3 rounded-xl hover:bg-zinc-100 text-sm text-zinc-500 shrink-0 cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      </section>

      {/* Theme */}
      <section className="bg-white border border-black/5 rounded-3xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Layout className="w-4 h-4 text-grape-500" /> Theme
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((theme) => {
            const locked = !limits.themes.includes(theme.id);
            const active = draft.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                disabled={locked}
                onClick={() => set({ theme: theme.id })}
                className={`p-3 rounded-2xl border-2 text-sm font-semibold flex items-center gap-3 transition text-left cursor-pointer disabled:cursor-not-allowed ${
                  active ? 'border-grape-500 bg-grape-500/5' : 'border-zinc-200 hover:border-zinc-300'
                } ${locked ? 'opacity-60' : ''}`}
              >
                <span className={`w-8 h-8 rounded-lg shrink-0 ${theme.swatch}`} />
                <span className="flex-1">{theme.label}</span>
                {locked && (
                  <span className="flex items-center gap-1 text-[11px] text-grape-600">
                    <Lock className="w-3 h-3" /> Pro
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Links */}
      <section className="bg-white border border-black/5 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-grape-500" /> Links
            <span className="text-xs font-normal text-zinc-400">
              {draft.links.length}/{limits.maxLinks}
            </span>
          </h2>
          <button
            type="button"
            onClick={addLink}
            disabled={atLinkLimit}
            className="px-4 py-2 bg-ink text-white text-sm font-semibold rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add link
          </button>
        </div>
        {atLinkLimit && plan === 'free' && (
          <p className="text-xs text-grape-600 bg-grape-500/10 rounded-xl px-3 py-2">
            The Free plan allows {limits.maxLinks} links. Pro raises this to {PLAN_LIMITS.pro.maxLinks}.
          </p>
        )}
        {draft.links.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-6">No links yet. Add your first one.</p>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="links">
            {(dropProvided) => (
              <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3">
                {draft.links.map((link, index) => {
                  const brand = getBrandMeta(link.url);
                  return (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`flex gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl ${
                            link.enabled ? '' : 'opacity-60'
                          }`}
                        >
                          <span
                            {...dragProvided.dragHandleProps}
                            className="flex items-center text-zinc-400 hover:text-zinc-600"
                            aria-label="Drag to reorder"
                          >
                            <GripVertical className="w-5 h-5" />
                          </span>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs px-2 py-1 rounded-lg bg-white border border-zinc-200 flex items-center gap-1.5"
                                style={{ color: brand.color }}
                              >
                                <BrandIcon brand={brand} className="w-3.5 h-3.5" />
                                <span className="text-zinc-600">{brand.name}</span>
                              </span>
                              <span className="flex-1" />
                              <button
                                type="button"
                                onClick={() => updateLink(link.id, { enabled: !link.enabled })}
                                className="p-1.5 rounded-lg text-zinc-500 hover:bg-white cursor-pointer"
                                title={link.enabled ? 'Hide link' : 'Show link'}
                              >
                                {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => set({ links: draft.links.filter((l) => l.id !== link.id) })}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-white cursor-pointer"
                                title="Delete link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Title, e.g. My YouTube channel"
                              value={link.title}
                              maxLength={LIMITS.linkTitle}
                              onChange={(e) => updateLink(link.id, { title: e.target.value })}
                              className={inputClass}
                            />
                            <input
                              type="text"
                              inputMode="url"
                              placeholder="URL, e.g. youtube.com/@you"
                              value={link.url}
                              onChange={(e) => updateLink(link.id, { url: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </div>
  );
}
