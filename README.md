# MostPomocy.pl

Projekt społeczny – Mapa Pomocy oraz Baza Wiedzy.

## Jak uruchomić lokalnie?

Zanim zaczniesz, upewnij się, że masz zainstalowany **Node.js** (zalecana wersja 18 lub nowsza).

1. **Pobierz projekt** na swój komputer.
2. **Otwórz terminal** w folderze projektu.
3. **Zainstaluj zależności**:
   ```bash
   npm install
   ```
4. **Uruchom serwer deweloperski**:
   ```bash
   npm run dev
   ```
5. Otwórz w przeglądarce adres: `http://localhost:3000`

## Jak dodać nowy wpis na blogu?

### Opcja A: Automatyczny generator (Zalecane)
Jeśli pracujesz lokalnie, uruchom proste narzędzie w terminalu:
```bash
node scripts/gen-post.cjs
```
Skrypt zapyta Cię o tytuł i inne dane, a następnie sam wygeneruje poprawny plik w `src/content/posts/`.

### Opcja B: Ręczne tworzenie pliku
1. Przejdź do folderu `src/content/posts/`.
2. Stwórz nowy plik z rozszerzeniem `.md` (np. `moj-nowy-artykul.md`).
3. Skopiuj strukturę nagłówka (YAML Front Matter):

```markdown
---
title: "Tytuł artykułu"
date: "2024-05-18"
category: "Kategoria"
tags: ["tag1", "tag2"]
excerpt: "Krótki opis..."
image: "https://link-do-obrazka.jpg"
resources:
  - title: "Link wsparcia"
    desc: "Krótki opis linku"
    url: "https://mostpomocy.pl"
---
```

System automatycznie wykryje nowy plik i doda go do listy na stronie Blog.

## Praca z GitHub

Projekt jest gotowy do hostowania na **GitHub Pages**.
Po wrzuceniu plików na repozytorium:
1. Upewnij się, że w `vite.config.ts` wartość `base` jest ustawiona poprawnie (obecnie `./` dla maksymalnej kompatybilności).
2. Zbuduj projekt: `npm run build`.
3. Zawartość folderu `dist/` wrzuć na gałąź `gh-pages` lub skonfiguruj GitHub Actions.
