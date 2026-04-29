# 🎂 Sara's Birthday Site

## Struktura plików

```
sara-birthday/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js       ← logika gry
│   └── ticket.js     ← golden ticket PDF
└── images/
    ├── me.jpg            ← TWOJE zdjęcie (podmień!)
    ├── sara.jpg          ← JEJ zdjęcie (podmień!)
    └── embarrassing.jpg  ← embarrassing photo (podmień!)
```

## Co podmienić

1. **Zdjęcia** — wrzuć trzy pliki do folderu `images/`:
   - `me.jpg` — twoje zdjęcie (do sekcji "The Victim")
   - `sara.jpg` — jej zdjęcie (do sekcji "The Perpetrator")
   - `embarrassing.jpg` — embarrassing photo (nagrodza za 5 serc)

2. **Golden ticket** — jeśli chcesz zmienić treść ticketa, edytuj w `index.html` element `#ticket-render` (sekcja na samym dole przed `</body>`).

## Jak wrzucić na GitHub Pages

1. Skopiuj wszystkie pliki do swojego repo
2. W ustawieniach repo → Pages → Source: `main` branch, folder `/root`
3. Gotowe — GitHub poda Ci link

## Nagrody w grze

| Serca | Nagroda |
|-------|---------|
| 5  ❤️  | Embarrassing photo |
| 15 ❤️  | 3 pytania, 100% szczerość |
| 30 ❤️  | Golden Ticket (PDF do pobrania) |

## Uwagi

- Strona działa offline (poza Google Fonts — potrzebuje internetu do fontów)
- PDF ticketa generuje się przez html2canvas + jsPDF (ładowane z CDN przy kliknięciu)
- Gra działa na mobile (touch) i desktop (mysz)
