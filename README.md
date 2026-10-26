# Atlante · Finanza personale

Simulatore interattivo di accumulo patrimoniale di **Paolo Refuto**: azioni, BTP italiani, obbligazioni societarie e conto deposito, con costi, imposte e inflazione.

## Avvio

Aprire `index.html` in un browser. HTML, CSS e JavaScript sono contenuti nello stesso file: nessuna compilazione, dipendenza o server applicativo.

Per la pubblicazione, il punto di ingresso è `index.html` nella radice della repository. Su Vercel usare un progetto statico, preset **Other**, senza comando di build e con directory di output `.`. Non sono richieste variabili d’ambiente. La pubblicazione è a cura del proprietario.

Il pulsante **Scarica HTML** esporta una copia autonoma con le impostazioni correnti incorporate. Le impostazioni sono anche salvate nel browser (`localStorage`); non sono inviate a un server. Le precedenti impostazioni v4 vengono migrate alla v5 aggiungendo bollo e nuovi campi.

## Le quattro dashboard

1. **Il tuo piano:** versamenti, composizione, patrimonio netto, imposte e costi, rendimento annuo (TIR).
2. **Evoluzione nel tempo:** patrimonio e composizione per anno, versamenti, prospetto annuale ed esportazione CSV.
3. **Confronta scenari:** piano corrente, alternativa personalizzabile, portafoglio con una sola attività e 100% azionario.
4. **Formule e fonti:** convenzioni, riferimenti dei rendimenti e limiti del modello.

La vista iniziale è in euro reali, espressi nel potere d’acquisto di oggi. La vista nominale conserva gli importi alle rispettive date.

## Bollo e costi

- **Bollo:** aliquota iniziale 0,20% annuo per attività, modificabile (anche zero). Si applica al valore di fine anno, prima del prelievo, con rendicontazione annuale semplificata e senza minimi. Per finanziarlo il modello vende una quota proporzionale dell’attività, realizzando e tassando gli eventuali guadagni. Il bollo non riduce il guadagno imponibile. Non sono previsti versamenti esterni aggiuntivi per pagarlo.
- **Gestione / TER:** si sottrae in punti percentuali dal rendimento annuo, prima delle imposte, solo quando il rendimento inserito è indicato come precedente ai costi. Se il rendimento è già al netto della gestione, non si sottrae nuovamente il TER.
- **Commissioni di acquisto:** percentuale modificabile, inizialmente zero, applicata a ogni acquisto, compresi i trasferimenti dalla riserva. Riduce il capitale investito; la base fiscale include il costo di acquisto comprensivo della commissione.
- Le somme mostrate per il TER sono stime sul capitale a inizio anno. L’effetto complessivo dei costi confronta il piano con una simulazione senza i costi espliciti, includendo la variazione dei rendimenti e delle imposte. Non ricostruisce i costi già incorporati nei rendimenti inseriti.
- Il riepilogo distingue imposte sui rendimenti già pagate, imposte da liquidazione, bollo e costi. Gli importi reali dei pagamenti sono deflazionati alle rispettive date.

Riferimento operativo per il bollo: [ING](https://www.ing.it/faq/altre-informazioni/calcolo-imposta-di-bollo.html). Le condizioni del singolo prodotto e il trattamento fiscale effettivo possono differire dalle semplificazioni del modello.

## Fondo emergenza

Nel selettore **Come usi il deposito?** si può passare dalla quota percentuale al fondo emergenza. L’obiettivo iniziale è **10.000 euro reali**, modificabile, rivalutato annualmente con l’inflazione.

1. Capitale iniziale e nuovi versamenti completano prima il deposito fino all’obiettivo.
2. Il resto è investito in azioni, BTP e obbligazioni: le tre percentuali devono sommare a 100%.
3. A fine anno il deposito matura il rendimento e sostiene imposte e bollo. L’eccedenza netta rispetto all’obiettivo è trasferita alle altre attività.
4. Se mancano fondi, la riserva rimane sotto l’obiettivo e lo scarto è mostrato. I versamenti successivi la ricostituiscono; non si vendono forzatamente le altre attività.

La riserva è parte del patrimonio e dei versamenti del piano, non denaro aggiunto automaticamente. L’alternativa personalizzabile condivide la riserva. Gli scenari **100%** mantengono invece la loro composizione pura. Applicarne le quote al piano ripristina la modalità percentuale.

## Bande azionarie

Ogni scenario con azioni ha una banda ombreggiata dello stesso colore della linea, ottenuta variando **solo il rendimento azionario di ±2 punti percentuali annui**. Sono simulazioni deterministiche, non intervalli di confidenza, probabilità o limiti alle perdite. Le bande non aggiungono altre linee. L’ipotesi azionaria centrale rimane **8,4%**, modificabile.

## Convenzioni e limiti

- Capitale iniziale aggiuntivo e primo versamento investiti oggi; versamenti successivi a inizio anno. Non si conta due volte il primo versamento.
- Rendimento annuo effettivo costante; non si simulano volatilità, default o variazioni dei prezzi obbligazionari. Nessun ribilanciamento generale delle attività già investite.
- Aliquote iniziali: 26% su azioni, obbligazioni societarie e deposito; 12,5% sui BTP. Tutte modificabili.
- Tassazione finale, periodica o a cicli 3/5/10 anni. Ogni acquisto nei cicli ha una propria scadenza. I cicli sono ipotesi **senza cedole**, non una riproduzione del calendario fiscale dei BTP ordinari. La tassazione periodica è anch’essa una semplificazione del rendimento complessivo.
- Il riferimento obbligazionario è uno snapshot del rendimento a scadenza di un ETF corporate: non garantisce il rendimento futuro del fondo. L’8,4% azionario è un’ipotesi mantenuta nel simulatore, non una media certificata su uno specifico indice e periodo.
- Commissioni di vendita, compensazioni di minusvalenze, crediti fiscali e regimi speciali non sono modellati. Non è un calcolatore per dichiarazioni fiscali.
- Gli aggiornamenti BCE richiedono accesso a Internet. Se il browser o il servizio bloccano la richiesta, rimangono validi gli ultimi valori salvati e l’inserimento manuale.

## Verifiche

Con Node.js:

```sh
node tests/finance.test.cjs
```

I test estraggono il motore dal file HTML e verificano casi con risultati analitici: bollo con e senza guadagni, imposte realizzate, commissioni, TER già incluso, fondo insufficiente, obiettivo indicizzato, rinnovi, bande e identità contabili in tutte le frequenze fiscali.

## File storici

`Passive Finance.xlsx` è il foglio originale del progetto ed è conservato invariato.

Realizzato da [**Paolo Refuto ↗**](https://www.linkedin.com/in/paolo-refuto-6a5b52236/)
