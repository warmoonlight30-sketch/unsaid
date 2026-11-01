"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

const letters = [
  { id: 1, title: "The beginning", subtitle: "Where the words began" },
  { id: 2, title: "Almost told you", subtitle: "A little courage, unfinished" },
  { id: 3, title: "Little things", subtitle: "The moments I kept" },
  { id: 4, title: "On quiet days", subtitle: "When you crossed my mind" },
  { id: 5, title: "Another lifetime", subtitle: "The things I imagined" },
  { id: 6, title: "Still, thank you", subtitle: "For being part of my story" },
];

export default function LetterShelves() {
  const [selected, setSelected] = useState<(typeof letters)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!selected) return;

    const element = dialog.current;
    const previous = document.body.style.overflow;

    if (element && !element.open) element.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  return (
    <>
      <section className="shelf-intro">
        <span className="shelf-eyebrow">The unsent collection</span>
        <h1>A place for <em>every feeling.</em></h1>
        <p>Pick a letter. Take your time.</p>
      </section>

      <motion.section
        className="illustrated-shop"
        aria-label="Haku's letter shop"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <Image
          className="illustrated-shop-art"
          src="/letter-shop.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 700px) 100vw, 1200px"
          loading="eager"
        />

        <div className="illustrated-shop-sign">
          <span>Letters kept close</span>
        </div>

        <div className="illustrated-shop-keeper">
          <Image
            src="/haku.png"
            alt="Haku standing beside the letter shelves"
            fill
            sizes="(max-width: 700px) 110px, 320px"
            loading="eager"
            style={{ objectFit: "contain", objectPosition: "center bottom" }}
          />
        </div>

        <div className="illustrated-shop-letters">
          {letters.map((letter) => (
            <button
              key={letter.id}
              type="button"
              className={`shop-letter shop-letter-color-${letter.id % 3}`}
              onClick={() => setSelected(letter)}
              aria-label={`Read ${letter.title}`}
            >
              <span className="shop-envelope" aria-hidden="true">
                <span className="shop-envelope-flap" />
                <span className="shop-envelope-seal">u</span>
                <span className="shop-envelope-number">
                  {String(letter.id).padStart(2, "0")}
                </span>
              </span>

              <span className="shop-letter-caption">
                <strong>{letter.title}</strong>
                <small>{letter.subtitle}</small>
              </span>
            </button>
          ))}
        </div>

        
      </motion.section>

      <dialog
        ref={dialog}
        className="reading-dialog"
        aria-labelledby="reading-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <article className="reading-paper">
            <button
              type="button"
              className="reading-close"
              aria-label="Close letter"
              onClick={() => dialog.current?.close()}
              autoFocus
            >
              <X size={21} />
            </button>

            <span className="shelf-eyebrow">
              Letter {String(selected.id).padStart(2, "0")}
            </span>
            <h2 id="reading-title">{selected.title}</h2>
            <span className="reading-rule" />
            <p className="reading-greeting">To you,</p>
            <p>This letter has not been added yet.</p>
            <p>Your own words will appear here when we add your collection.</p>
            <p className="reading-signature">Always, me.</p>
          </article>
        )}
      </dialog>
    </>
  );
}