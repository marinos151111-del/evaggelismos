export const asset = (p: string | null | undefined): string =>
  p ? `/${p.replace(/^\/+/, "")}` : "";
