import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// Proste loggery by symulować aktywne środowisko
app.use((req, res, next) => {
    console.log(`[MostPomocy API] ${req.method} ${req.url}`);
    next();
});

// Zakończenie aplikacji API Statystyk
app.get('/api/stats', (req, res) => {
    res.json({
        visitorsToday: Math.floor(Math.random() * 500) + 1200,
        uniqueUsers: Math.floor(Math.random() * 300) + 800
    });
});

// Symulacja EndPointu Google Apps Script / GitHub Backend
app.post('/api/save-post', (req, res) => {
    const { title, tags, category, metaDesc, summary, content } = req.body;
    
    const date = new Date().toISOString();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Generowanie natywnej struktury Front Matter pod motyw Stack
    const mdContent = `---
title: "${title}"
date: ${date}
draft: false
description: "${metaDesc}"
summary: "${summary}"
categories:
  - "${category}"
tags:
${tags.map((t: string) => `  - "${t}"`).join('\n')}
image: "https://placehold.co/800x400"
---

${content}
`;

    const dir = path.join(process.cwd(), 'content', 'posts');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const filePath = path.join(dir, `${slug}.md`);
    fs.writeFileSync(filePath, mdContent);
    
    console.log(`✅ Plik Markdown został utworzony poprawnie (Zapis na dysku): ${filePath}`);
    
    // Minimalne opóźnienie by zasymulować odpowiedź Backendu
    setTimeout(() => {
        res.json({ success: true, file: filePath });
    }, 800);
});

// Routing do zapytań SPA (Czysty HTML z Tailwind)
app.use('/static', express.static(path.join(process.cwd(), 'static')));
app.use(express.static(process.cwd()));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MostPomocy CMS Server and Site started on http://0.0.0.0:${PORT}`);
});
