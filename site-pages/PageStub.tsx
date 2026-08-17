interface PageStubProps {
  title: string;
  eyebrow: string;
  note?: string;
}

/** Minimal placeholder page — replaced by the page-owner agents. */
export default function PageStub({ title, eyebrow, note }: PageStubProps) {
  return (
    <section className="container-site flex min-h-[50dvh] flex-col items-start justify-center gap-5 py-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display-m text-ivory">{title}</h1>
      <p className="max-w-md text-ivory-dim">{note ?? 'This section is being rebuilt — check back shortly.'}</p>
    </section>
  );
}
