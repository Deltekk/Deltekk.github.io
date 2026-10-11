// Chiamate all'API di TMDB usate da DMEG (https://developer.themoviedb.org/reference).
// Tutto in italiano (language=it-IT); il trailer, se manca in italiano, si cerca in inglese.

const API = "https://api.themoviedb.org/3";
const IMMAGINI = "https://image.tmdb.org/t/p/";

export type Tipo = "film" | "serie";

// Un risultato della ricerca
export interface Risultato {
  tmdb: number;
  tipo: Tipo;
  titolo: string;
  titoloOriginale: string;
  anno: number | null;
  miniatura: string; // URL della locandina piccola, vuoto se manca
}

// I dati di un titolo che DMEG mette nella voce della watchlist
export interface DatiTmdb {
  tmdb: number;
  tipo: Tipo;
  titolo: string;
  titoloOriginale: string;
  generi: string[];
  annoInizio: number | null;
  annoFine: number | null; // solo serie concluse o cancellate
  stagioni: number | null; // solo serie
  attori: string[]; // i primi 5
  trailer: string; // URL YouTube, vuoto se non c'è
  locandina: string; // URL, vuoto se non c'è
}

// ----- Forma delle risposte di TMDB (solo i campi usati) -----

interface Video {
  site: string;
  type: string;
  key: string;
  official: boolean;
}

interface RispostaRicerca {
  results: {
    id: number;
    media_type: string;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    release_date?: string;
    first_air_date?: string;
    poster_path: string | null;
  }[];
}

interface RispostaFilm {
  title: string;
  original_title: string;
  release_date: string;
  genres: { name: string }[];
  poster_path: string | null;
  credits: { cast: { name: string; order: number }[] };
  videos: { results: Video[] };
}

interface RispostaSerie {
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string | null;
  status: string;
  number_of_seasons: number;
  genres: { name: string }[];
  poster_path: string | null;
  aggregate_credits: { cast: { name: string; order: number; total_episode_count: number }[] };
  videos: { results: Video[] };
}

// ----- Chiamate -----

// La chiave può essere il "token di accesso in lettura" (lungo, inizia con "eyJ", va nell'header
// Authorization) oppure la vecchia "chiave API" di 32 caratteri (va nel parametro api_key).
async function chiama<T>(percorso: string, parametri: Record<string, string>, chiave: string): Promise<T> {
  const url = new URL(API + percorso);
  url.search = new URLSearchParams({ language: "it-IT", ...parametri }).toString();
  const intestazioni: Record<string, string> = {};
  if (chiave.startsWith("eyJ")) intestazioni.Authorization = `Bearer ${chiave}`;
  else url.searchParams.set("api_key", chiave);

  const risposta = await fetch(url, { headers: intestazioni }).catch((): never => {
    throw new Error("TMDB non risponde: controlla la connessione.");
  });
  if (risposta.status === 401) throw new Error("Chiave TMDB non valida.");
  if (!risposta.ok) throw new Error(`TMDB ha risposto ${risposta.status}.`);
  return risposta.json();
}

// Controlla che la chiave funzioni (endpoint "Validate Key")
export async function verificaChiave(chiave: string): Promise<void> {
  await chiama("/authentication", {}, chiave);
}

const anno = (data?: string | null) => (data ? Number(data.slice(0, 4)) : null);
const immagine = (percorso: string | null, misura: "w92" | "w342") => (percorso ? IMMAGINI + misura + percorso : "");

export async function cercaTitoli(testo: string, chiave: string): Promise<Risultato[]> {
  const { results } = await chiama<RispostaRicerca>("/search/multi", { query: testo, include_adult: "false" }, chiave);
  return results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => ({
      tmdb: r.id,
      tipo: r.media_type === "movie" ? "film" : "serie",
      titolo: r.title ?? r.name ?? "",
      titoloOriginale: r.original_title ?? r.original_name ?? "",
      anno: anno(r.release_date ?? r.first_air_date),
      miniatura: immagine(r.poster_path, "w92"),
    }));
}

export async function datiTitolo(tipo: Tipo, tmdb: number, chiave: string): Promise<DatiTmdb> {
  if (tipo === "film") {
    const film = await chiama<RispostaFilm>(`/movie/${tmdb}`, { append_to_response: "credits,videos" }, chiave);
    return {
      tmdb,
      tipo,
      titolo: film.title,
      titoloOriginale: film.original_title,
      generi: film.genres.map((g) => g.name),
      annoInizio: anno(film.release_date),
      annoFine: null,
      stagioni: null,
      attori: [...film.credits.cast].sort((a, b) => a.order - b.order).slice(0, 5).map((a) => a.name),
      trailer: await trailer(film.videos.results, `/movie/${tmdb}/videos`, chiave),
      locandina: immagine(film.poster_path, "w342"),
    };
  }

  const serie = await chiama<RispostaSerie>(`/tv/${tmdb}`, { append_to_response: "aggregate_credits,videos" }, chiave);
  // Concluse: "Ended" o cancellate ("Canceled"; accettata anche la grafia britannica)
  const conclusa = /^(Ended|Cancell?ed)$/.test(serie.status);
  return {
    tmdb,
    tipo,
    titolo: serie.name,
    titoloOriginale: serie.original_name,
    generi: serie.genres.map((g) => g.name),
    annoInizio: anno(serie.first_air_date),
    annoFine: conclusa ? anno(serie.last_air_date) : null,
    stagioni: serie.number_of_seasons,
    // Per le serie contano gli attori presenti in più episodi, su tutte le stagioni
    attori: [...serie.aggregate_credits.cast]
      .sort((a, b) => b.total_episode_count - a.total_episode_count || a.order - b.order)
      .slice(0, 5)
      .map((a) => a.name),
    trailer: await trailer(serie.videos.results, `/tv/${tmdb}/videos`, chiave),
    locandina: immagine(serie.poster_path, "w342"),
  };
}

// Il trailer YouTube, preferendo quelli ufficiali: prima tra i video in italiano, poi in inglese
async function trailer(videoItaliani: Video[], percorsoVideo: string, chiave: string): Promise<string> {
  const scegli = (video: Video[]) =>
    video
      .filter((v) => v.site === "YouTube" && v.type === "Trailer")
      .sort((a, b) => Number(b.official) - Number(a.official))[0];

  let scelto = scegli(videoItaliani);
  if (!scelto) {
    const { results } = await chiama<{ results: Video[] }>(percorsoVideo, { language: "en-US" }, chiave);
    scelto = scegli(results);
  }
  return scelto ? `https://www.youtube.com/watch?v=${scelto.key}` : "";
}
