"use client";
import styles from "./memory-map.module.css";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const letters = [
  {
    id: 1,
    title: "Where it began",
    place: "High school",
    image: "letter-01-ivory.png",
    desktop: [22, 61],
    mobile: [28, 25],
  },
  {
    id: 2,
    title: "Between classes",
    place: "The school courtyard",
    image: "letter-02-sage.png",
    desktop: [39, 74],
    mobile: [47, 32],
  },
  {
    id: 3,
    title: "Almost told you",
    place: "College",
    image: "letter-03-blush.png",
    desktop: [81, 32],
    mobile: [75, 35],
  },
  {
    id: 4,
    title: "Little things",
    place: "The town",
    image: "letter-04-blue.png",
    desktop: [55, 45],
    mobile: [63, 58],
  },
  {
    id: 5,
    title: "On the way home",
    place: "Familiar streets",
    image: "letter-05-lavender.png",
    desktop: [70, 66],
    mobile: [36, 65],
  },
  {
    id: 6,
    title: "On quiet days",
    place: "The province",
    image: "letter-06-gold.png",
    desktop: [22, 28],
    mobile: [72, 16],
  },
  {
    id: 7,
    title: "Still, thank you",
    place: "Home",
    image: "letter-07-teal.png",
    desktop: [68, 88],
    mobile: [29, 86],
  },
];

type Letter = (typeof letters)[number];

type MarkerStyle = CSSProperties & {
  "--desktop-x": string;
  "--desktop-y": string;
  "--mobile-x": string;
  "--mobile-y": string;
  "--tilt": string;
};

export default function LetterShelves() {
  const [selected, setSelected] = useState<Letter | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!selected) return;

    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;

    if (element && !element.open) element.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  function changeLetter(direction: number) {
    if (!selected) return;
    const index = letters.findIndex((letter) => letter.id === selected.id);
    setSelected(letters[(index + direction + letters.length) % letters.length]);

    const paper = dialog.current?.querySelector(".memory-reading-paper");
    if (paper) paper.scrollTop = 0;
  }

  return (
    <section className={`memory-experience ${styles.root}`} aria-label="A map of unsent letters">
      <header className="memory-intro">
        <span className="memory-eyebrow">Places I kept. Words I never sent.</span>
        <h1>
          A map <em>of us.</em>
        </h1>
        <p>Tap a letter. Revisit a memory.</p>
      </header>

      <div className="memory-map">
        <picture className="memory-map-picture">
          <source
            media="(max-width: 700px)"
            srcSet="/maps/memory-map-mobile.png"
          />
          {/* Native picture selects only the matching map asset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maps/memory-map-desktop.png"
            alt="An illustrated Filipino town connecting high school, college, city streets, and the province."
            width={1672}
            height={941}
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
        </picture>

        {letters.map((letter, index) => {
          const style: MarkerStyle = {
            "--desktop-x": `${letter.desktop[0]}%`,
            "--desktop-y": `${letter.desktop[1]}%`,
            "--mobile-x": `${letter.mobile[0]}%`,
            "--mobile-y": `${letter.mobile[1]}%`,
            "--tilt": `${index % 2 === 0 ? -5 : 4}deg`,
          };

          return (
            <button
              key={letter.id}
              type="button"
              className="memory-marker"
              style={style}
              aria-label={`Read letter ${letter.id}: ${letter.title}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                lastTrigger.current = event.currentTarget;
                setSelected(letter);
              }}
            >
              <span className="memory-envelope-art">
                <Image
                  src={`/letters/${letter.image}`}
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 700px) 86px, 140px"
                  draggable={false}
                />
              </span>

              <span className="memory-marker-label" aria-hidden="true">
                <small>{letter.place}</small>
                <strong>{letter.title}</strong>
              </span>
            </button>
          );
        })}

        
      </div>

      

      <dialog
        ref={dialog}
        className="memory-reading-dialog"
        aria-labelledby="memory-letter-title"
        onClose={() => {
          setSelected(null);
          lastTrigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <article className="memory-reading-paper">
            <button
              type="button"
              className="memory-reading-close"
              aria-label="Close letter"
              onClick={() => dialog.current?.close()}
              autoFocus
            >
              <X size={21} strokeWidth={1.4} />
            </button>

            <span className="memory-eyebrow">
              Letter {String(selected.id).padStart(2, "0")} / 07
            </span>

            <p className="memory-reading-place">{selected.place}</p>

            <h2 id="memory-letter-title">{selected.title}</h2>

            <div className="memory-paper-rule" />

            <p className="memory-greeting">To you,</p>

            <p>
              This letter is waiting for your words.
            </p>
            <p>
              We will add your own memories here next.
            </p>

            <p className="memory-signature">Always, me.</p>

            <nav className="memory-reading-navigation" aria-label="Other letters">
              <button
                type="button"
                onClick={() => changeLetter(-1)}
                aria-label="Previous letter"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <span>{selected.id} of 7</span>

              <button
                type="button"
                onClick={() => changeLetter(1)}
                aria-label="Next letter"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </nav>
          </article>
        )}
      </dialog>
    </section>
  );
}