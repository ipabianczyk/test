const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function generate() {
  console.log('\n--- Generator Postów MostPomocy.pl ---\n');

  const title = await ask('Tytuł wpisu: ');
  const category = await ask('Kategoria (np. Poradnik, Prawo, Zdrowie): ');
  const excerpt = await ask('Krótki opis (zajawka): ');
  const tagsInput = await ask('Tagi (oddzielone przecinkami): ');
  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

  const slug = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  const date = new Date().toISOString().split('T')[0];
  
  const content = `---
title: "${title}"
date: "${date}"
author: "Igor Pabiańczyk"
category: "${category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
readTime: "5 min"
excerpt: "${excerpt}"
image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"
resources:
  - title: "Przykładowy link pomocowy"
    desc: "Opis przydatnego narzędzia lub instytucji."
    url: "https://mostpomocy.pl"
---

## Twój nagłówek

Tutaj wpisz treść artykułu w formacie Markdown. Możesz używać:
- **Pogrubienia**
- *Kursywy*
- [Linków](https://mostpomocy.pl)
- List punktowanych
`;

  const dir = path.join(__dirname, '..', 'src', 'content', 'posts');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content);

  console.log(`\n✅ Sukces! Utworzono plik: ${filePath}`);
  rl.close();
}

generate();
