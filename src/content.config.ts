// src/content.config.ts
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const wishlist = defineCollection({
  loader: file("src/data/wishlist.yaml"),
    schema: z.object({
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
    }),
});

const wishlistGiovy = defineCollection({
  loader: file("src/data/wishlistGiovy.yaml"),
    schema: z.object({
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
    }),
});

export const collections = { wishlist, wishlistGiovy };