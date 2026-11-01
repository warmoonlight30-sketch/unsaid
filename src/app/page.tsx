"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { unlockArchive } from "@/app/archive-actions";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const reduceMotion = useReducedMotion();

  return (
    <main className="entrance">
      <div className="scene" aria-hidden="true" />
      <div className="scene-wash" aria-hidden="true" />

      {!reduceMotion && (
        <div className="petals" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${12 + i * 10}%`,
                animationDelay: `${i * -2.3}s`,
                animationDuration: `${15 + (i % 4) * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <header className="site-header">
        <a href="/" className="brand" aria-label="Unsaid home">
          <span className="brand-icon">
            <Mail size={23} strokeWidth={1.2} />
          </span>
          unsaid<span className="brand-dot">.</span>
        </a>
        <span className="header-caption">A private letter archive</span>
        <span className="privacy">
          <LockKeyhole size={14} /> Only for you
        </span>
      </header>

      <section className="content">
        <motion.div
          className="letter-panel"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="panel-corner" aria-hidden="true" />
          <div className="eyebrow">
            <span /> Letters I never sent
          </div>

          <h1>
            All the things
            <em>I never said.</em>
          </h1>

          <p className="intro">
            Somewhere between loving you
            <br className="desktop-break" /> and letting you go, I wrote.
          </p>

          <p className="dedication">To you, always.</p>

          <form
            className="entry-form"
            onSubmit={async (event) => {
              event.preventDefault();
              if (pending) return;

              const data = new FormData(event.currentTarget);
              setPending(true);
              setMessage("");

              try {
                const result = await unlockArchive(data);

                if ("error" in result) {
                  setMessage(result.error);
                  setPending(false);
                  return;
                }

                window.location.assign("/letters");
              } catch {
                setMessage("Unable to open the archive. Please try again.");
                setPending(false);
              }
            }}
          >
            <label htmlFor="private-key">Your private key</label>

            <div className="password-field">
              <KeyRound
                size={19}
                strokeWidth={1.4}
                aria-hidden="true"
              />

              <input
                id="private-key"
                name="password"
                type={visible ? "text" : "password"}
                placeholder="Enter your secret"
                autoComplete="current-password"
                maxLength={128}
                required
                disabled={pending}
                aria-invalid={message ? true : undefined}
                aria-describedby={message ? "key-message" : undefined}
                onChange={() => setMessage("")}
              />

              <button
                type="button"
                className="visibility"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
              >
                {visible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button
              className="enter-button"
              type="submit"
              disabled={pending}
              aria-busy={pending}
            >
              <span>
                {pending ? "Opening your letters..." : "Open the letters"}
              </span>
              <span className="button-arrow">
                <ArrowRight size={23} strokeWidth={1.3} />
              </span>
            </button>

            <p className="form-note">
              A little courage. A familiar secret.
            </p>
            <p id="key-message" className="form-message" role="status">
              {message}
            </p>
          </form>

          <div className="panel-footer">
            <span className="small-flower" aria-hidden="true">
              &#10047;
            </span>
            Some words are kept close.
          </div>
        </motion.div>

        <motion.div
          className="scene-caption"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <span className="caption-line" />
          <p>
            The words stayed.
            <br />
            <em>The feeling did too.</em>
          </p>
        </motion.div>
      </section>

      <footer className="site-footer">
        <span>Written with love.</span>
        <span className="footer-center">
          A quiet place for unfinished feelings
        </span>
        <span>Kept in silence.</span>
      </footer>
    </main>
  );
}