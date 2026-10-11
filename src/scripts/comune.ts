// Funzioni condivise dai generatori di voci YAML (DWEG e DMEG), senza DOM

// "Tree Roots & Crowns" → "TreeRootsCrowns"
export const camelCase = (testo: string) =>
  (testo.match(/[\p{L}\p{N}]+/gu) ?? []).map((parola) => parola[0].toUpperCase() + parola.slice(1)).join("");

export function linkValido(link: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(link).protocol);
  } catch {
    return false;
  }
}

// Una stringa JSON è anche una stringa YAML valida tra virgolette doppie
export const stringa = (testo: string) => JSON.stringify(testo);

// Elenco su una riga: ["Uno", "Due"]
export const elenco = (valori: string[]) => `[${valori.map(stringa).join(", ")}]`;

// Gli id semplici restano senza virgolette, come nei file esistenti
export const valoreId = (id: string) => (/^[\p{L}\p{N}][\p{L}\p{N}._+?-]*$/u.test(id) ? id : stringa(id));

// Unisce le righe di una voce; i campi vuoti restano "chiave:" senza spazi finali
export const yaml = (righe: string[]) => righe.map((riga) => riga.trimEnd()).join("\n") + "\n";
