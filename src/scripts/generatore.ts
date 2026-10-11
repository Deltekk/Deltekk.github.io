// Parti dell'interfaccia comuni ai generatori (DWEG, DMEG), legate ai componenti
// PannelloYaml e AzioniVoce di src/components/generatore/

// Mostra cosa manca alla voce, oppure il messaggio di voce pronta, e abilita la copia solo se è valida
export function mostraStato(problemi: string[], testoPronta: string) {
  const pronta = problemi.length === 0;
  const righe = pronta ? [testoPronta] : problemi;

  document.getElementById("stato")!.dataset.stato = pronta ? "pronta" : "errore";
  document
    .getElementById("problemi")!
    .replaceChildren(...righe.map((testo) => Object.assign(document.createElement("li"), { textContent: testo })));
  (document.getElementById("copia") as HTMLButtonElement).disabled = !pronta;
}

export function mostraYaml(testo: string) {
  document.getElementById("yaml")!.textContent = testo;
}

// "Copia YAML" copia il testo restituito da `yamlDaCopiare` e per un attimo mostra "Copiato!"
export function attivaCopia(yamlDaCopiare: () => string) {
  const bottone = document.getElementById("copia")!;
  bottone.addEventListener("click", async () => {
    await navigator.clipboard.writeText(yamlDaCopiare());
    bottone.toggleAttribute("data-copiato", true);
    setTimeout(() => bottone.removeAttribute("data-copiato"), 1500);
  });
}
