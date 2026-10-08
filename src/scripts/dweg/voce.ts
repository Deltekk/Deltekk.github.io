// Logica di DWEG senza DOM: dai campi del modulo alla voce YAML
// da incollare in src/data/wishlist*.yaml.

export interface Voce {
  id: string;
  quantità: number;
  categoria: string;
  publisher: string;
  artista: string;
  nome: string;
  link: string;
  immagine: string; // base64, vuota se non c'è
  prezzo: number | null;
  valuta: string;
  priorità: number;
  note: string;
}

// Prefissi degli id per categoria, come nelle voci esistenti (es. V-Mezzosangue-Sete)
export const PREFISSI: Record<string, string> = {
  Vinili: "V",
  CD: "CD",
  Manga: "Manga",
  Libri: "Lib",
  Videogame: "VG",
  "Giochi da tavolo": "GDT",
  BluRay: "BR",
  IOT: "IOT",
  Elettronica: "Ele",
  Accessori: "Acc",
};

export function leggiVoce(campi: FormData, immagine: string): Voce {
  const testo = (nome: string) => String(campi.get(nome) ?? "").trim();
  const prezzo = testo("prezzo").replace(/[€$£\s]/g, "").replace(",", ".");

  return {
    id: testo("id"),
    quantità: Number(testo("quantità")),
    categoria: testo("categoria"),
    publisher: testo("publisher"),
    artista: testo("artista"),
    nome: testo("nome"),
    link: testo("link"),
    immagine,
    prezzo: prezzo === "" ? null : Number(prezzo),
    valuta: testo("valuta"),
    priorità: Number(testo("priorità")),
    note: testo("note"),
  };
}

// "Tree Roots & Crowns" → "TreeRootsCrowns"
const camelCase = (testo: string) =>
  (testo.match(/[\p{L}\p{N}]+/gu) ?? []).map((parola) => parola[0].toUpperCase() + parola.slice(1)).join("");

// Prefisso-Artista/Publisher-Nome, es. V-Mezzosangue-TreeRootsCrowns
export function idAutomatico({ categoria, artista, publisher, nome }: Voce): string {
  const prefisso = PREFISSI[categoria] ?? camelCase(categoria).slice(0, 3);
  return [prefisso, camelCase(artista || publisher), camelCase(nome)].filter(Boolean).join("-");
}

export function linkValido(link: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(link).protocol);
  } catch {
    return false;
  }
}

// Gli stessi vincoli dello schema in src/content.config.ts, con messaggi comprensibili
export function controlla(voce: Voce, idEsistenti: Record<string, string>): string[] {
  const obbligatori = ["nome", "categoria", "publisher", "link", "id"] as const;
  const mancanti = obbligatori.filter((campo) => !voce[campo]);
  const problemi: string[] = [];

  if (mancanti.length) problemi.push(`Da compilare: ${mancanti.join(", ")}.`);
  if (voce.link && !linkValido(voce.link)) problemi.push("Il link deve essere un URL completo (http:// o https://).");
  if (!Number.isInteger(voce.quantità) || voce.quantità < 1) problemi.push("La quantità deve essere un intero da 1 in su.");
  if (voce.prezzo !== null && (Number.isNaN(voce.prezzo) || voce.prezzo < 0)) problemi.push("Il prezzo deve essere un numero, es. 29,90.");
  if (idEsistenti[voce.id]) problemi.push(`L'id esiste già nella collezione ${idEsistenti[voce.id]}: cambialo.`);

  return problemi;
}

// Una stringa JSON è anche una stringa YAML valida tra virgolette doppie
const stringa = (testo: string) => JSON.stringify(testo);

// Gli id semplici restano senza virgolette, come nei file esistenti
const valoreId = (id: string) => (/^[\p{L}\p{N}][\p{L}\p{N}._+?-]*$/u.test(id) ? id : stringa(id));

export function creaYaml(voce: Voce, { abbreviaImmagine = false } = {}): string {
  const immagine =
    abbreviaImmagine && voce.immagine.length > 40 ? `${voce.immagine.slice(0, 40)}…` : voce.immagine;

  const righe = [
    `- id: ${valoreId(voce.id)}`,
    `  quantità: ${voce.quantità}`,
    `  categoria: ${stringa(voce.categoria)}`,
    `  publisher: ${stringa(voce.publisher)}`,
    // artista è .optional() nello schema: se è vuoto la riga va omessa, null farebbe fallire la build
    ...(voce.artista ? [`  artista: ${stringa(voce.artista)}`] : []),
    `  nome: ${stringa(voce.nome)}`,
    `  link: ${stringa(voce.link)}`,
    `  immagine: ${stringa(immagine)}`,
    `  prezzo: ${voce.prezzo ?? ""}`,
    `  valuta: ${stringa(voce.valuta)}`,
    `  priorità: ${voce.priorità}`,
    `  note: ${stringa(voce.note)}`,
  ];
  return righe.join("\n") + "\n";
}
