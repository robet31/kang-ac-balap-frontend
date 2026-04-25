import { useState } from "react";
import { motion } from "motion/react";
import { COMPANY, LINKTREE_LINKS } from "../data/mockData";

export function LinktreePage() {
  return (
    <div className="linktree-page">
      <div className="linktree-container">
        {/* Logo & Profile */}
        <motion.div
          className="linktree-profile"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="linktree-avatar">
            <span className="linktree-avatar-text">🔧</span>
          </div>
          <h1 className="linktree-name">{COMPANY.name}</h1>
          <p className="linktree-tagline">Pemasangan • Cuci • Servis AC</p>
          <p className="linktree-location">📍 {COMPANY.address}</p>
        </motion.div>

        {/* Links */}
        <div className="linktree-links">
          {LINKTREE_LINKS.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`linktree-link ${link.is_primary ? "linktree-link-primary" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {link.title}
            </motion.a>
          ))}
        </div>

        {/* Social Icons */}
        <motion.div
          className="linktree-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="linktree-social-icon" title="WhatsApp">💬</a>
          <a href={COMPANY.tiktokLink} target="_blank" rel="noopener noreferrer" className="linktree-social-icon" title="TikTok">🎵</a>
          <a href={COMPANY.googleMapsLink} target="_blank" rel="noopener noreferrer" className="linktree-social-icon" title="Maps">📍</a>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="linktree-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          © 2025 {COMPANY.name} — {COMPANY.address}
        </motion.p>
      </div>

      <style>{`
        .linktree-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
          padding: 2rem 1rem;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .linktree-container {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .linktree-profile { text-align: center; }
        .linktree-avatar {
          width: 96px; height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #16A34A, #22D3EE);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 0 30px rgba(22, 163, 74, 0.4);
        }
        .linktree-avatar-text { font-size: 2.5rem; }
        .linktree-name {
          font-size: 1.5rem; font-weight: 700; color: #F8FAFC;
          margin: 0 0 0.25rem;
        }
        .linktree-tagline { color: #94A3B8; font-size: 0.9rem; margin: 0 0 0.25rem; }
        .linktree-location { color: #64748B; font-size: 0.85rem; margin: 0; }
        .linktree-links {
          width: 100%;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .linktree-link {
          display: block; width: 100%; padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #F8FAFC;
          text-decoration: none; text-align: center;
          font-size: 0.95rem; font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .linktree-link:hover {
          background: rgba(255,255,255,0.15);
          border-color: #16A34A;
          box-shadow: 0 4px 20px rgba(22,163,74,0.2);
        }
        .linktree-link-primary {
          background: linear-gradient(135deg, #16A34A, #15803D);
          border-color: #16A34A;
          font-weight: 600;
        }
        .linktree-link-primary:hover {
          box-shadow: 0 4px 25px rgba(22,163,74,0.4);
          transform: translateY(-1px);
        }
        .linktree-socials {
          display: flex; gap: 1rem; margin-top: 0.5rem;
        }
        .linktree-social-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .linktree-social-icon:hover {
          background: rgba(22,163,74,0.3);
          border-color: #16A34A;
        }
        .linktree-footer {
          color: #475569; font-size: 0.75rem; text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
