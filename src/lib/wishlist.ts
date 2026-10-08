// Accesso alle wishlist: ognuna è una collection definita in src/content.config.ts
import { getCollection, type CollectionEntry } from "astro:content";
import { collections } from "@/content.config";

export type NomeWishlist = keyof typeof collections;
export type VoceWishlist = CollectionEntry<NomeWishlist>;

export const NOMI_WISHLIST = Object.keys(collections) as NomeWishlist[];

// Voci ordinate per priorità (1 = la più desiderata) e poi per nome
export async function leggiWishlist(nome: NomeWishlist): Promise<VoceWishlist[]> {
  const voci: VoceWishlist[] = await getCollection(nome);
  return voci.sort((a, b) => a.data.priorità - b.data.priorità || a.data.nome.localeCompare(b.data.nome, "it"));
}
