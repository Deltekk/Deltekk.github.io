// Conversione delle immagini come urlToB64.sh, ma nel browser:
// 512x512, centrata su sfondo trasparente, WebP qualità 60, in base64.

const LATO = 512;
const QUALITA = 0.6;

export interface ImmagineConvertita {
  base64: string;
  dataUrl: string;
  descrizione: string;
}

export async function convertiImmagine(file: Blob): Promise<ImmagineConvertita> {
  // createImageBitmap applica già l'orientamento EXIF (-auto-orient)
  const bitmap = await createImageBitmap(file).catch((): never => {
    throw new Error("Il file non è un'immagine leggibile dal browser.");
  });

  // -resize 512x512 -gravity center -extent 512x512: adatta e centra su una tela trasparente
  const scala = Math.min(LATO / bitmap.width, LATO / bitmap.height);
  const larghezza = bitmap.width * scala;
  const altezza = bitmap.height * scala;
  const tela = new OffscreenCanvas(LATO, LATO);
  const contesto = tela.getContext("2d")!;
  contesto.imageSmoothingQuality = "high";
  contesto.drawImage(bitmap, (LATO - larghezza) / 2, (LATO - altezza) / 2, larghezza, altezza);
  bitmap.close();

  let blob = await tela.convertToBlob({ type: "image/webp", quality: QUALITA });
  if (blob.type !== "image/webp") {
    // Safari non sa creare WebP: ripiega su JPEG, che non ha trasparenza, con sfondo bianco
    contesto.globalCompositeOperation = "destination-over";
    contesto.fillStyle = "white";
    contesto.fillRect(0, 0, LATO, LATO);
    blob = await tela.convertToBlob({ type: "image/jpeg", quality: QUALITA });
  }

  const dataUrl = await leggiComeDataUrl(blob);
  const formato = blob.type === "image/webp" ? "WebP" : "JPEG";
  return {
    base64: dataUrl.slice(dataUrl.indexOf(",") + 1),
    dataUrl,
    descrizione: `${formato} ${LATO}×${LATO}, qualità ${QUALITA * 100}`,
  };
}

// La maggior parte dei negozi non abilita il CORS, e allora il browser blocca il download
export async function scaricaImmagine(url: string): Promise<Blob> {
  const risposta = await fetch(url).catch((): never => {
    throw new Error(
      "Il sito non permette di scaricare l'immagine da qui: fai tasto destro sull'immagine → Copia immagine, poi Ctrl+V su questa pagina.",
    );
  });
  if (!risposta.ok) throw new Error(`Il sito ha risposto ${risposta.status}.`);
  return risposta.blob();
}

function leggiComeDataUrl(blob: Blob): Promise<string> {
  return new Promise((risolvi, rifiuta) => {
    const lettore = new FileReader();
    lettore.onload = () => risolvi(lettore.result as string);
    lettore.onerror = () => rifiuta(lettore.error);
    lettore.readAsDataURL(blob);
  });
}
