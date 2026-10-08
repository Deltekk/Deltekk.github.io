// src/content.config.ts
// Ogni wishlist è un file YAML in src/data/ letto con lo stesso schema delle voci.
// Per aggiungere una wishlist: aggiungi qui una riga in `collections` e crea la sua pagina.
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

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

export const collections = {
  wishlist: wishlist("src/data/wishlist.yaml"),
  wishlistGiovy: wishlist("src/data/wishlistGiovy.yaml"),
};
