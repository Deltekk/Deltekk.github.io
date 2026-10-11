// Anni di un titolo della watchlist: "2010" per i film, "2008 – 2013" o "2022 – in corso" per le serie.
// Senza dipendenze, così lo usano sia la pagina watchlist sia l'anteprima di DMEG nel browser.
export function anni({ tipo, annoInizio, annoFine }: { tipo: string; annoInizio?: number | null; annoFine?: number | null }) {
  if (!annoInizio) return "Anno da definire";
  if (tipo === "film") return String(annoInizio);
  return `${annoInizio} – ${annoFine ?? "in corso"}`;
}
