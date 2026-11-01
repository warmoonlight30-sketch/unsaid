import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { hasArchiveAccess } from "@/lib/archive-auth";
import { lockArchive } from "@/app/archive-actions";
import LetterShelves from "@/components/letter-shelves";

export default function LettersPage() {
  return (
    <Suspense fallback={
      <main className="entrance">
        <div className="scene" aria-hidden="true" />
        <section className="content">
          <div className="letter-panel" role="status">
            <p className="intro">Finding your letters...</p>
          </div>
        </section>
      </main>
    }>
      <ProtectedArchive />
    </Suspense>
  );
}

async function ProtectedArchive() {
  await connection();
  if (!(await hasArchiveAccess())) redirect("/");

  return (
    <main className="entrance archive-page">
      <div className="scene" aria-hidden="true" />
      <div className="archive-wash" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-icon">
            <Mail size={23} strokeWidth={1.2} />
          </span>
          unsaid<span className="brand-dot">.</span>
        </a>
        <span className="header-caption">A private letter archive</span>
        <form action={lockArchive}>
          <button className="archive-lock" type="submit">
            <LockKeyhole size={13} /> Lock archive
          </button>
        </form>
      </header>

      <div className="archive-content">
        <LetterShelves />
      </div>

      <footer className="site-footer">
        <span>Written with love.</span>
        <span>Kept in silence.</span>
      </footer>
    </main>
  );
}