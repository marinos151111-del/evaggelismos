"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { BrowserRouter } from "react-router";

export default function ClientSite() {
  const [AppComponent, setAppComponent] = useState<ComponentType | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    import("@/App")
      .then(({ default: App }) => {
        if (active) setAppComponent(() => App);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loadFailed) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6 text-center text-ivory">
        <div>
          <h1 className="font-serif text-2xl tracking-wide">Evangelismos Music</h1>
          <p className="mt-3 text-ivory-dim">The catalogue could not load. Please refresh the page.</p>
        </div>
      </main>
    );
  }

  if (!AppComponent) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink text-ivory">
        <span className="font-serif text-2xl tracking-wide">Evangelismos Music</span>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  );
}
