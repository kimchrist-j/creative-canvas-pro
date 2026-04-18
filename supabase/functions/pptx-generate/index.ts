// Edge function: AI PowerPoint generator
// Modes: { mode: "outline" } returns JSON deck for live preview; { mode: "pptx", deck } builds .pptx
import PptxGenJS from "npm:pptxgenjs@3.12.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Template = "midnight" | "coral" | "forest" | "minimal";

const THEMES: Record<Template, {
  bg: string; bgAlt: string; titleBg: string;
  primary: string; secondary: string; accent: string;
  text: string; textOnPrimary: string; subtext: string;
  titleFont: string; bodyFont: string;
}> = {
  midnight: { bg: "0F1735", bgAlt: "1A2354", titleBg: "07102A", primary: "F96167", secondary: "CADCFC", accent: "FFD166", text: "FFFFFF", textOnPrimary: "FFFFFF", subtext: "B8C4E0", titleFont: "Georgia", bodyFont: "Calibri" },
  coral:    { bg: "FFFBF5", bgAlt: "FFF1E6", titleBg: "F96167", primary: "F96167", secondary: "2F3C7E", accent: "F9E795", text: "1A1A2E", textOnPrimary: "FFFFFF", subtext: "555555", titleFont: "Trebuchet MS", bodyFont: "Calibri" },
  forest:   { bg: "F5F7F0", bgAlt: "E8EDD8", titleBg: "2C5F2D", primary: "2C5F2D", secondary: "97BC62", accent: "D4A24C", text: "1A2810", textOnPrimary: "FFFFFF", subtext: "4A5C3A", titleFont: "Cambria", bodyFont: "Calibri" },
  minimal:  { bg: "FFFFFF", bgAlt: "F2F2F2", titleBg: "212121", primary: "212121", secondary: "707070", accent: "F96167", text: "212121", textOnPrimary: "FFFFFF", subtext: "707070", titleFont: "Arial", bodyFont: "Arial" },
};

// Unsplash source URL — public, no API key needed, returns a topical photo
const imgUrl = (q: string, w = 1200, h = 800) =>
  `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(q)}`;

async function fetchImageData(query: string, w = 1200, h = 800): Promise<string | null> {
  try {
    const r = await fetch(imgUrl(query, w, h), { redirect: "follow" });
    if (!r.ok) return null;
    const buf = new Uint8Array(await r.arrayBuffer());
    // base64 encode
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    return `image/jpeg;base64,${btoa(bin)}`;
  } catch { return null; }
}

