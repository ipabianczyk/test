import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Logging middleware
    app.use((req, res, next) => {
        console.log(`[MostPomocy API] ${req.method} ${req.url}`);
        next();
    });

    // 1. Cloudflare Web Analytics Simulated/GraphQL API proxy endpoint
    app.get('/api/stats', (req, res) => {
        res.json({
            visitorsToday: Math.floor(Math.random() * 500) + 12042,
            uniqueUsers: Math.floor(Math.random() * 300) + 2431
        });
    });

    // 2. Hugo .md Post creation endpoint (Google Apps Script / GitHub Backend Proxy simulation)
    app.post('/api/save-post', (req, res) => {
        const { title, tags, category, metaDesc, summary, content } = req.body;
        
        const date = new Date().toISOString();
        const slug = title.trim().toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // remove special chars
            .replace(/\s+/g, '-')        // spaces to -
            .replace(/-+/g, '-')         // remove double -
            .replace(/(^-|-$)+/g, '');    // trim leading/ending dashes
        
        // Generating compliant Front Matter for Hugo Theme "Stack"
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
image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
---

${content}
`;

        const dir = path.join(process.cwd(), 'src', 'content', 'posts');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const filePath = path.join(dir, `${slug || 'unnamed-post'}.md`);
        fs.writeFileSync(filePath, mdContent);
        
        console.log(`✅ Plik Markdown został utworzony poprawnie (Zapis na dysku): ${filePath}`);
        
        // Return success matching CRUD operations
        setTimeout(() => {
            res.json({ success: true, file: filePath });
        }, 800);
    });

    // 3. Static directory for isolated Admin interface
    app.use('/static', express.static(path.join(process.cwd(), 'static')));

    // 4. Vite Dev Server Middleware or Production Static Fallback
    if (process.env.NODE_ENV !== "production") {
        console.log("⚙️ Starting Vite in development mode...");
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        
        // Process requests through Vite development middleware
        app.use(vite.middlewares);
    } else {
        console.log("📦 Starting server in production mode...");
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*all', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 (MostPomocy CMS with Vite) Backend & Frontend live on http://localhost:${PORT}`);
    });
}

startServer().catch((err) => {
    console.error("Critical error starting Express + Vite server:", err);
});
