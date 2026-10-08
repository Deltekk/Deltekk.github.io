// Dati generali del sito ed elenco delle pagine.
// Da qui prendono i dati: il menu nell'header, i link nel footer, i collegamenti in home
// e titolo e descrizione di ogni pagina (usati anche nelle anteprime dei link).
//
// Per aggiungere una pagina: crea il file in src/pages/ e aggiungi una voce a PAGINE
// con lo stesso percorso. Il resto (menu, home, metadati) si aggiorna da solo.
import type { SvgComponent } from "astro/types";
import Code from "@tabler/icons/outline/code.svg";
import FileCode from "@tabler/icons/outline/file-code.svg";
import Gift from "@tabler/icons/outline/gift.svg";
import GiftCard from "@tabler/icons/outline/gift-card.svg";
import Heart from "@tabler/icons/outline/heart.svg";

export const SITO = {
  nome: "susino.dev",
  descrizione: "Il piccolo angolo di internet di Deltekk: progettini, esperimenti e qualche pagina personale.",
  github: "https://github.com/Deltekk",
};

// Le sezioni della home, nell'ordine in cui compaiono
export const GRUPPI = [
  {
    nome: "Progetti",
    descrizione: "Strumenti e progettini, nati per divertimento o per necessità.",
    icona: Code,
  },
  {
    nome: "Personale",
    descrizione: "Pagine per amici e parenti, come le wishlist per i regali.",
    icona: Heart,
  },
] as const;

export interface Pagina {
  percorso: string; // URL della pagina: è il nome del file in src/pages/, maiuscole comprese
  titolo: string; // titolo della scheda del browser e delle anteprime dei link
  menu: string; // etichetta breve per header e footer
  descrizione: string; // testo in home e nelle anteprime dei link
  icona: SvgComponent;
  gruppo: (typeof GRUPPI)[number]["nome"];
}

export const PAGINE: Pagina[] = [
  {
    percorso: "/DWEG",
    titolo: "DWEG · Deltek Wishlist Entry Generator",
    menu: "DWEG",
    descrizione: "Genera le voci YAML delle wishlist: compili un modulo, incolli un'immagine e copi il risultato.",
    icona: FileCode,
    gruppo: "Progetti",
  },
  {
    percorso: "/wishlist",
    titolo: "Wishlist Daniele",
    menu: "Wishlist",
    descrizione: "Idee regalo per Daniele: vinili, giochi da tavolo, elettronica e altro, in ordine di priorità.",
    icona: Gift,
    gruppo: "Personale",
  },
  {
    percorso: "/wishlistGiovy",
    titolo: "Wishlist Giovanni",
    menu: "Wishlist Giovy",
    descrizione: "Idee regalo per Giovanni, in ordine di priorità.",
    icona: GiftCard,
    gruppo: "Personale",
  },
];

// "/wishlist/" e "/wishlist" sono la stessa pagina
const normalizza = (percorso: string) => percorso.replace(/\/+$/, "") || "/";

export const stessoPercorso = (a: string, b: string) => normalizza(a) === normalizza(b);

export const paginaDi = (percorso: string) => PAGINE.find((pagina) => stessoPercorso(pagina.percorso, percorso));
