'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, Download, ExternalLink, X } from 'lucide-react';

export function ShareModal({ url, slug, onClose }: { url: string; slug: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const svgElement = document.getElementById('triptree-qr-code');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = `triptree-${slug}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="Share your TripTree"
        className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold">Share your TripTree</h3>

        <div className="bg-zinc-100 p-3 rounded-xl text-sm font-mono break-all flex items-center justify-between gap-2">
          <span className="text-left">{url}</span>
          <button onClick={copy} className="p-2 hover:bg-white rounded-lg shrink-0 cursor-pointer" title="Copy link">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-white rounded-2xl border border-zinc-200">
            <QRCodeSVG id="triptree-qr-code" value={url} size={180} marginSize={2} />
          </div>
          <button
            onClick={downloadQRCode}
            className="inline-flex items-center gap-1.5 text-sm text-grape-600 hover:text-grape-500 font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download QR code (.svg)
          </button>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-ink text-white font-semibold"
        >
          Open my page <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
