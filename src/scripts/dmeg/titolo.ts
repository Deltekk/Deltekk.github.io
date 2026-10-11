// Logica di DMEG senza DOM: dai campi del modulo alla voce YAML
// da incollare in src/data/watchlist.yaml (schema in src/content.config.ts).
import { camelCase, elenco, linkValido, stringa, valoreId, yaml } from "@/scripts/comune";
import type { Tipo } from "@/scripts/dmeg/tmdb";

export type Stato = "daVedere" | "inCorso" | "visto" | "abbandonato";

export interface Titolo {
  id: string;
  tmdb: number | null;
  tipo: Tipo;
  titolo: string;
  titoloOriginale: string;
  generi: string[];
  annoInizio: number | null;
  annoFine: number | null;
  stagioni: number | null;
  stagioniViste: number | null;
  stato: Stato;
  attori: string[];
  trailer: string;
  locandina: string;
  voto: number | null;
  note: string;
}

// I campi personali di un titolo già in watchlist, da conservare quando lo si rigenera
export interface Esistente {
  id: string;
  stato: Stato;
  stagioniViste: number | null;
  voto: number | null;
  note: string;
}

export function leggiTitolo(campi: FormData): Titolo {
  const testo = (nome: string) => String(campi.get(nome) ?? "").trim();
  const numero = (nome: string) => (testo(nome) === "" ? null : Number(testo(nome)));
  const elencoDa = (nome: string, separatore: string | RegExp) =>
    testo(nome)
      .split(separatore)
      .map((valore) => valore.trim())
      .filter(Boolean);
  const tipo = testo("tipo") as Tipo;
  const serie = tipo === "serie";

  return {
    id: testo("id"),
    tmdb: numero("tmdb"),
    tipo,
    titolo: testo("titolo"),
    titoloOriginale: testo("titoloOriginale"),
    generi: elencoDa("generi", ","),
    annoInizio: numero("annoInizio"),
    // I campi delle serie valgono solo per le serie, anche se il modulo li conserva
    annoFine: serie ? numero("annoFine") : null,
    stagioni: serie ? numero("stagioni") : null,
    stagioniViste: serie ? numero("stagioniViste") : null,
    stato: testo("stato") as Stato,
    attori: elencoDa("attori", /\n/),
    trailer: testo("trailer"),
    locandina: testo("locandina"),
    voto: numero("voto"),
    note: testo("note"),
  };
}

// tipo-Titolo-anno, es. serie-Scissione-2022: non contiene dati che cambiano nel tempo
export function idAutomatico({ tipo, titolo, annoInizio }: Titolo): string {
  return [tipo, camelCase(titolo), annoInizio].filter(Boolean).join("-");
}

const intero = (valore: number | null, minimo: number, massimo = Infinity) =>
  valore === null || (Number.isInteger(valore) && valore >= minimo && valore <= massimo);

// Gli stessi vincoli dello schema in src/content.config.ts, con messaggi comprensibili.
// `esistenti` sono i titoli già in watchlist, per id TMDB.
export function controlla(t: Titolo, esistenti: Record<number, Esistente>): string[] {
  const problemi: string[] = [];
  const mancanti = (["titolo", "titoloOriginale", "id"] as const).filter((campo) => !t[campo]);

  if (t.tmdb === null) problemi.push("Scegli il titolo dalla ricerca su TMDB.");
  if (mancanti.length) problemi.push(`Da compilare: ${mancanti.join(", ")}.`);
  if (!intero(t.annoInizio, 1870, 2200) || !intero(t.annoFine, t.annoInizio ?? 1870, 2200))
    problemi.push("Gli anni devono essere numeri interi, con la fine non prima dell'inizio.");
  if (!intero(t.stagioni, 1)) problemi.push("Le stagioni devono essere un intero da 1 in su.");
  if (!intero(t.stagioniViste, 0, t.stagioni ?? Infinity))
    problemi.push("Le stagioni viste vanno da 0 al numero di stagioni.");
  if (t.trailer && !linkValido(t.trailer)) problemi.push("Il trailer deve essere un URL completo.");
  if (t.locandina && !linkValido(t.locandina)) problemi.push("La locandina deve essere un URL completo.");

  const conStessoId = Object.entries(esistenti).find(([, e]) => e.id === t.id);
  if (conStessoId && Number(conStessoId[0]) !== t.tmdb) problemi.push(`L'id ${t.id} è già usato da un altro titolo: cambialo.`);
  const stessoTitolo = t.tmdb !== null ? esistenti[t.tmdb] : undefined;
  if (stessoTitolo && stessoTitolo.id !== t.id)
    problemi.push(`Questo titolo è già in watchlist con id ${stessoTitolo.id}: usa lo stesso id.`);

  return problemi;
}

export function creaYaml(t: Titolo): string {
  return yaml([
    `- id: ${valoreId(t.id)}`,
    `  tmdb: ${t.tmdb ?? ""}`,
    `  tipo: ${stringa(t.tipo)}`,
    `  titolo: ${stringa(t.titolo)}`,
    `  titoloOriginale: ${stringa(t.titoloOriginale)}`,
    `  generi: ${elenco(t.generi)}`,
    `  annoInizio: ${t.annoInizio ?? ""}`,
    ...(t.tipo === "serie"
      ? [`  annoFine: ${t.annoFine ?? ""}`, `  stagioni: ${t.stagioni ?? ""}`, `  stagioniViste: ${t.stagioniViste ?? ""}`]
      : []),
    `  stato: ${stringa(t.stato)}`,
    `  attori: ${elenco(t.attori)}`,
    `  trailer: ${t.trailer ? stringa(t.trailer) : ""}`,
    `  locandina: ${t.locandina ? stringa(t.locandina) : ""}`,
    `  voto: ${t.voto ?? ""}`,
    `  note: ${stringa(t.note)}`,
  ]);
}
