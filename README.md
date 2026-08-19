# Internet banking TB — Demo

Lokálna **ukážková kópia** internet bankingu Tatra banky v Reacte.  
Nie je to oficiálna služba banky. Žiadne dáta sa neodosielajú na server — všetko ostáva v prehliadači.

## Spustenie

```bat
start.bat
```

alebo:

```bash
npm install
npm run dev
```

Otvorte http://localhost:5173

## Demo prihlásenie

- **PID:** `0511034199`
- **Heslo:** `k?ymw7vJ`
- **Čítačka TB:** `051103`

## Čo je v aplikácii

- Prihlásenie PID + heslo + overenie Čítačkou
- Prehľad (účty, zostatky, posledné pohyby, kurzy)
- Účty a história pohybov + export CSV
- Platby SEPA / okamžité, šablóny, trvalé príkazy, prevod medzi účtami
- Karty — limity, PIN, blokovanie
- **Digitálne termínované vklady** (sadzby 1,7–2,5 % p.a.)
- **Spending report TB** — kategórie, grafy, história výdavkov
- Príjemcovia, dokumenty / výpisy, schránka, nastavenia

Údaje klienta (Martin Kováč) sú fiktívne.
