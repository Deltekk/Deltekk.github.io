// Watchlist: lettura dei titoli ed etichette/icone di tipi e stati, usate da pagina, card e DMEG
import { getCollection, type CollectionEntry } from "astro:content";
import type { SvgComponent } from "astro/types";
import { anni } from "@/lib/anni";
import CircleCheck from "@tabler/icons/outline/circle-check.svg";
import CircleX from "@tabler/icons/outline/circle-x.svg";
import Clock from "@tabler/icons/outline/clock.svg";
import DeviceTv from "@tabler/icons/outline/device-tv.svg";
import Movie from "@tabler/icons/outline/movie.svg";
import PlayerPlay from "@tabler/icons/outline/player-play.svg";

export { anni };

export type TitoloWatchlist = CollectionEntry<"watchlist">;
export type Tipo = TitoloWatchlist["data"]["tipo"];
export type Stato = TitoloWatchlist["data"]["stato"];

export const TIPI: Record<Tipo, { etichetta: string; icona: SvgComponent }> = {
  film: { etichetta: "Film", icona: Movie },
  serie: { etichetta: "Serie", icona: DeviceTv },
};

// Il tono è quello dei Badge di Starwind
export const STATI: Record<Stato, { etichetta: string; icona: SvgComponent; tono: "neutral" | "info" | "success" | "error" }> = {
  daVedere: { etichetta: "Da vedere", icona: Clock, tono: "neutral" },
  inCorso: { etichetta: "In corso", icona: PlayerPlay, tono: "info" },
  visto: { etichetta: "Visto", icona: CircleCheck, tono: "success" },
  abbandonato: { etichetta: "Abbandonato", icona: CircleX, tono: "error" },
};

// Titoli dal più recente al più vecchio (quelli senza anno in fondo), poi per titolo
export async function leggiWatchlist(): Promise<TitoloWatchlist[]> {
  const titoli = await getCollection("watchlist");
  return titoli.sort(
    (a, b) =>
      (b.data.annoInizio ?? -Infinity) - (a.data.annoInizio ?? -Infinity) ||
      a.data.titolo.localeCompare(b.data.titolo, "it"),
  );
}

// Testo in cui cerca la ricerca della pagina: titoli, anni, tipo, stato, generi, attori e note
export function testoRicerca(data: TitoloWatchlist["data"]): string {
  return [
    data.titolo,
    data.titoloOriginale,
    anni(data),
    TIPI[data.tipo].etichetta,
    STATI[data.stato].etichetta,
    ...data.generi,
    ...data.attori,
    data.note ?? "",
  ]
    .join(" ")
    .toLowerCase();
}