async function generateOutline(topic: string, slideCount: number, language: string, apiKey: string) {
  const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `You craft compelling, visually-rich presentations. Generate ${slideCount} slides in ${language}. Vary slide layouts: cover, split (image+text), grid (3-4 cards), stats (big numbers), quote, conclusion. For each slide pick the layout that best fits the content. Provide imageQuery (2-3 specific keywords for stock photo) per slide. Bullets max 10 words.` },
        { role: "user", content: `Topic: ${topic}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "build_deck",
          description: "Build slide deck",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string" },
              subtitle: { type: "string" },
              coverImageQuery: { type: "string", description: "2-3 keyword image search for cover" },
              slides: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    layout: { type: "string", enum: ["split", "grid", "stats", "quote", "conclusion"] },
                    heading: { type: "string" },
                    bullets: { type: "array", items: { type: "string" } },
                    imageQuery: { type: "string" },
                    quote: { type: "string", description: "for quote layout" },
                    quoteAuthor: { type: "string" },
                    stats: {
                      type: "array",
                      description: "for stats layout, 3 items",
                      items: { type: "object", properties: { value: { type: "string" }, label: { type: "string" } }, required: ["value", "label"] },
                    },
                    cards: {
                      type: "array",
                      description: "for grid layout, 3-4 items",
                      items: { type: "object", properties: { title: { type: "string" }, body: { type: "string" } }, required: ["title", "body"] },
                    },
                  },
                  required: ["layout", "heading"],
                },
              },
            },
            required: ["title", "subtitle", "slides"],
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "build_deck" } },
    }),
  });

  if (aiResp.status === 429) throw { status: 429, msg: "Rate limited." };
  if (aiResp.status === 402) throw { status: 402, msg: "AI credits exhausted." };
  if (!aiResp.ok) throw { status: 500, msg: `AI error ${aiResp.status}` };

  const aiData = await aiResp.json();
  return JSON.parse(aiData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments || "{}");
}

async function buildPptx(deck: any, template: Template, topic: string): Promise<Uint8Array> {
  const theme = THEMES[template] || THEMES.midnight;
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

  // Pre-fetch all images in parallel
  const imageQueries = [
    deck.coverImageQuery || topic,
    ...(deck.slides || []).map((s: any) => s.imageQuery || s.heading || topic),
  ];
  const images = await Promise.all(imageQueries.map(q => fetchImageData(q)));

  // ===== TITLE SLIDE =====
  const titleSlide = pres.addSlide();
  titleSlide.background = { color: theme.titleBg };
  if (images[0]) {
    titleSlide.addImage({ data: images[0], x: 7, y: 0, w: 6.333, h: 7.5, sizing: { type: "cover", w: 6.333, h: 7.5 } });
    // dark overlay on image side for legibility on coral/minimal
    titleSlide.addShape("rect", { x: 7, y: 0, w: 6.333, h: 7.5, fill: { color: theme.titleBg, transparency: 50 } });
  }
  // Left accent bar
  titleSlide.addShape("rect", { x: 0.5, y: 2.6, w: 0.15, h: 1.8, fill: { color: theme.primary } });
  titleSlide.addText(deck.title || topic, {
    x: 0.85, y: 2.4, w: 6, h: 1.8, fontSize: 48, bold: true, color: theme.textOnPrimary, fontFace: theme.titleFont, valign: "middle",
  });
  titleSlide.addText(deck.subtitle || "", {
    x: 0.85, y: 4.4, w: 6, h: 1.0, fontSize: 18, color: theme.secondary, fontFace: theme.bodyFont, italic: true,
  });
  titleSlide.addText("PRESENTATION", {
    x: 0.85, y: 6.4, w: 6, h: 0.4, fontSize: 11, color: theme.secondary, fontFace: theme.bodyFont, charSpacing: 8, bold: true,
  });

  // ===== CONTENT SLIDES =====
  (deck.slides || []).forEach((s: any, idx: number) => {
    const slide = pres.addSlide();
    const isAlt = idx % 2 === 1;
    slide.background = { color: isAlt ? theme.bgAlt : theme.bg };

    // Slide number badge
    slide.addShape("ellipse", { x: 12.5, y: 0.3, w: 0.55, h: 0.55, fill: { color: theme.primary } });
    slide.addText(String(idx + 2).padStart(2, "0"), {
      x: 12.5, y: 0.3, w: 0.55, h: 0.55, fontSize: 12, bold: true, color: theme.textOnPrimary, fontFace: theme.bodyFont, align: "center", valign: "middle",
    });

    const heading = s.heading || "";
    const img = images[idx + 1];

    if (s.layout === "split") {
      // Image left, text right
      if (img) slide.addImage({ data: img, x: 0, y: 0, w: 6, h: 7.5, sizing: { type: "cover", w: 6, h: 7.5 } });
      else slide.addShape("rect", { x: 0, y: 0, w: 6, h: 7.5, fill: { color: theme.primary } });
      slide.addShape("rect", { x: 6.5, y: 1.0, w: 0.5, h: 0.08, fill: { color: theme.primary } });
      slide.addText(heading, { x: 6.5, y: 1.2, w: 6.5, h: 1.4, fontSize: 32, bold: true, color: theme.text, fontFace: theme.titleFont, valign: "top" });
      const bullets = (s.bullets || []).map((b: string) => ({ text: b, options: { bullet: { code: "25CF" }, color: theme.text, fontFace: theme.bodyFont } }));
      slide.addText(bullets, { x: 6.5, y: 2.8, w: 6.5, h: 4.0, fontSize: 16, paraSpaceAfter: 10, valign: "top" });
    }
    else if (s.layout === "grid") {
      slide.addText(heading, { x: 0.7, y: 0.5, w: 11, h: 0.9, fontSize: 32, bold: true, color: theme.text, fontFace: theme.titleFont });
      slide.addShape("rect", { x: 0.7, y: 1.5, w: 0.6, h: 0.06, fill: { color: theme.primary } });
      const cards = (s.cards || (s.bullets || []).slice(0, 4).map((b: string) => ({ title: b.split(":")[0] || b.slice(0, 20), body: b }))) as any[];
      const cols = Math.min(cards.length, 4) > 2 ? 2 : cards.length;
      const rows = Math.ceil(cards.length / cols);
      const cardW = (12 - (cols - 1) * 0.4) / cols;
      const cardH = (5.0 - (rows - 1) * 0.4) / rows;
      cards.slice(0, 4).forEach((c: any, i: number) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = 0.7 + col * (cardW + 0.4);
        const cy = 2.0 + row * (cardH + 0.4);
        slide.addShape("rect", { x: cx, y: cy, w: cardW, h: cardH, fill: { color: isAlt ? theme.bg : theme.bgAlt }, line: { color: theme.primary, width: 0 } });
        slide.addShape("rect", { x: cx, y: cy, w: 0.08, h: cardH, fill: { color: theme.primary } });
        slide.addText(`0${i + 1}`, { x: cx + 0.3, y: cy + 0.2, w: 1, h: 0.4, fontSize: 14, bold: true, color: theme.primary, fontFace: theme.bodyFont });
        slide.addText(c.title || "", { x: cx + 0.3, y: cy + 0.6, w: cardW - 0.5, h: 0.6, fontSize: 16, bold: true, color: theme.text, fontFace: theme.titleFont });
        slide.addText(c.body || "", { x: cx + 0.3, y: cy + 1.2, w: cardW - 0.5, h: cardH - 1.3, fontSize: 12, color: theme.subtext, fontFace: theme.bodyFont, valign: "top" });
      });
    }
    else if (s.layout === "stats") {
      slide.addText(heading, { x: 0.7, y: 0.5, w: 11, h: 0.9, fontSize: 32, bold: true, color: theme.text, fontFace: theme.titleFont });
      slide.addShape("rect", { x: 0.7, y: 1.5, w: 0.6, h: 0.06, fill: { color: theme.primary } });
      const stats = (s.stats || (s.bullets || []).slice(0, 3).map((b: string) => ({ value: b.match(/\d+%?/)?.[0] || "•", label: b }))) as any[];
      const n = Math.min(stats.length, 3);
      const w = 12.0 / n;
      stats.slice(0, 3).forEach((st: any, i: number) => {
        const x = 0.7 + i * w;
        slide.addText(st.value || "", { x, y: 2.5, w: w - 0.3, h: 1.6, fontSize: 64, bold: true, color: theme.primary, fontFace: theme.titleFont, align: "center" });
        slide.addShape("rect", { x: x + (w - 0.3) / 2 - 0.3, y: 4.2, w: 0.6, h: 0.05, fill: { color: theme.accent } });
        slide.addText(st.label || "", { x, y: 4.4, w: w - 0.3, h: 1.5, fontSize: 14, color: theme.text, fontFace: theme.bodyFont, align: "center", valign: "top" });
      });
    }
    else if (s.layout === "quote") {
      if (img) {
        slide.addImage({ data: img, x: 0, y: 0, w: 13.333, h: 7.5, sizing: { type: "cover", w: 13.333, h: 7.5 } });
        slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: theme.titleBg, transparency: 35 } });
      } else {
        slide.background = { color: theme.titleBg };
      }
      slide.addText("\u201C", { x: 1.5, y: 1.2, w: 2, h: 2, fontSize: 140, color: theme.primary, fontFace: theme.titleFont, bold: true });
      slide.addText(s.quote || heading, { x: 2.5, y: 2.5, w: 9, h: 2.5, fontSize: 28, italic: true, color: theme.textOnPrimary, fontFace: theme.titleFont, align: "center", valign: "middle" });
      if (s.quoteAuthor) slide.addText(`— ${s.quoteAuthor}`, { x: 2.5, y: 5.2, w: 9, h: 0.6, fontSize: 16, color: theme.secondary, fontFace: theme.bodyFont, align: "center" });
    }
    else if (s.layout === "conclusion") {
      slide.background = { color: theme.titleBg };
      if (img) {
        slide.addImage({ data: img, x: 0, y: 0, w: 13.333, h: 7.5, sizing: { type: "cover", w: 13.333, h: 7.5 } });
        slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: theme.titleBg, transparency: 30 } });
      }
      slide.addText("THANK YOU", { x: 0.7, y: 2.5, w: 12, h: 1.2, fontSize: 64, bold: true, color: theme.textOnPrimary, fontFace: theme.titleFont, align: "center", charSpacing: 4 });
      slide.addShape("rect", { x: 6.166, y: 3.9, w: 1, h: 0.08, fill: { color: theme.primary } });
      slide.addText(heading || deck.title || topic, { x: 0.7, y: 4.2, w: 12, h: 0.8, fontSize: 18, color: theme.secondary, fontFace: theme.bodyFont, align: "center", italic: true });
      const bullets = (s.bullets || []).slice(0, 3);
      if (bullets.length) {
        slide.addText(bullets.join("  •  "), { x: 0.7, y: 5.5, w: 12, h: 0.6, fontSize: 12, color: theme.secondary, fontFace: theme.bodyFont, align: "center" });
      }
    }
    else {
      // fallback bullets
      slide.addText(heading, { x: 0.7, y: 0.5, w: 11, h: 1.0, fontSize: 36, bold: true, color: theme.text, fontFace: theme.titleFont });
      slide.addShape("rect", { x: 0.7, y: 1.6, w: 1.5, h: 0.06, fill: { color: theme.primary } });
      const bullets = (s.bullets || []).map((b: string) => ({ text: b, options: { bullet: { code: "25CF" }, color: theme.text, fontFace: theme.bodyFont } }));
      slide.addText(bullets, { x: 0.7, y: 2.0, w: 11.5, h: 4.5, fontSize: 18, paraSpaceAfter: 12, valign: "top" });
    }

    // Footer
    slide.addText(deck.title || topic, { x: 0.7, y: 7.05, w: 11, h: 0.3, fontSize: 9, color: theme.subtext, fontFace: theme.bodyFont });
  });

  return (await pres.write({ outputType: "uint8array" })) as Uint8Array;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { mode = "outline", topic, slideCount = 6, template = "midnight", language = "en", deck: providedDeck } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    if (mode === "outline") {
      if (!topic) throw new Error("topic required");
      const deck = await generateOutline(topic, slideCount, language, LOVABLE_API_KEY);
      return new Response(JSON.stringify({ deck }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (mode === "pptx") {
      const deck = providedDeck || (topic ? await generateOutline(topic, slideCount, language, LOVABLE_API_KEY) : null);
      if (!deck) throw new Error("deck or topic required");
      const buf = await buildPptx(deck, template as Template, topic || deck.title || "Presentation");
      return new Response(buf, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="${(deck.title || topic || "deck").replace(/[^a-z0-9]/gi, "_").slice(0, 40)}.pptx"`,
        },
      });
    }

    throw new Error("invalid mode");
  } catch (err: any) {
    console.error("pptx-generate error:", err);
    const status = err?.status || 500;
    const msg = err?.msg || (err instanceof Error ? err.message : "Unknown");
    return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
