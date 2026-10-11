// src/content.config.ts
// Le collection del sito: ogni wishlist e la watchlist sono file YAML in src/data/.
// Per aggiungere una wishlist: aggiungi una riga in WISHLIST e crea la sua pagina.
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

// ----- WISHLIST -----

const voce = z.object({
  quantità: z.number().int().default(1),
  categoria: z.string(),
  publisher: z.string(),
  artista: z.string().optional(),
  nome: z.string(),
  link: z.url(),
  immagine: z.string().nullish(),
  prezzo: z.number().nullable(),
  valuta: z.enum(["€", "$", "£"]),
  priorità: z.number().int(),
  note: z.string().nullish(),
});

const wishlist = (percorso: string) => defineCollection({ loader: file(percorso), schema: voce });

export const WISHLIST = {
  wishlist: wishlist("src/data/wishlist.yaml"),
  wishlistGiovy: wishlist("src/data/wishlistGiovy.yaml"),
};

// ----- WATCHLIST -----
// Le voci si generano con DMEG (src/pages/DMEG.astro) a partire dai dati di TMDB

const titolo = z.object({
  tmdb: z.number().int(),
  tipo: z.enum(["film", "serie"]),
  titolo: z.string(),
  titoloOriginale: z.string(),
  generi: z.array(z.string()),
  annoInizio: z.number().int().nullish(),
  annoFine: z.number().int().nullish(), // solo serie concluse
  stagioni: z.number().int().nullish(), // solo serie
  stagioniViste: z.number().int().nullish(), // solo serie
  stato: z.enum(["daVedere", "inCorso", "visto", "abbandonato"]),
  attori: z.array(z.string()),
  trailer: z.url().nullish(),
  locandina: z.url().nullish(),
  voto: z.number().int().min(1).max(5).nullish(),
  note: z.string().nullish(),
});

export const collections = {
  ...WISHLIST,
  watchlist: defineCollection({ loader: file("src/data/watchlist.yaml"), schema: titolo }),
};
