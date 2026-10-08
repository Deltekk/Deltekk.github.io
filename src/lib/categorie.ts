// Icona di ogni categoria delle wishlist; le categorie non elencate usano il cartellino (Tag)
import type { SvgComponent } from "astro/types";
import Book from "@tabler/icons/outline/book.svg";
import Books from "@tabler/icons/outline/books.svg";
import Cpu from "@tabler/icons/outline/cpu.svg";
import Dice from "@tabler/icons/outline/dice-5.svg";
import Disc from "@tabler/icons/outline/disc.svg";
import Gamepad from "@tabler/icons/outline/device-gamepad-2.svg";
import Movie from "@tabler/icons/outline/movie.svg";
import Package from "@tabler/icons/outline/package.svg";
import Plug from "@tabler/icons/outline/plug.svg";
import Tag from "@tabler/icons/outline/tag.svg";
import Vinyl from "@tabler/icons/outline/vinyl.svg";

const icone: Record<string, SvgComponent> = {
  Vinili: Vinyl,
  Vinile: Vinyl,
  CD: Disc,
  Manga: Book,
  Libri: Books,
  Videogame: Gamepad,
  "Giochi da tavolo": Dice,
  BluRay: Movie,
  IOT: Plug,
  Elettronica: Cpu,
  Accessori: Package,
};

export const iconaCategoria = (categoria: string): SvgComponent => icone[categoria] ?? Tag;
