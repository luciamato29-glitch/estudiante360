import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GLOBAL_CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');",
  "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",

  /* LIGHT */
  ":root {",
  "  --bg:#f0f0f5; --surface:#e8e8f0; --card:#ffffff; --border:#d4d2e0;",
  "  --accent:#7c5cbf; --accent2:#a076d4; --accent3:#e06b8a; --accent4:#5aacb8; --lavender:#9b89d4;",
  "  --text:#1e1c2e; --muted:#7a778f; --shadow:rgba(60,55,100,.10);",
  "  --font-head:'Fraunces',serif; --font-body:'DM Sans',sans-serif; --r:12px; --r-lg:18px;",
  "}",
  ".sb-btn.active{background:rgba(124,92,191,.12)}",
  ".bubble.bot,.task-note-inp,.cal-day,.materia-card,.post-card,.mood-tile,.task-item,.event-chip,.topbar-pill,.diary-entry,.achievement-card{background:var(--surface)}",
  ".mood-tile.sel{background:var(--card)}",

  /* DARK system */
  "@media(prefers-color-scheme:dark){",
  "  :root:not([data-theme='light']){--bg:#14131f;--surface:#1c1b2e;--card:#252340;--border:#322f50;--accent:#b89aef;--accent2:#d4aaff;--accent3:#f08aaa;--accent4:#7dd4de;--lavender:#c4b4f4;--text:#edeaf8;--muted:#7d7a9a;--shadow:rgba(0,0,0,.45)}",
  "  :root:not([data-theme='light']) .sb-btn.active{background:rgba(184,154,239,.13)}",
  "  :root:not([data-theme='light']) .bubble.bot,.task-note-inp,.cal-day,.materia-card,.post-card,.mood-tile,.task-item,.event-chip,.topbar-pill,.diary-entry,.achievement-card{background:var(--surface)}",
  "  :root:not([data-theme='light']) .mood-tile.sel{background:var(--card)}",
  "}",

  /* DARK forced */
  "[data-theme='dark']{--bg:#14131f;--surface:#1c1b2e;--card:#252340;--border:#322f50;--accent:#b89aef;--accent2:#d4aaff;--accent3:#f08aaa;--accent4:#7dd4de;--lavender:#c4b4f4;--text:#edeaf8;--muted:#7d7a9a;--shadow:rgba(0,0,0,.45)}",
  "[data-theme='dark'] .sb-btn.active{background:rgba(184,154,239,.13)}",
  "[data-theme='dark'] .bubble.bot,[data-theme='dark'] .task-note-inp,[data-theme='dark'] .cal-day,[data-theme='dark'] .materia-card,[data-theme='dark'] .post-card,[data-theme='dark'] .mood-tile,[data-theme='dark'] .task-item,[data-theme='dark'] .event-chip,[data-theme='dark'] .topbar-pill,[data-theme='dark'] .diary-entry,[data-theme='dark'] .achievement-card{background:var(--surface)}",
  "[data-theme='dark'] .mood-tile.sel{background:var(--card)}",

  /* LIGHT forced */
  "[data-theme='light']{--bg:#f0f0f5;--surface:#e8e8f0;--card:#ffffff;--border:#d4d2e0;--accent:#7c5cbf;--accent2:#a076d4;--accent3:#e06b8a;--accent4:#5aacb8;--lavender:#9b89d4;--text:#1e1c2e;--muted:#7a778f;--shadow:rgba(60,55,100,.10)}",
  "[data-theme='light'] .sb-btn.active{background:rgba(124,92,191,.12)}",
  "[data-theme='light'] .bubble.bot,[data-theme='light'] .task-note-inp,[data-theme='light'] .cal-day,[data-theme='light'] .materia-card,[data-theme='light'] .post-card,[data-theme='light'] .mood-tile,[data-theme='light'] .task-item,[data-theme='light'] .event-chip,[data-theme='light'] .topbar-pill,[data-theme='light'] .diary-entry,[data-theme='light'] .achievement-card{background:var(--surface)}",
  "[data-theme='light'] .mood-tile.sel{background:var(--card)}",

  ".theme-btn{width:38px;height:38px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;transition:all .18s;flex-shrink:0}",
  ".theme-btn:hover{border-color:var(--accent);color:var(--accent)}",

  "body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}",
  "::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}",

  ".shell{display:flex;min-height:100vh;flex-direction:column} .body-row{display:flex;flex:1}",

  /* sidebar */
  ".sidebar{width:68px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:20px 0 16px;gap:4px;position:sticky;top:0;height:100vh;overflow-y:auto}",
  ".sb-logo{font-family:var(--font-head);font-size:20px;font-weight:700;color:var(--accent);letter-spacing:-.5px;margin-bottom:18px;line-height:1;text-align:center}",
  ".sb-logo span{display:block;font-size:9px;font-weight:400;font-family:var(--font-body);color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-top:3px}",
  ".sb-btn{width:44px;height:44px;border-radius:12px;border:none;background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;font-size:19px;position:relative}",
  ".sb-btn:hover{background:var(--card);color:var(--text)} .sb-btn.active{color:var(--accent)}",
  ".sb-btn .tip{position:absolute;left:54px;background:var(--card);border:1px solid var(--border);font-family:var(--font-body);font-size:11px;padding:5px 10px;border-radius:8px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s;z-index:50;color:var(--text)}",
  ".sb-btn:hover .tip{opacity:1}",

  /* topbar */
  ".topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px 14px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:20}",
  ".topbar-title{font-family:var(--font-head);font-size:22px;font-weight:600}",
  ".topbar-title em{color:var(--accent);font-style:normal}",
  ".topbar-right{display:flex;align-items:center;gap:10px}",
  ".topbar-pill{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border);border-radius:50px;padding:6px 14px;font-size:13px;color:var(--muted)}",
  ".topbar-pill .dot{width:8px;height:8px;border-radius:50%;background:var(--accent4);flex-shrink:0}",

  ".main{flex:1;overflow-y:auto} .section-wrap{padding:24px 28px 40px;animation:fadeUp .3s ease}",
  "@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
  "@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}",
  "@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}",
  "@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}",

  ".sec-head{margin-bottom:20px}",
  ".sec-head h2{font-family:var(--font-head);font-size:26px;font-weight:600;line-height:1.15}",
  ".sec-head h2 em{color:var(--accent);font-style:italic}",
  ".sec-head p{font-size:13px;color:var(--muted);margin-top:5px}",

  ".card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;box-shadow:0 2px 10px var(--shadow)}",

  ".g2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}",
  ".g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}",
  ".g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}",
  ".g-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}",
  ".flex{display:flex;gap:10px;align-items:center} .flex-col{display:flex;flex-direction:column;gap:8px}",
  ".flex-wrap{flex-wrap:wrap} .flex1{flex:1}",
  ".mt8{margin-top:8px} .mt12{margin-top:12px} .mt16{margin-top:16px} .mt20{margin-top:20px}",
  ".mb8{margin-bottom:8px} .mb12{margin-bottom:12px} .mb16{margin-bottom:16px} .mb20{margin-bottom:20px}",
  ".center{text-align:center} .muted{color:var(--muted);font-size:13px}",

  ".inp{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:10px 14px;color:var(--text);font-family:var(--font-body);font-size:14px;outline:none;transition:border-color .2s;width:100%}",
  ".inp:focus{border-color:var(--accent)} .inp::placeholder{color:var(--muted)}",
  "textarea.inp{resize:vertical;min-height:72px}",
  ".sel{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:10px 14px;color:var(--text);font-family:var(--font-body);font-size:14px;outline:none;cursor:pointer}",

  ".btn{background:var(--accent);color:var(--bg);border:none;border-radius:var(--r);padding:10px 20px;font-family:var(--font-body);font-size:14px;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap}",
  ".btn:hover{opacity:.85} .btn:disabled{opacity:.35;cursor:not-allowed}",
  ".btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text);border-radius:var(--r);padding:10px 20px;font-family:var(--font-body);font-size:14px;font-weight:500;cursor:pointer;transition:all .18s}",
  ".btn-ghost:hover{border-color:var(--accent);color:var(--accent)} .btn-sm{padding:7px 14px;font-size:12px;border-radius:9px}",

  ".badge{display:inline-flex;align-items:center;font-family:var(--font-body);font-size:10px;font-weight:600;padding:3px 8px;border-radius:50px;letter-spacing:.4px}",
  ".prog-wrap{background:var(--surface);border-radius:50px;height:5px;overflow:hidden}",
  ".prog-fill{height:100%;border-radius:50px;transition:width .6s ease}",
  ".toast{position:fixed;bottom:28px;right:28px;background:var(--card);border:1px solid var(--border);border-left:3px solid var(--accent4);border-radius:var(--r);padding:12px 18px;font-size:13px;z-index:999;animation:slideIn .3s ease;box-shadow:0 8px 32px var(--shadow)}",

  /* chat */
  ".chat-shell{display:flex;flex-direction:column;height:calc(100vh - 82px)}",
  ".chat-msgs{flex:1;overflow-y:auto;padding:16px 0;display:flex;flex-direction:column;gap:12px}",
  ".bubble{max-width:72%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.65;animation:fadeUp .25s ease}",
  ".bubble.user{align-self:flex-end;background:var(--accent2);color:#fff;border-bottom-right-radius:4px}",
  ".bubble.bot{align-self:flex-start;border:1px solid var(--border);border-bottom-left-radius:4px}",
  ".chat-bar{display:flex;gap:10px;padding-top:12px;border-top:1px solid var(--border)}",
  ".send-btn{background:var(--accent);color:var(--bg);border:none;border-radius:var(--r);width:46px;flex-shrink:0;font-size:18px;cursor:pointer;transition:opacity .18s;display:flex;align-items:center;justify-content:center}",
  ".send-btn:hover{opacity:.85} .send-btn:disabled{opacity:.35;cursor:not-allowed}",
  ".typing-dots{display:flex;gap:4px;align-items:center;padding:4px 2px}",
  ".typing-dots span{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:bounce 1.2s ease infinite}",
  ".typing-dots span:nth-child(2){animation-delay:.2s} .typing-dots span:nth-child(3){animation-delay:.4s}",

  /* mood */
  ".mood-grid{display:flex;gap:10px;flex-wrap:wrap}",
  ".mood-tile{flex:1;min-width:90px;padding:16px 10px;border-radius:var(--r);border:2px solid transparent;text-align:center;cursor:pointer;transition:all .18s}",
  ".mood-tile:hover{border-color:var(--accent);transform:translateY(-2px)} .mood-tile.sel{border-color:var(--accent)}",
  ".mood-tile .emo{font-size:28px} .mood-tile .lbl{font-size:11px;color:var(--muted);margin-top:5px}",
  ".mood-bars{display:flex;gap:8px;align-items:flex-end;height:64px;margin-top:20px}",
  ".mood-bar-item{flex:1;border-radius:5px 5px 0 0;min-height:6px;transition:height .5s ease;position:relative}",
  ".mood-bar-item .dl{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:10px;color:var(--muted)}",
  ".cause-tag{padding:6px 12px;border-radius:50px;border:1.5px solid var(--border);background:transparent;font-family:var(--font-body);font-size:12px;color:var(--muted);cursor:pointer;transition:all .15s}",
  ".cause-tag:hover{border-color:var(--accent);color:var(--accent)} .cause-tag.sel{border-color:var(--accent);background:rgba(124,92,191,.1);color:var(--accent)}",
  ".intensity-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--muted)}",
  ".intensity-dot.sel{border-color:var(--accent);color:var(--accent);background:rgba(124,92,191,.1)}",

  /* calendar */
  ".cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}",
  ".cal-day-hdr{text-align:center;font-size:10px;font-weight:600;color:var(--muted);padding:6px 0;text-transform:uppercase;letter-spacing:.5px}",
  ".cal-day{aspect-ratio:1;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:all .15s;position:relative;border:1px solid transparent}",
  ".cal-day:hover{border-color:var(--accent)} .cal-day.today{background:rgba(124,92,191,.1);border-color:var(--accent);color:var(--accent);font-weight:700}",
  ".cal-day.has-event::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--accent2)}",
  ".cal-day.empty{background:transparent!important;border:none;cursor:default}",
  ".event-chip{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;border-left:3px solid var(--accent);margin-bottom:8px;font-size:13px}",
  ".event-chip .ev-date{font-size:11px;color:var(--muted);min-width:70px}",

  /* materias */
  ".materia-card{padding:16px;border-radius:var(--r);border:1px solid var(--border);transition:border-color .18s}",
  ".materia-card:hover{border-color:var(--accent)} .materia-name{font-weight:600;font-size:14px;margin-bottom:5px}",
  ".materia-meta{font-size:12px;color:var(--muted);margin-bottom:10px}",

  /* tasks */
  ".task-item{border-radius:13px;border:1px solid var(--border);margin-bottom:8px;animation:fadeUp .25s ease;overflow:hidden;transition:border-color .18s}",
  ".task-item:hover{border-color:var(--accent)} .task-item.done{opacity:.55}",
  ".task-main{display:flex;align-items:center;gap:10px;padding:11px 14px}",
  ".task-item.done .task-text{text-decoration:line-through}",
  ".task-check{width:20px;height:20px;border-radius:6px;border:2px solid var(--accent);flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;font-size:11px;background:transparent;color:var(--bg)}",
  ".task-check.done{background:var(--accent);border-color:var(--accent)}",
  ".task-text{flex:1;font-size:14px} .task-has-note{width:6px;height:6px;border-radius:50%;background:var(--accent2);flex-shrink:0}",
  ".task-expand-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 2px;line-height:1;transition:color .15s}",
  ".task-expand-btn:hover{color:var(--accent)} .task-del{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 4px;transition:color .15s}",
  ".task-del:hover{color:var(--accent3)} .task-notes-panel{padding:0 14px 12px 44px;animation:fadeUp .2s ease}",
  ".task-note-inp{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:9px 12px;color:var(--text);font-family:var(--font-body);font-size:13px;outline:none;resize:none;min-height:68px;transition:border-color .2s}",
  ".task-note-inp:focus{border-color:var(--accent)} .task-note-inp::placeholder{color:var(--muted)}",
  ".energy-badge{font-size:10px;padding:2px 7px;border-radius:50px;font-weight:600;border:1px solid transparent}",

  /* breathe */
  ".breath-ring{width:180px;height:180px;border-radius:50%;border:2.5px solid var(--accent4);display:flex;align-items:center;justify-content:center;margin:0 auto;cursor:pointer;transition:transform 4s ease-in-out,box-shadow 4s ease-in-out}",
  ".breath-ring.expand{transform:scale(1.5);box-shadow:0 0 60px rgba(90,172,184,.25)}",
  ".breath-ring.hold{transform:scale(1.5);box-shadow:0 0 80px rgba(90,172,184,.4)}",
  ".breath-ring.shrink{transform:scale(1);box-shadow:none}",
  ".breath-text{text-align:center;color:var(--accent4);font-family:var(--font-head)}",
  ".breath-num{font-size:40px;font-weight:600;line-height:1} .breath-lbl{font-size:14px;margin-top:4px}",

  /* community */
  ".post-card{padding:16px;border-radius:var(--r-lg);border:1px solid var(--border);margin-bottom:12px;transition:border-color .18s;animation:fadeUp .3s ease}",
  ".post-card:hover{border-color:var(--accent2)}",
  ".post-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background:var(--card);flex-shrink:0}",
  ".post-author{font-weight:600;font-size:14px} .post-time{font-size:11px;color:var(--muted)}",
  ".post-body{font-size:14px;line-height:1.65;margin:10px 0}",
  ".post-actions{display:flex;gap:14px;align-items:center}",
  ".post-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px;transition:color .15s;font-family:var(--font-body)}",
  ".post-btn:hover{color:var(--accent3)} .post-btn.liked{color:var(--accent3)}",
  ".kira-reply{margin-top:10px;padding:10px 14px;border-radius:10px;background:rgba(124,92,191,.07);border-left:3px solid var(--accent);font-size:13px;color:var(--text);line-height:1.6}",
  ".kira-reply-hdr{font-size:11px;color:var(--accent);font-weight:600;margin-bottom:5px}",

  /* stat */
  ".stat-card{padding:18px;border-radius:var(--r-lg);position:relative;overflow:hidden}",
  ".stat-val{font-family:var(--font-head);font-size:36px;font-weight:700;line-height:1}",
  ".stat-lbl{font-size:11px;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.6px}",
  ".stat-icon{position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:38px;opacity:.1}",

  /* SOS */
  ".sos-btn{position:fixed;bottom:90px;right:28px;width:52px;height:52px;border-radius:50%;background:var(--accent3);border:none;color:#fff;font-size:22px;cursor:pointer;z-index:100;box-shadow:0 4px 20px rgba(224,107,138,.45);transition:transform .2s;display:flex;align-items:center;justify-content:center}",
  ".sos-btn:hover{transform:scale(1.1)}",
  ".sos-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeUp .2s ease}",
  ".sos-modal{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:28px;max-width:420px;width:90%;box-shadow:0 20px 60px var(--shadow);animation:popIn .25s ease}",
  ".sos-tech{padding:14px 16px;border-radius:12px;background:var(--surface);border:1px solid var(--border);margin-bottom:10px;cursor:pointer;transition:border-color .15s}",
  ".sos-tech:hover{border-color:var(--accent)} .sos-tech-title{font-weight:600;font-size:14px;margin-bottom:3px}",
  ".sos-tech-desc{font-size:12px;color:var(--muted);line-height:1.5}",
  ".step-card{padding:12px 14px;border-radius:10px;background:var(--surface);border-left:3px solid var(--accent4);margin-bottom:8px;font-size:14px;animation:fadeUp .3s ease}",

  /* diary */
  ".diary-entry{padding:16px;border-radius:var(--r);border:1px solid var(--border);margin-bottom:10px;cursor:pointer;transition:border-color .18s}",
  ".diary-entry:hover{border-color:var(--accent)}",
  ".diary-date{font-size:11px;color:var(--muted);margin-bottom:6px}",
  ".diary-preview{font-size:14px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",

  /* achievements */
  ".achievement-card{padding:16px;border-radius:var(--r);border:1px solid var(--border);display:flex;align-items:flex-start;gap:14px;animation:popIn .3s ease}",
  ".achievement-icon{font-size:32px;flex-shrink:0}",
  ".achievement-name{font-weight:600;font-size:14px;margin-bottom:3px}",
  ".achievement-desc{font-size:12px;color:var(--muted);line-height:1.5}",
  ".achievement-card.locked{opacity:.38;filter:grayscale(1)}",

  /* study methods */
  ".method-card{padding:18px;border-radius:var(--r-lg);border:1px solid var(--border);cursor:pointer;transition:all .18s;position:relative;overflow:hidden}",
  ".method-card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 6px 20px var(--shadow)}",
  ".method-card.open{border-color:var(--accent);background:rgba(124,92,191,.05)}",
  ".method-icon{font-size:28px;margin-bottom:10px}",
  ".method-name{font-family:var(--font-head);font-size:16px;font-weight:600;margin-bottom:4px}",
  ".method-body{font-size:13px;color:var(--muted);line-height:1.65}",
  ".method-steps{margin-top:14px;padding-top:14px;border-top:1px solid var(--border);animation:fadeUp .2s ease}",
  ".method-step{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;font-size:13px;line-height:1.55}",
  ".step-num{width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px}",

  /* auth */
  ".auth-shell{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:20px}",
  ".auth-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:36px 32px;width:100%;max-width:400px;box-shadow:0 8px 40px var(--shadow);animation:popIn .3s ease}",
  ".auth-logo{font-family:var(--font-head);font-size:32px;font-weight:700;color:var(--accent);text-align:center;margin-bottom:4px}",
  ".auth-logo span{display:block;font-size:11px;font-weight:400;font-family:var(--font-body);color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-top:2px}",
  ".auth-title{font-family:var(--font-head);font-size:20px;font-weight:600;text-align:center;margin-bottom:6px}",
  ".auth-subtitle{font-size:13px;color:var(--muted);text-align:center;margin-bottom:24px;line-height:1.5}",
  ".auth-field{margin-bottom:14px}",
  ".auth-label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px;letter-spacing:.3px}",
  ".auth-inp{background:var(--surface);border:1.5px solid var(--border);border-radius:var(--r);padding:11px 14px;color:var(--text);font-family:var(--font-body);font-size:14px;outline:none;transition:border-color .2s;width:100%}",
  ".auth-inp:focus{border-color:var(--accent)} .auth-inp::placeholder{color:var(--muted)}",
  ".auth-inp.error{border-color:var(--accent3)}",
  ".auth-btn{width:100%;background:var(--accent);color:#fff;border:none;border-radius:var(--r);padding:12px;font-family:var(--font-body);font-size:15px;font-weight:600;cursor:pointer;transition:all .18s;margin-top:6px}",
  ".auth-btn:hover{opacity:.88} .auth-btn:disabled{opacity:.4;cursor:not-allowed}",
  ".auth-error{background:rgba(224,107,138,.1);border:1px solid rgba(224,107,138,.3);border-radius:var(--r);padding:10px 14px;font-size:13px;color:var(--accent3);margin-bottom:14px;line-height:1.5}",
  ".auth-success{background:rgba(90,172,184,.1);border:1px solid rgba(90,172,184,.3);border-radius:var(--r);padding:10px 14px;font-size:13px;color:var(--accent4);margin-bottom:14px;line-height:1.5}",
  ".auth-switch{text-align:center;margin-top:20px;font-size:13px;color:var(--muted)}",
  ".auth-link{color:var(--accent);background:none;border:none;cursor:pointer;font-family:var(--font-body);font-size:13px;font-weight:600;text-decoration:underline;padding:0}",
  ".auth-divider{display:flex;align-items:center;gap:10px;margin:16px 0;color:var(--muted);font-size:12px}",
  ".auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border)}",
  ".auth-pw-wrap{position:relative}",
  ".auth-pw-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);font-size:16px;padding:0;line-height:1}",
  ".auth-pw-toggle:hover{color:var(--accent)}",
  ".auth-strength{margin-top:6px;display:flex;gap:4px}",
  ".auth-strength-bar{flex:1;height:3px;border-radius:2px;background:var(--border);transition:background .3s}",
  ".forgot-link{background:none;border:none;color:var(--accent);font-family:var(--font-body);font-size:12px;cursor:pointer;padding:0;text-align:right;width:100%;margin-top:-8px;margin-bottom:14px;display:block}",
  ".forgot-link:hover{opacity:.8}",

  ".footer{background:var(--surface);border-top:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--muted);text-align:center;line-height:1.5}",
].join("\n");

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const MOODS = [
  { e:"😊", l:"Muy bien",  v:5, c:"#a8c99a" },
  { e:"😌", l:"Bien",      v:4, c:"#7fba9e" },
  { e:"😐", l:"Neutral",   v:3, c:"#e8b96a" },
  { e:"😟", l:"Estresado", v:2, c:"#c47f5a" },
  { e:"😰", l:"Ansioso",   v:1, c:"#e07b6a" },
];
const MOOD_CAUSES = ["Examen próximo","Cansancio","Trabajo grupal","Falta de sueño","Vida social","Familia","Sin motivo especial"];
const WEEK = ["L","M","X","J","V","S","D"];

const INITIAL_TASKS = [
  { id:1, text:"Leer bibliografía de Sistemas Políticos Comparados", done:false, tag:"lectura",  note:"", open:false, energy:"alta"  },
  { id:2, text:"Preparar exposición de Historia Latinoamericana",    done:false, tag:"urgente",  note:"", open:false, energy:"alta"  },
  { id:3, text:"Entregar TP de Administración Pública",              done:true,  tag:"entrega",  note:"", open:false, energy:"media" },
  { id:4, text:"Repasar apuntes de Relaciones Internacionales",     done:false, tag:"repaso",   note:"", open:false, energy:"baja"  },
  { id:5, text:"Buscar fuentes para monografía de RRII",            done:false, tag:"práctica", note:"", open:false, energy:"media" },
];

const MATERIAS = [
  { id:1,  nombre:"Introducción a las Relaciones Internacionales", area:"RRII",  creditos:6, estado:"aprobada",  nota:8.5,  cuatr:"1° 2023" },
  { id:2,  nombre:"Historia Latinoamericana I",                    area:"Hist",  creditos:6, estado:"aprobada",  nota:9.0,  cuatr:"1° 2023" },
  { id:3,  nombre:"Fundamentos de Administración Pública",         area:"Admin", creditos:6, estado:"aprobada",  nota:7.5,  cuatr:"2° 2023" },
  { id:4,  nombre:"Teoría Política I",                             area:"Polít", creditos:6, estado:"aprobada",  nota:8.0,  cuatr:"2° 2023" },
  { id:5,  nombre:"Economía Internacional",                        area:"RRII",  creditos:6, estado:"aprobada",  nota:7.0,  cuatr:"1° 2024" },
  { id:6,  nombre:"Sistemas Políticos Comparados",                 area:"Polít", creditos:6, estado:"cursando",  nota:null, cuatr:"1° 2025" },
  { id:7,  nombre:"Historia Latinoamericana II",                   area:"Hist",  creditos:6, estado:"cursando",  nota:null, cuatr:"1° 2025" },
  { id:8,  nombre:"Administración y Políticas Públicas",           area:"Admin", creditos:6, estado:"cursando",  nota:null, cuatr:"1° 2025" },
  { id:9,  nombre:"Relaciones Internacionales Contemporáneas",     area:"RRII",  creditos:6, estado:"pendiente", nota:null, cuatr:"2° 2025" },
  { id:10, nombre:"Derecho Internacional Público",                 area:"RRII",  creditos:6, estado:"pendiente", nota:null, cuatr:"2° 2025" },
  { id:11, nombre:"Gestión del Desarrollo Tecnológico",            area:"Admin", creditos:4, estado:"pendiente", nota:null, cuatr:"2° 2025" },
  { id:12, nombre:"Teoría de las Relaciones Internacionales",      area:"RRII",  creditos:6, estado:"pendiente", nota:null, cuatr:"1° 2026" },
];

const CALENDAR_EVENTS = [
  { day:8,  title:"Parcial Sistemas Políticos Comparados", type:"examen",  hora:"10:00" },
  { day:12, title:"TP Administración y PP — Entrega",      type:"entrega", hora:"18:00" },
  { day:15, title:"Clase de consulta RRII",                type:"clase",   hora:"15:00" },
  { day:20, title:"Parcial Historia Latinoamericana II",   type:"examen",  hora:"09:00" },
  { day:22, title:"Examen recuperatorio",                  type:"examen",  hora:"14:00" },
  { day:28, title:"Inscripción 2° cuatrimestre",           type:"admin",   hora:"Desde 08:00" },
];

const BREATHE_MODES = [
  { name:"4-4-4 Box",   steps:[{l:"Inhala",d:4},{l:"Sostén",d:4},{l:"Exhala",d:4},{l:"Sostén",d:4}] },
  { name:"4-7-8 Calma", steps:[{l:"Inhala",d:4},{l:"Sostén",d:7},{l:"Exhala",d:8}] },
  { name:"5-5 Simple",  steps:[{l:"Inhala",d:5},{l:"Exhala",d:5}] },
];

const FORUM_INIT = [
  { id:1, user:"Vale M.",  av:"😊", time:"Hace 2h", body:"Terminé todos mis pendientes antes de las 9pm 🎉 La técnica Pomodoro realmente funciona. ¡Ánimo!", likes:18, liked:false, tag:"Logro",     kira:null, kiraLoading:false },
  { id:2, user:"Mateo R.", av:"📚", time:"Hace 4h", body:"Tres parciales en una semana es demasiado 😩 ¿Alguien más en la misma? No están solos.",          likes:34, liked:false, tag:"Apoyo",     kira:null, kiraLoading:false },
  { id:3, user:"Cami F.",  av:"🌱", time:"Hace 6h", body:"Antes de dormir anoto 3 cosas buenas del día, aunque haya sido difícil. Cambió mi perspectiva 💛", likes:29, liked:false, tag:"Tip",       kira:null, kiraLoading:false },
  { id:4, user:"Lucas P.", av:"🎯", time:"Ayer",    body:"Aprobé Historia Latinoamericana II después de dos intentos. Si están en un momento difícil: sigan.", likes:55, liked:false, tag:"Logro",     kira:null, kiraLoading:false },
];

const NAV = [
  { id:"dashboard", icon:"⊞",  label:"Dashboard"        },
  { id:"chat",      icon:"💬", label:"Chat con Kira"    },
  { id:"mood",      icon:"🫀", label:"Emociones"        },
  { id:"diary",     icon:"📓", label:"Diario"           },
  { id:"calendar",  icon:"📅", label:"Calendario"       },
  { id:"materias",  icon:"📚", label:"Materias"         },
  { id:"tasks",     icon:"✅", label:"Tareas"           },
  { id:"relax",     icon:"🧘", label:"Relajación"       },
  { id:"logros",    icon:"🏆", label:"Logros"           },
  { id:"community", icon:"👥", label:"Comunidad"        },
];

const TAG_COLORS = {
  urgente:  { bg:"rgba(224,107,138,.15)", c:"#e06b8a" },
  entrega:  { bg:"rgba(160,118,212,.15)", c:"#a076d4" },
  lectura:  { bg:"rgba(90,172,184,.15)",  c:"#5aacb8" },
  repaso:   { bg:"rgba(124,92,191,.15)",  c:"#7c5cbf" },
  práctica: { bg:"rgba(155,137,212,.15)", c:"#9b89d4" },
};
const EV_COLORS = {
  examen:  { bg:"rgba(224,107,138,.12)", c:"#e06b8a", b:"#e06b8a" },
  entrega: { bg:"rgba(160,118,212,.12)", c:"#a076d4", b:"#a076d4" },
  clase:   { bg:"rgba(90,172,184,.12)",  c:"#5aacb8", b:"#5aacb8" },
  admin:   { bg:"rgba(155,137,212,.12)", c:"#9b89d4", b:"#9b89d4" },
};
const MAT_COLORS = {
  aprobada:  { bg:"rgba(90,172,184,.12)", c:"#5aacb8", label:"Aprobada"  },
  cursando:  { bg:"rgba(124,92,191,.12)", c:"#7c5cbf", label:"Cursando"  },
  pendiente: { bg:"rgba(122,119,143,.12)",c:"#7a778f", label:"Pendiente" },
};
const ENERGY = {
  alta:  { bg:"rgba(224,107,138,.13)", c:"#e06b8a", icon:"⚡" },
  media: { bg:"rgba(232,185,106,.13)", c:"#c9a040", icon:"🌤️" },
  baja:  { bg:"rgba(90,172,184,.13)",  c:"#5aacb8", icon:"🌙" },
};

const ALL_ACHIEVEMENTS = [
  { id:"first_mood",    icon:"🫀", name:"Primera emoción",       desc:"Registraste tu estado de ánimo por primera vez.",              check:s=>s.moodCount>=1   },
  { id:"week_mood",     icon:"📅", name:"Semana completa",        desc:"7 registros de ánimo. ¡Muy bien!",                             check:s=>s.moodCount>=7   },
  { id:"first_task",    icon:"✅", name:"Primera tarea",          desc:"Completaste tu primera tarea.",                                check:s=>s.doneTasks>=1   },
  { id:"task_5",        icon:"🎯", name:"En racha",               desc:"Completaste 5 tareas.",                                        check:s=>s.doneTasks>=5   },
  { id:"first_diary",   icon:"📓", name:"Primer registro",        desc:"Escribiste tu primera entrada en el diario.",                  check:s=>s.diaryCount>=1  },
  { id:"diary_5",       icon:"✍️", name:"Escritor/a constante",  desc:"5 entradas en el diario.",                                     check:s=>s.diaryCount>=5  },
  { id:"first_breathe", icon:"🫁", name:"Primera respiración",   desc:"Usaste los ejercicios de respiración.",                        check:s=>s.breatheCount>=1},
  { id:"breathe_3",     icon:"🌬️",name:"Respiro, existo",        desc:"3 sesiones de respiración completadas.",                       check:s=>s.breatheCount>=3},
  { id:"chat_kira",     icon:"💬", name:"Habló con Kira",         desc:"Iniciaste una conversación con tu acompañante.",               check:s=>s.chatCount>=1   },
  { id:"community",     icon:"👥", name:"Voz en la comunidad",    desc:"Publicaste algo en el espacio comunitario.",                   check:s=>s.communityPosts>=1},
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = useCallback(m => { setMsg(m); setTimeout(()=>setMsg(null),2500); }, []);
  return [msg, show];
}

const KIRA_SYSTEM = `Sos Kira, una acompañante de bienestar estudiantil para la app Estudiante 360. Hablás con estudiantes universitarios latinoamericanos de carreras de ciencias sociales (Relaciones Internacionales, Administración Pública, Ciencias Políticas, Historia Latinoamericana).

Tu misión es escuchar con empatía genuina y ayudar con el estrés académico, la ansiedad ante exámenes, la carga de materias y las dificultades del día a día universitario.

- Usás español rioplatense natural (vos, tenés, podés) — nunca tuteo ni lenguaje formal.
- Sos cálida, cercana y directa, como una amiga que sabe escuchar.
- Primero validás lo que siente el estudiante antes de dar consejos.
- Si el estudiante menciona una materia específica, la incorporás a tu respuesta.
- Cuando corresponde, sugerís técnicas concretas: Pomodoro, respiración, división de tareas.
- Si detectás señales de crisis emocional severa, con cuidado sugerís hablar con un profesional.
- Tus respuestas son concisas (2-4 párrafos), cálidas y enfocadas.
- Nunca revelás que sos una IA ni mencionás a Anthropic o Claude. Sos Kira.`;

async function callKira(messages, extra = "") {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":"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","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1024, system:KIRA_SYSTEM+extra, messages }),
  });
  const d = await res.json().catch(()=>({}));
  if (!res.ok) {
    const msg = d?.error?.message || JSON.stringify(d) || `Error ${res.status}`;
    throw new Error(msg);
  }
  return d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
}

/* ─────────────────────────────────────────────
   SOS PANEL
───────────────────────────────────────────── */
function SosPanel({ onClose }) {
  const [view, setView] = useState("menu");
  const TECHS = [
    { id:"grounding",   icon:"🌿", title:"Grounding 5-4-3-2-1", desc:"Técnica de anclaje sensorial para salir de la espiral ansiosa en 2 minutos." },
    { id:"compassion",  icon:"💛", title:"Autocompasión",        desc:"Frases para hablarte con la bondad que le darías a un amigo." },
    { id:"tips",        icon:"🧘", title:"Qué hacer ahora",      desc:"Pasos concretos para cuando no sabés por dónde empezar." },
  ];
  const GROUNDING = [
    {n:5,s:"ves",     items:"una silla, una ventana, tus manos, el techo, algo azul"},
    {n:4,s:"tocás",   items:"la mesa, tu ropa, el aire, una silla, tu cara"},
    {n:3,s:"escuchás",items:"tu respiración, un sonido lejano, el silencio"},
    {n:2,s:"olés",    items:"el ambiente, tu ropa"},
    {n:1,s:"saboreás",items:"agua o cualquier cosa que tengas cerca"},
  ];
  const COMPASSION = [
    "Esto que estoy sintiendo es difícil, y está bien que así sea.",
    "No soy el único / la única que pasa por esto.",
    "Puedo ser amable conmigo mismo/a en este momento.",
    "Este momento va a pasar. No es para siempre.",
    "Hice todo lo que pude con lo que tenía.",
    "Me permito descansar sin culpa.",
  ];
  const TIPS = [
    {icon:"⏱️",t:"Regla de los 2 minutos",d:"Si algo lleva menos de 2 minutos, hacelo ahora. Si no, escribilo en tu lista."},
    {icon:"📵",t:"Aleja el teléfono",      d:"Poné el celular en silencio en otro cuarto por 25 minutos. Solo 25."},
    {icon:"💧",t:"Tomá agua",              d:"Suena simple, pero la deshidratación empeora la ansiedad. Levantate y tomá agua."},
    {icon:"🚶",t:"Mové el cuerpo",          d:"5 minutos de movimiento (estiramientos, caminar) resetean el sistema nervioso."},
    {icon:"✏️",t:"Escribí qué te preocupa",d:"Sacalo de la cabeza y ponelo en papel. La mente trabaja mejor con cosas escritas."},
  ];

  return (
    <div className="sos-overlay" onClick={onClose}>
      <div className="sos-modal" onClick={e=>e.stopPropagation()}>
        {view==="menu" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"var(--font-head)",fontSize:20,fontWeight:600}}>Ayuda rápida 🆘</div>
                <p className="muted" style={{marginTop:5}}>Elegí una técnica para este momento</p>
              </div>
              <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
            </div>
            {TECHS.map(t => (
              <div key={t.id} className="sos-tech" onClick={()=>setView(t.id)}>
                <div className="sos-tech-title">{t.icon} {t.title}</div>
                <div className="sos-tech-desc">{t.desc}</div>
              </div>
            ))}
          </>
        )}
        {view==="grounding" && (
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button className="btn-ghost btn-sm" onClick={()=>setView("menu")}>← Volver</button>
              <span style={{fontFamily:"var(--font-head)",fontSize:17,fontWeight:600}}>Grounding 5-4-3-2-1 🌿</span>
            </div>
            <p className="muted mb16" style={{lineHeight:1.6}}>Nombrá en voz alta o mentalmente cada cosa. Respirá entre cada paso.</p>
            {GROUNDING.map((s,i)=>(
              <div key={i} className="step-card">
                <strong>{s.n} cosas que {s.s}:</strong> {s.items}
              </div>
            ))}
          </>
        )}
        {view==="compassion" && (
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button className="btn-ghost btn-sm" onClick={()=>setView("menu")}>← Volver</button>
              <span style={{fontFamily:"var(--font-head)",fontSize:17,fontWeight:600}}>Autocompasión 💛</span>
            </div>
            <p className="muted mb16" style={{lineHeight:1.6}}>Repetí estas frases lentamente. No hace falta creerlas del todo ahora, solo decirlas.</p>
            {COMPASSION.map((f,i)=>(
              <div key={i} className="step-card" style={{borderLeftColor:"var(--accent3)"}}>{f}</div>
            ))}
          </>
        )}
        {view==="tips" && (
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button className="btn-ghost btn-sm" onClick={()=>setView("menu")}>← Volver</button>
              <span style={{fontFamily:"var(--font-head)",fontSize:17,fontWeight:600}}>Qué hacer ahora 🧘</span>
            </div>
            {TIPS.map((tip,i)=>(
              <div key={i} className="sos-tech">
                <div className="sos-tech-title">{tip.icon} {tip.t}</div>
                <div className="sos-tech-desc">{tip.d}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
function Dashboard({ mood, tasks, setSection, stats, userName }) {
  const aprobadas = MATERIAS.filter(m=>m.estado==="aprobada").length;
  const cursando  = MATERIAS.filter(m=>m.estado==="cursando").length;
  const total     = MATERIAS.length;
  const doneTasks = tasks.filter(t=>t.done).length;
  const notedMats = MATERIAS.filter(m=>m.nota);
  const avgNota   = notedMats.length ? (notedMats.reduce((a,m)=>a+m.nota,0)/notedMats.length).toFixed(1) : "—";
  const today     = new Date();
  const unlocked  = ALL_ACHIEVEMENTS.filter(a=>a.check(stats)).length;

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Buen {today.getHours()<12?"día":today.getHours()<19?"tarde":"noche"}, <em>{userName}</em> 👋</h2>
        <p>{today.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      </div>

      <div className="g4 mb16">
        {[
          {val:aprobadas,               lbl:"Aprobadas",       icon:"🏆",bg:"rgba(90,172,184,.07)", b:"rgba(90,172,184,.25)"},
          {val:cursando,                lbl:"En curso",        icon:"📖",bg:"rgba(124,92,191,.07)", b:"rgba(124,92,191,.25)"},
          {val:avgNota,                 lbl:"Promedio",        icon:"⭐",bg:"rgba(160,118,212,.07)",b:"rgba(160,118,212,.25)"},
          {val:`${doneTasks}/${tasks.length}`,lbl:"Tareas",    icon:"✅",bg:"rgba(224,107,138,.07)",b:"rgba(224,107,138,.25)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card card" style={{background:s.bg,borderColor:s.b}}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="g2 mb16">
        <div className="card">
          <div className="flex mb12">
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15}}>Progreso de carrera</span>
            <span className="badge" style={{background:"rgba(124,92,191,.14)",color:"var(--accent)",marginLeft:"auto"}}>{Math.round(aprobadas/total*100)}%</span>
          </div>
          <div className="prog-wrap mb8"><div className="prog-fill" style={{width:`${aprobadas/total*100}%`,background:"var(--accent)"}} /></div>
          <p className="muted">{aprobadas} de {total} materias completadas</p>
        </div>
        <div className="card">
          <div className="flex mb12">
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15}}>Estado emocional</span>
          </div>
          {mood
            ? <div className="flex" style={{gap:14}}>
                <span style={{fontSize:40}}>{MOODS.find(m=>m.l===mood)?.e}</span>
                <div><div style={{fontWeight:600,fontSize:16}}>{mood}</div><p className="muted" style={{marginTop:6}}>Registrado hoy</p></div>
              </div>
            : <div>
                <p className="muted mb12">No registraste tu estado de ánimo hoy.</p>
                <button className="btn btn-sm" onClick={()=>setSection("mood")}>Registrar ahora</button>
              </div>
          }
        </div>
      </div>

      <div className="g2 mb16">
        <div className="card">
          <div className="flex mb12">
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15}}>Próximos eventos</span>
            <button className="btn-ghost btn-sm" style={{marginLeft:"auto"}} onClick={()=>setSection("calendar")}>Ver →</button>
          </div>
          {CALENDAR_EVENTS.slice(0,3).map((ev,i)=>{
            const c=EV_COLORS[ev.type];
            return (
              <div key={i} className="event-chip" style={{borderLeftColor:c.b,background:c.bg}}>
                <span className="ev-date">Marzo {ev.day}</span>
                <span style={{flex:1,fontSize:14}}>{ev.title}</span>
                <span className="badge" style={{background:"transparent",color:c.c,border:`1px solid ${c.c}44`}}>{ev.type}</span>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="flex mb12">
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15}}>Logros desbloqueados</span>
            <button className="btn-ghost btn-sm" style={{marginLeft:"auto"}} onClick={()=>setSection("logros")}>Ver →</button>
          </div>
          <div style={{fontFamily:"var(--font-head)",fontSize:36,fontWeight:700,color:"var(--accent)",lineHeight:1}}>{unlocked}</div>
          <p className="muted">de {ALL_ACHIEVEMENTS.length} logros</p>
          <div className="prog-wrap" style={{marginTop:12}}><div className="prog-fill" style={{width:`${unlocked/ALL_ACHIEVEMENTS.length*100}%`,background:"var(--accent)"}} /></div>
        </div>
      </div>

      <div className="card">
        <div className="flex mb12">
          <span style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15}}>Tareas pendientes</span>
          <button className="btn-ghost btn-sm" style={{marginLeft:"auto"}} onClick={()=>setSection("tasks")}>Ver todas →</button>
        </div>
        {tasks.filter(t=>!t.done).slice(0,3).map(t=>{
          const tc=TAG_COLORS[t.tag]||TAG_COLORS.repaso;
          const ec=ENERGY[t.energy]||ENERGY.media;
          return (
            <div key={t.id} className="flex" style={{padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontSize:14,flex:1}}>{t.text}</span>
              <span className="badge" style={{background:tc.bg,color:tc.c}}>{t.tag}</span>
              <span className="energy-badge" style={{background:ec.bg,color:ec.c,borderColor:ec.c+"44"}}>{ec.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHAT
───────────────────────────────────────────── */
function Chat({ mood, onChatUsed }) {
  const [msgs,    setMsgs]    = useState([{role:"bot",text:"¡Hola! Soy Kira, tu acompañante de bienestar 💛 Estoy acá para escucharte y ayudarte con todo lo que tenga que ver con la vida universitaria. ¿Cómo estás hoy?"}]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const usedRef = useRef(false);
  const endRef  = useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,loading]);

  async function send() {
    const text = input.trim();
    if (!text||loading) return;
    const extra = mood ? ` Estado de ánimo registrado hoy: "${mood}".` : "";
    const userMsg = {role:"user",text};
    setInput(""); setError(null);
    setMsgs(m=>[...m,userMsg]);
    setLoading(true);
    if (!usedRef.current) { usedRef.current=true; onChatUsed(); }
    const history = [...msgs,userMsg].map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    try {
      const reply = await callKira(history, extra);
      setMsgs(m=>[...m,{role:"bot",text:reply}]);
    } catch(e) {
      setError("No pude conectar con Kira. Verificá tu conexión e intentá de nuevo.");
      setMsgs(m=>m.filter(x=>x!==userMsg));
      setInput(text);
    } finally { setLoading(false); }
  }

  return (
    <div className="section-wrap" style={{paddingBottom:0}}>
      <div className="sec-head">
        <h2>Chat con <em>Kira</em></h2>
        <p>Tu acompañante de bienestar · Espacio seguro para hablar</p>
      </div>
      {error && (
        <div style={{background:"rgba(224,107,138,.1)",border:"1px solid rgba(224,107,138,.3)",borderLeft:"3px solid var(--accent3)",borderRadius:"var(--r)",padding:"10px 14px",fontSize:13,color:"var(--accent3)",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <span>⚠️</span><span style={{flex:1}}>{error}</span>
          <button onClick={()=>setError(null)} style={{background:"none",border:"none",color:"var(--accent3)",cursor:"pointer",fontSize:18}}>×</button>
        </div>
      )}
      <div className="chat-shell">
        <div className="chat-msgs">
          {msgs.map((m,i)=>(
            <div key={i} className={"bubble "+m.role}>
              {m.text.split("\n").map((l,j,a)=><span key={j}>{l}{j<a.length-1&&<br/>}</span>)}
            </div>
          ))}
          {loading && <div className="bubble bot"><div className="typing-dots"><span/><span/><span/></div></div>}
          <div ref={endRef}/>
        </div>
        <div className="chat-bar">
          <textarea className="inp" style={{resize:"none",minHeight:"unset",height:48,lineHeight:"26px"}}
            placeholder="Contale a Kira cómo te sentís… (Enter para enviar)"
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} />
          <button className="send-btn" onClick={send} disabled={loading||!input.trim()}>↑</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOOD (causas + intensidad)
───────────────────────────────────────────── */
function MoodSection({ mood, setMood, moodHistory, addMoodEntry }) {
  const [sel,       setSel]       = useState(mood);
  const [causes,    setCauses]    = useState([]);
  const [intensity, setIntensity] = useState(3);
  const [note,      setNote]      = useState("");
  const [saved,     setSaved]     = useState(false);

  function toggleCause(c) { setCauses(cs=>cs.includes(c)?cs.filter(x=>x!==c):[...cs,c]); }
  function save() {
    if (!sel) return;
    setMood(sel);
    addMoodEntry({mood:sel,intensity,causes,note,date:new Date().toLocaleDateString()});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Registro de <em>Emociones</em></h2>
        <p>Conocer cómo te sentís es el primer paso para cuidarte</p>
      </div>
      <div className="card mb16">
        <p className="muted mb12">¿Cómo te sentís ahora?</p>
        <div className="mood-grid mb16">
          {MOODS.map(m=>(
            <div key={m.v} className={"mood-tile"+(sel===m.l?" sel":"")} onClick={()=>setSel(m.l)} style={sel===m.l?{borderColor:m.c}:{}}>
              <div className="emo">{m.e}</div><div className="lbl">{m.l}</div>
            </div>
          ))}
        </div>
        {sel && (
          <>
            <p className="muted mb8">Intensidad: <strong style={{color:"var(--accent)"}}>{intensity}/5</strong></p>
            <div style={{display:"flex",gap:6,marginBottom:16}}>
              {[1,2,3,4,5].map(n=>(
                <div key={n} className={"intensity-dot"+(intensity===n?" sel":"")} onClick={()=>setIntensity(n)}>{n}</div>
              ))}
            </div>
            <p className="muted mb8">¿A qué se debe? (podés elegir varias)</p>
            <div className="flex flex-wrap mb16" style={{gap:6}}>
              {MOOD_CAUSES.map(c=>(
                <button key={c} className={"cause-tag"+(causes.includes(c)?" sel":"")} onClick={()=>toggleCause(c)}>{c}</button>
              ))}
            </div>
            <textarea className="inp mb12" placeholder="¿Algo más que quieras anotar? (opcional)" value={note} onChange={e=>setNote(e.target.value)} />
            <button className="btn" style={{background:saved?"var(--accent4)":""}} onClick={save}>
              {saved?"✓ Guardado":"Guardar registro"}
            </button>
          </>
        )}
      </div>
      <div className="card">
        <p style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15,marginBottom:18}}>Historial semanal</p>
        <div className="mood-bars">
          {WEEK.map((d,i)=>{
            const e=moodHistory[i],mo=e?MOODS.find(m=>m.l===e.mood):null;
            return <div key={d} className="mood-bar-item" style={{height:mo?(mo.v/5)*58:6,background:mo?mo.c:"var(--border)",opacity:e?1:0.3}}><span className="dl">{d}</span></div>;
          })}
        </div>
        <div style={{height:24}}/>
        {moodHistory.filter(Boolean).length===0
          ? <p className="muted center">Registrá tu estado de ánimo para ver el historial</p>
          : moodHistory.filter(Boolean).map((e,i)=>e&&(
            <div key={i} className="flex" style={{padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontSize:20}}>{MOODS.find(m=>m.l===e.mood)?.e}</span>
              <div style={{flex:1,paddingLeft:10}}>
                <div style={{fontSize:14}}>{e.mood} <span style={{fontSize:11,color:"var(--muted)"}}>· intensidad {e.intensity}/5</span></div>
                {e.causes?.length>0&&<div style={{fontSize:11,color:"var(--muted)"}}>{e.causes.join(", ")}</div>}
              </div>
              <span className="muted">{e.date}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DIARY
───────────────────────────────────────────── */
function DiarySection({ currentMood, onDiaryEntry }) {
  const [entries,  setEntries]  = useState([
    {id:1, date:"08/03/2025", mood:"😌", text:"Hoy me costó arrancar con los apuntes de Historia pero al final pude. A veces el primer paso es lo más difícil."},
    {id:2, date:"07/03/2025", mood:"😟", text:"Parcial de Sistemas Políticos la semana que viene y siento que no llego. Voy a hacer un plan de estudio mañana."},
  ]);
  const [text,    setText]    = useState("");
  const [viewing, setViewing] = useState(null);
  const [saved,   setSaved]   = useState(false);
  const [search,  setSearch]  = useState("");
  const moodEmoji = MOODS.find(m=>m.l===currentMood)?.e || "📝";

  function save() {
    if (!text.trim()) return;
    setEntries(es=>[{id:Date.now(),date:new Date().toLocaleDateString(),mood:moodEmoji,text:text.trim()},...es]);
    setText(""); setSaved(true); onDiaryEntry();
    setTimeout(()=>setSaved(false),2000);
  }

  const filtered = search ? entries.filter(e=>e.text.toLowerCase().includes(search.toLowerCase())) : entries;

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Diario de <em>Bienestar</em></h2>
        <p>Un espacio privado y seguro para vos. Escribí libremente.</p>
      </div>

      {viewing ? (
        <div className="card">
          <div className="flex mb16">
            <button className="btn-ghost btn-sm" onClick={()=>setViewing(null)}>← Volver</button>
            <span className="muted" style={{marginLeft:"auto"}}>{viewing.date}</span>
          </div>
          <div style={{fontSize:28,marginBottom:12}}>{viewing.mood}</div>
          <p style={{fontSize:15,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{viewing.text}</p>
        </div>
      ) : (
        <>
          <div className="card mb16">
            <div style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15,marginBottom:12}}>
              {moodEmoji} ¿Qué querés registrar hoy?
            </div>
            <textarea className="inp mb12"
              placeholder="Escribí libremente… cómo fue tu día, qué sentiste, qué te preocupa o alegró."
              style={{minHeight:120}} value={text} onChange={e=>setText(e.target.value)} />
            <button className="btn" style={{background:saved?"var(--accent4)":""}} onClick={save} disabled={!text.trim()}>
              {saved?"✓ Guardado":"Guardar entrada"}
            </button>
          </div>
          <input className="inp mb12" style={{height:38,padding:"6px 14px"}}
            placeholder="Buscar en el diario…" value={search} onChange={e=>setSearch(e.target.value)} />
          {filtered.length===0
            ? <p className="muted center" style={{padding:"20px 0"}}>No hay entradas que coincidan.</p>
            : filtered.map(e=>(
              <div key={e.id} className="diary-entry" onClick={()=>setViewing(e)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:18}}>{e.mood}</span>
                  <span className="diary-date">{e.date}</span>
                </div>
                <div className="diary-preview">{e.text}</div>
              </div>
            ))
          }
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CALENDAR
───────────────────────────────────────────── */
function CalendarSection() {
  const [sel, setSel] = useState(null);
  const today       = new Date();
  const daysInMonth = new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
  const firstDay    = (new Date(today.getFullYear(),today.getMonth(),1).getDay()+6)%7;
  const cells       = [...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const eventDays   = CALENDAR_EVENTS.map(e=>e.day);
  const todayDay    = today.getDate();
  const selEvents   = sel?CALENDAR_EVENTS.filter(e=>e.day===sel):[];

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Calendario <em>Académico</em></h2>
        <p>{today.toLocaleDateString("es-AR",{month:"long",year:"numeric"})} — hacé clic en un día para ver eventos</p>
      </div>
      <div className="g2">
        <div className="card">
          <div className="cal-grid mb8">{WEEK.map(d=><div key={d} className="cal-day-hdr">{d}</div>)}</div>
          <div className="cal-grid">
            {cells.map((day,i)=>{
              if (!day) return <div key={i} className="cal-day empty"/>;
              return (
                <div key={i}
                  className={"cal-day"+(day===todayDay?" today":"")+(eventDays.includes(day)?" has-event":"")}
                  style={day===sel?{background:"rgba(124,92,191,.12)",borderColor:"var(--accent)"}:{}}
                  onClick={()=>setSel(day===sel?null:day)}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <p style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15,marginBottom:14}}>
            {sel?`Eventos — ${sel} de marzo`:"Todos los eventos"}
          </p>
          {(sel?selEvents:CALENDAR_EVENTS).map((ev,i)=>{
            const c=EV_COLORS[ev.type];
            return (
              <div key={i} className="event-chip" style={{borderLeftColor:c.b,background:c.bg}}>
                {!sel&&<span className="ev-date">Marzo {ev.day}</span>}
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500}}>{ev.title}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{ev.hora}</div>
                </div>
                <span className="badge" style={{background:"transparent",color:c.c,border:`1px solid ${c.c}44`}}>{ev.type}</span>
              </div>
            );
          })}
          {sel&&selEvents.length===0&&<p className="muted center" style={{padding:"14px 0"}}>Sin eventos este día</p>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MATERIAS
───────────────────────────────────────────── */
function MateriasSection() {
  const [filter, setFilter] = useState("todas");
  const filtered  = filter==="todas"?MATERIAS:MATERIAS.filter(m=>m.estado===filter);
  const aprobadas = MATERIAS.filter(m=>m.estado==="aprobada");
  const avg       = (aprobadas.reduce((a,m)=>a+m.nota,0)/aprobadas.length).toFixed(2);

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Seguimiento de <em>Materias</em></h2>
        <p>Progreso académico y calificaciones</p>
      </div>
      <div className="g3 mb16">
        {[
          {l:"Aprobadas",v:aprobadas.length,...MAT_COLORS.aprobada},
          {l:"En curso",v:MATERIAS.filter(m=>m.estado==="cursando").length,...MAT_COLORS.cursando},
          {l:"Pendientes",v:MATERIAS.filter(m=>m.estado==="pendiente").length,...MAT_COLORS.pendiente},
        ].map((s,i)=>(
          <div key={i} className="card stat-card" style={{background:s.bg,borderColor:s.c+"44"}}>
            <div className="stat-val" style={{color:s.c}}>{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="card mb16 flex" style={{gap:20}}>
        <div>
          <div style={{fontFamily:"var(--font-head)",fontSize:44,fontWeight:700,color:"var(--accent)",lineHeight:1}}>{avg}</div>
          <div className="muted">Promedio general</div>
        </div>
        <div style={{flex:1}}>
          <div className="prog-wrap"><div className="prog-fill" style={{width:`${parseFloat(avg)*10}%`,background:"var(--accent)"}}/></div>
          <p className="muted mt8">Sobre 10 · {aprobadas.length} materias con nota</p>
        </div>
      </div>
      <div className="flex mb12" style={{gap:8}}>
        {["todas","aprobada","cursando","pendiente"].map(f=>(
          <button key={f} className={filter===f?"btn btn-sm":"btn-ghost btn-sm"} style={{textTransform:"capitalize"}} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="g-auto">
        {filtered.map(m=>{
          const c=MAT_COLORS[m.estado];
          return (
            <div key={m.id} className="materia-card">
              <div className="flex mb8" style={{gap:8}}>
                <span className="badge" style={{background:c.bg,color:c.c}}>{c.label}</span>
                <span className="muted" style={{marginLeft:"auto",fontSize:11}}>{m.cuatr}</span>
              </div>
              <div className="materia-name">{m.nombre}</div>
              <div className="materia-meta">{m.area} · {m.creditos} créditos</div>
              {m.nota&&(
                <div className="flex" style={{gap:8}}>
                  <div className="prog-wrap flex1" style={{height:4}}><div className="prog-fill" style={{width:`${m.nota*10}%`,background:c.c}}/></div>
                  <span style={{fontSize:13,fontWeight:600,color:c.c}}>{m.nota}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TASKS (con energía)
───────────────────────────────────────────── */
function TasksSection({ tasks, setTasks, onTaskDone }) {
  const [newTask,   setNewTask]   = useState("");
  const [newTag,    setNewTag]    = useState("repaso");
  const [newEnergy, setNewEnergy] = useState("media");
  const [toast,     showToast]    = useToast();
  const done = tasks.filter(t=>t.done).length;
  const hour = new Date().getHours();
  const hint = hour<12?"alta":hour<17?"media":"baja";

  function add() {
    if (!newTask.trim()) return;
    setTasks(ts=>[...ts,{id:Date.now(),text:newTask.trim(),done:false,tag:newTag,note:"",open:false,energy:newEnergy}]);
    setNewTask(""); showToast("Tarea agregada ✓");
  }
  function toggle(id) {
    const t=tasks.find(x=>x.id===id);
    if (t&&!t.done) onTaskDone();
    setTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
  }
  function remove(id)     { setTasks(ts=>ts.filter(t=>t.id!==id)); }
  function toggleOpen(id) { setTasks(ts=>ts.map(t=>t.id===id?{...t,open:!t.open}:t)); }
  function setNote(id,v)  { setTasks(ts=>ts.map(t=>t.id===id?{...t,note:v}:t)); }

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Lista de <em>Tareas</em></h2>
        <p>{done} de {tasks.length} completadas</p>
      </div>

      <div className="card mb16" style={{borderColor:`${ENERGY[hint].c}44`,background:ENERGY[hint].bg}}>
        <div className="flex" style={{gap:10}}>
          <span style={{fontSize:22}}>{ENERGY[hint].icon}</span>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>
              {hour<12?"Mañana — energía alta":hour<17?"Tarde — energía moderada":"Noche — energía baja"}
            </div>
            <p className="muted" style={{fontSize:12,marginTop:2}}>
              {hour<12?"Ideal para tareas complejas que requieren concentración.":hour<17?"Buen momento para tareas de dificultad media.":"Reservá esto para tareas simples o de repaso."}
            </p>
          </div>
        </div>
      </div>

      <div className="card mb16">
        <div className="prog-wrap mb16"><div className="prog-fill" style={{width:`${tasks.length?done/tasks.length*100:0}%`,background:"var(--accent4)"}}/></div>
        <div className="flex flex-wrap" style={{gap:8}}>
          <input className="inp flex1" style={{minWidth:150}} placeholder="Nueva tarea…"
            value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} />
          <select className="sel" value={newTag} onChange={e=>setNewTag(e.target.value)}>
            {Object.keys(TAG_COLORS).map(k=><option key={k}>{k}</option>)}
          </select>
          <select className="sel" value={newEnergy} onChange={e=>setNewEnergy(e.target.value)}>
            <option value="alta">⚡ Alta</option>
            <option value="media">🌤️ Media</option>
            <option value="baja">🌙 Baja</option>
          </select>
          <button className="btn" onClick={add}>+ Agregar</button>
        </div>
      </div>

      {["pendientes","completadas"].map(group=>{
        const list=group==="pendientes"?tasks.filter(t=>!t.done):tasks.filter(t=>t.done);
        if (!list.length) return null;
        return (
          <div key={group}>
            <p style={{fontSize:11,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{group}</p>
            {list.map(t=>{
              const tc=TAG_COLORS[t.tag]||TAG_COLORS.repaso;
              const ec=ENERGY[t.energy]||ENERGY.media;
              return (
                <div key={t.id} className={"task-item"+(t.done?" done":"")}>
                  <div className="task-main">
                    <div className={"task-check"+(t.done?" done":"")} onClick={()=>toggle(t.id)}>{t.done&&"✓"}</div>
                    <span className="task-text">{t.text}</span>
                    {t.note&&<div className="task-has-note"/>}
                    <span className="badge" style={{background:tc.bg,color:tc.c}}>{t.tag}</span>
                    <span className="energy-badge" style={{background:ec.bg,color:ec.c,borderColor:ec.c+"44"}}>{ec.icon}</span>
                    <button className="task-expand-btn" onClick={()=>toggleOpen(t.id)}>{t.open?"▲":"▼"}</button>
                    <button className="task-del" onClick={()=>remove(t.id)}>×</button>
                  </div>
                  {t.open&&(
                    <div className="task-notes-panel">
                      <textarea className="task-note-inp"
                        placeholder="Anotaciones, links, ideas clave…"
                        value={t.note} onChange={e=>setNote(t.id,e.target.value)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STUDY METHODS DATA
───────────────────────────────────────────── */
const STUDY_METHODS = [
  {
    id:"pomodoro", icon:"🍅", name:"Técnica Pomodoro",
    tag:"Concentración", tagColor:"rgba(224,107,138,.15)", tagText:"#e06b8a",
    body:"Divide tu estudio en bloques de trabajo enfocado separados por descansos breves. Ideal para procrastinación y tareas largas.",
    steps:[
      "Elegí una sola tarea para trabajar.",
      "Poné un temporizador en 25 minutos y trabajá sin interrupciones.",
      "Cuando suene, tomá un descanso de 5 minutos. Levantate, estirá, tomá agua.",
      "Repetí 4 veces. Después del cuarto bloque, tomá 20-30 minutos de descanso largo.",
    ],
    tip:"📌 Apagá el teléfono durante el bloque. Cada notificación corta el flujo de concentración.",
  },
  {
    id:"cornell", icon:"📋", name:"Método Cornell",
    tag:"Toma de notas", tagColor:"rgba(90,172,184,.15)", tagText:"#5aacb8",
    body:"Sistema de toma de apuntes que favorece la comprensión activa y el repaso. Muy útil para materias teóricas como Historia o Teoría Política.",
    steps:[
      "Dividí tu hoja en 3 partes: columna izquierda angosta (preguntas), columna derecha ancha (apuntes) y franja inferior (resumen).",
      "Durante la clase, anotá ideas principales en la columna derecha con tus propias palabras.",
      "Después, en la columna izquierda escribí preguntas que disparen los conceptos.",
      "Al final, resumí la página en 2-3 oraciones en la franja de abajo.",
      "Para repasar, cubrí los apuntes y respondé las preguntas de memoria.",
    ],
    tip:"📌 El resumen de abajo es clave: si no podés escribirlo, todavía no entendiste bien el concepto.",
  },
  {
    id:"feynman", icon:"🧑‍🏫", name:"Técnica Feynman",
    tag:"Comprensión profunda", tagColor:"rgba(160,118,212,.15)", tagText:"#a076d4",
    body:"Aprender explicando. Si no podés explicar algo en palabras simples, todavía no lo entendés del todo. Funciona muy bien para sistemas políticos, conceptos de RRII y teorías.",
    steps:[
      "Tomá una hoja en blanco y escribí el concepto o tema en el encabezado.",
      "Explicalo con tus propias palabras, como si se lo contaras a alguien que no sabe nada del tema.",
      "Cada vez que te trabés o uses jerga sin entenderla, volvé a la fuente y revisá.",
      "Reescribí la explicación usando analogías y ejemplos concretos.",
      "Repetí hasta que puedas explicarlo de forma fluida y simple.",
    ],
    tip:"📌 Las partes donde te trabás son exactamente las que más necesitás estudiar.",
  },
  {
    id:"spaced", icon:"🔁", name:"Repetición Espaciada",
    tag:"Memorización", tagColor:"rgba(155,137,212,.15)", tagText:"#9b89d4",
    body:"Repasar en intervalos crecientes en lugar de estudiar todo junto. Mucho más efectivo que estudiar de corrido la noche antes.",
    steps:[
      "La primera vez que estudiás un tema, repasalo al día siguiente.",
      "Si lo recordás bien, el próximo repaso es en 3 días.",
      "Luego en 1 semana, después en 2 semanas, y así.",
      "Usá tarjetas (físicas o en Anki) para practicar: concepto por un lado, explicación por el otro.",
      "Priorizá siempre las tarjetas que te costaron más.",
    ],
    tip:"📌 Anki es gratuito y automatiza los intervalos. Vale la pena aprenderlo.",
  },
  {
    id:"mindmap", icon:"🗺️", name:"Mapa Mental",
    tag:"Organización visual", tagColor:"rgba(232,185,106,.15)", tagText:"#c9a040",
    body:"Organizar ideas de forma visual y ramificada. Excelente para materias con muchos conceptos interconectados como Administración Pública o Historia Latinoamericana.",
    steps:[
      "Escribí el concepto central en el medio de la hoja y encerralo en un círculo.",
      "Trazá ramas principales para cada subtema o categoría clave.",
      "De cada rama, agregá ramas secundarias con detalles, ejemplos o fechas.",
      "Usá colores distintos para cada rama principal.",
      "Agregá íconos o pequeños dibujos — ayudan a la memoria visual.",
    ],
    tip:"📌 Hacé el mapa mental sin mirar los apuntes. Si podés construirlo de memoria, ya aprendiste el tema.",
  },
  {
    id:"active", icon:"✍️", name:"Lectura Activa",
    tag:"Comprensión lectora", tagColor:"rgba(90,172,184,.15)", tagText:"#5aacb8",
    body:"Leer de forma activa en lugar de pasar los ojos por la página. Fundamental para la bibliografía densa de ciencias sociales.",
    steps:[
      "Antes de leer: mirá el índice, títulos y subtítulos para tener un mapa del texto.",
      "Formulá una pregunta por sección antes de leerla. Leé buscando la respuesta.",
      "Mientras lés: subrayá solo ideas principales (no todo) y anotá al margen con tus palabras.",
      "Al terminar cada párrafo o sección: cerrá el texto y resumí de memoria qué dijiste.",
      "Al final: reescribí la idea central del texto en 3 oraciones sin mirar.",
    ],
    tip:"📌 Si subrayaste más del 30% del texto, estás subrayando de más. Eso no es lectura activa.",
  },
];

/* ─────────────────────────────────────────────
   RELAX SECTION (respiración + métodos de estudio)
───────────────────────────────────────────── */
function RelaxSection({ onComplete }) {
  const [tab,     setTab]     = useState("breathe"); // "breathe" | "study"
  const [mode,    setMode]    = useState(0);
  const [running, setRunning] = useState(false);
  const [phase,   setPhase]   = useState(0);
  const [count,   setCount]   = useState(0);
  const [cycles,  setCycles]  = useState(0);
  const [openMethod, setOpenMethod] = useState(null);
  const doneRef = useRef(false);
  const timer   = useRef(null);
  const pat     = BREATHE_MODES[mode];
  const step    = pat.steps[phase];

  function start() { setRunning(true); setPhase(0); setCount(0); setCycles(0); doneRef.current=false; }
  function stop()  { setRunning(false); clearTimeout(timer.current); if(cycles>0&&!doneRef.current){doneRef.current=true;onComplete();} }

  useEffect(()=>{
    if (!running) return;
    if (count<step.d) { timer.current=setTimeout(()=>setCount(c=>c+1),1000); }
    else {
      const next=(phase+1)%pat.steps.length;
      if (next===0) { const nc=cycles+1; setCycles(nc); if(nc===1&&!doneRef.current){doneRef.current=true;onComplete();} }
      setPhase(next); setCount(0);
    }
    return ()=>clearTimeout(timer.current);
  },[running,count,phase,pat]);

  const stClass=!running?"":step.l==="Inhala"?"expand":step.l==="Exhala"?"shrink":"hold";

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Técnicas de <em>Relajación</em> y Estudio</h2>
        <p>Herramientas para el cuerpo, la mente y el aprendizaje</p>
      </div>

      {/* Tab switcher */}
      <div className="flex mb20" style={{gap:8}}>
        <button className={tab==="breathe"?"btn":"btn-ghost"} onClick={()=>setTab("breathe")}>🫁 Relajación</button>
        <button className={tab==="study"?"btn":"btn-ghost"} onClick={()=>setTab("study")}>📚 Métodos de estudio</button>
      </div>

      {tab==="breathe" && (
        <>
          <div className="card center mb16">
            <div className="flex flex-wrap" style={{justifyContent:"center",gap:8,marginBottom:28}}>
              {BREATHE_MODES.map((b,i)=>(
                <button key={i} className={mode===i?"btn btn-sm":"btn-ghost btn-sm"} onClick={()=>{setMode(i);stop();}}>{b.name}</button>
              ))}
            </div>
            <div className={"breath-ring "+stClass} onClick={running?stop:start}>
              <div className="breath-text">
                {running
                  ? <><div className="breath-num">{step.d-count}</div><div className="breath-lbl">{step.l}</div></>
                  : <><div style={{fontSize:15,color:"var(--muted)"}}>Tocá para</div><div style={{fontSize:17}}>empezar</div></>
                }
              </div>
            </div>
            <p className="muted mt16">{running?`Ciclo ${cycles+1} — Respirá con calma`:`Secuencia: ${pat.steps.map(s=>`${s.l} (${s.d}s)`).join(" → ")}`}</p>
            {running&&<button className="btn-ghost btn-sm mt12" onClick={stop} style={{display:"inline-block"}}>Detener</button>}
          </div>
          <div className="g2">
            {[
              {icon:"🧠",title:"¿Por qué respirar?",  body:"La respiración controlada activa el sistema parasimpático, reduciendo cortisol y ansiedad."},
              {icon:"⏰",title:"¿Cuándo practicar?",   body:"Antes de exámenes, al despertar, al sentir ansiedad o como rutina de 5 minutos diarios."},
              {icon:"🎯",title:"4-7-8 para dormir",    body:"Especialmente efectiva para conciliar el sueño y calmar la mente antes de acostarte."},
              {icon:"💡",title:"Consistencia clave",   body:"Practicar diariamente, aunque sean 3 minutos, genera cambios neurológicos en pocas semanas."},
            ].map((tip,i)=>(
              <div key={i} className="card flex" style={{gap:14,alignItems:"flex-start"}}>
                <span style={{fontSize:24,flexShrink:0}}>{tip.icon}</span>
                <div><div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{tip.title}</div><p className="muted" style={{lineHeight:1.55}}>{tip.body}</p></div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab==="study" && (
        <>
          <p className="muted mb16">Hacé clic en cualquier método para ver cómo aplicarlo paso a paso.</p>
          <div className="g2">
            {STUDY_METHODS.map(m=>{
              const isOpen = openMethod===m.id;
              return (
                <div key={m.id} className={"method-card card"+(isOpen?" open":"")}
                  style={{cursor:"pointer"}} onClick={()=>setOpenMethod(isOpen?null:m.id)}>
                  <div className="method-icon">{m.icon}</div>
                  <div className="method-name">{m.name}</div>
                  <span className="badge" style={{background:m.tagColor,color:m.tagText,marginBottom:10}}>{m.tag}</span>
                  <div className="method-body">{m.body}</div>
                  {isOpen && (
                    <div className="method-steps">
                      <p style={{fontWeight:600,fontSize:13,marginBottom:10,color:"var(--text)"}}>Cómo aplicarlo:</p>
                      {m.steps.map((s,i)=>(
                        <div key={i} className="method-step">
                          <div className="step-num">{i+1}</div>
                          <span>{s}</span>
                        </div>
                      ))}
                      <div style={{marginTop:12,padding:"10px 12px",borderRadius:9,background:"rgba(124,92,191,.08)",fontSize:13,lineHeight:1.6}}>
                        {m.tip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGROS
───────────────────────────────────────────── */
function LogrosSection({ stats }) {
  const unlocked = ALL_ACHIEVEMENTS.filter(a=>a.check(stats));
  const locked   = ALL_ACHIEVEMENTS.filter(a=>!a.check(stats));
  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Tus <em>Logros</em></h2>
        <p>{unlocked.length} de {ALL_ACHIEVEMENTS.length} desbloqueados — cada uno cuenta</p>
      </div>
      <div className="card mb16">
        <div className="flex mb8">
          <span style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:15}}>Progreso total</span>
          <span className="badge" style={{background:"rgba(124,92,191,.14)",color:"var(--accent)",marginLeft:"auto"}}>{Math.round(unlocked.length/ALL_ACHIEVEMENTS.length*100)}%</span>
        </div>
        <div className="prog-wrap"><div className="prog-fill" style={{width:`${unlocked.length/ALL_ACHIEVEMENTS.length*100}%`,background:"var(--accent)"}}/></div>
      </div>
      {unlocked.length>0&&(
        <>
          <p style={{fontSize:11,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Desbloqueados 🏆</p>
          <div className="g2 mb20">
            {unlocked.map(a=>(
              <div key={a.id} className="achievement-card card">
                <div className="achievement-icon">{a.icon}</div>
                <div><div className="achievement-name">{a.name}</div><div className="achievement-desc">{a.desc}</div></div>
              </div>
            ))}
          </div>
        </>
      )}
      {locked.length>0&&(
        <>
          <p style={{fontSize:11,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Por desbloquear</p>
          <div className="g2">
            {locked.map(a=>(
              <div key={a.id} className="achievement-card card locked">
                <div className="achievement-icon">{a.icon}</div>
                <div><div className="achievement-name">{a.name}</div><div className="achievement-desc">{a.desc}</div></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMMUNITY (Kira puede comentar posts)
───────────────────────────────────────────── */
function CommunitySection({ onPost }) {
  const [posts,   setPosts]   = useState(FORUM_INIT);
  const [newPost, setNewPost] = useState("");
  const [newTag,  setNewTag]  = useState("Reflexión");
  const [toast,   showToast]  = useToast();

  function submit() {
    if (!newPost.trim()) return;
    setPosts(ps=>[{id:Date.now(),user:"Vos",av:"🙂",time:"Ahora",body:newPost.trim(),likes:0,liked:false,tag:newTag,kira:null,kiraLoading:false},...ps]);
    setNewPost(""); onPost(); showToast("¡Publicación enviada!");
  }
  function like(id) { setPosts(ps=>ps.map(p=>p.id===id?{...p,likes:p.liked?p.likes-1:p.likes+1,liked:!p.liked}:p)); }
  async function askKira(id) {
    const post=posts.find(p=>p.id===id);
    if (!post||post.kiraLoading||post.kira) return;
    setPosts(ps=>ps.map(p=>p.id===id?{...p,kiraLoading:true}:p));
    try {
      const reply = await callKira([{role:"user",content:`Un estudiante publicó esto en la comunidad estudiantil: "${post.body}"\n\nRespondé con un comentario breve de apoyo (máximo 3 oraciones), cálido y en español rioplatense. No uses listas. Firmá como Kira 💛`}]);
      setPosts(ps=>ps.map(p=>p.id===id?{...p,kira:reply,kiraLoading:false}:p));
    } catch { setPosts(ps=>ps.map(p=>p.id===id?{...p,kiraLoading:false}:p)); }
  }

  const TAG_C = {Logro:"#a8c99a",Apoyo:"#a393c8",Tip:"#e8b96a",Reflexión:"#7fba9e",Consulta:"#e07b6a"};

  return (
    <div className="section-wrap">
      <div className="sec-head">
        <h2>Comunidad <em>Estudiantil</em></h2>
        <p>Un espacio para apoyarse, compartir logros y consejos</p>
      </div>
      <div className="card mb16">
        <textarea className="inp mb12" placeholder="Compartí algo con la comunidad…" value={newPost} onChange={e=>setNewPost(e.target.value)} />
        <div className="flex">
          <select className="sel" value={newTag} onChange={e=>setNewTag(e.target.value)}>
            {["Reflexión","Logro","Apoyo","Tip","Consulta"].map(t=><option key={t}>{t}</option>)}
          </select>
          <button className="btn" onClick={submit} disabled={!newPost.trim()}>Publicar</button>
        </div>
      </div>
      {posts.map(p=>(
        <div key={p.id} className="post-card">
          <div className="flex mb8">
            <div className="post-avatar">{p.av}</div>
            <div style={{flex:1,paddingLeft:10}}>
              <div className="post-author">{p.user}</div>
              <div className="post-time">{p.time}</div>
            </div>
            <span className="badge" style={{background:`${TAG_C[p.tag]||"#fff"}22`,color:TAG_C[p.tag]||"#fff",border:`1px solid ${TAG_C[p.tag]||"#fff"}44`}}>{p.tag}</span>
          </div>
          <div className="post-body">{p.body}</div>
          <div className="post-actions">
            <button className={"post-btn"+(p.liked?" liked":"")} onClick={()=>like(p.id)}>{p.liked?"❤️":"🤍"} {p.likes}</button>
            <button className="post-btn">💬 Comentar</button>
            <button className="post-btn" onClick={()=>askKira(p.id)} disabled={!!p.kira||p.kiraLoading}
              style={{color:p.kira?"var(--muted)":"var(--accent)",opacity:p.kira?.5:1}}>
              {p.kiraLoading?"Kira escribe…":p.kira?"💛 Kira respondió":"💛 Pedir respuesta a Kira"}
            </button>
          </div>
          {p.kira&&(
            <div className="kira-reply">
              <div className="kira-reply-hdr">Kira 💛</div>
              {p.kira}
            </div>
          )}
        </div>
      ))}
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUPABASE CONFIG
   Reemplazá los dos valores de abajo con los
   de tu proyecto en supabase.com →
   Project Settings → API
───────────────────────────────────────────── */
const SUPABASE_URL  = "https://tbxyxyitxjacltwcskxi.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRieHl4eWl0eGphY2x0d2Nza3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzk4MzYsImV4cCI6MjA4ODc1NTgzNn0.Ul2Oh2FN9WUGOTahfFWK0zw3qR8YZf5o2qbdqKAJOss";

/* Cliente Supabase liviano (sin SDK, fetch puro) */
const supabase = {
  async signUp(email, password, name) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON },
      body: JSON.stringify({ email, password, data:{ full_name: name } }),
    });
    const d = await res.json();
    if (!res.ok || d.error) return { ok:false, error: d.error?.message || d.msg || "Error al registrar." };
    // Supabase devuelve session o user según la config de email confirm
    const session = d.session || null;
    const user    = d.user || d;
    return { ok:true, session, user };
  },

  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON },
      body: JSON.stringify({ email, password }),
    });
    const d = await res.json();
    if (!res.ok || d.error) return { ok:false, error: d.error_description || d.error?.message || "Credenciales incorrectas." };
    return { ok:true, session: d, user: d.user };
  },

  async signOut(accessToken) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON, "Authorization": `Bearer ${accessToken}` },
    });
  },

  async resetPassword(email) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "apikey": SUPABASE_ANON },
      body: JSON.stringify({ email }),
    });
    const d = await res.json();
    if (!res.ok || d.error) return { ok:false, error: d.error?.message || "Error al enviar email." };
    return { ok:true };
  },
};

/* Sesión en localStorage (solo guarda token + nombre, no contraseña) */
const LS_SESSION = "e360_sb_session";
function getSession()      { try { return JSON.parse(localStorage.getItem(LS_SESSION)||"null"); } catch { return null; } }
function saveSession(s)    { localStorage.setItem(LS_SESSION, JSON.stringify(s)); }
function clearSession()    { localStorage.removeItem(LS_SESSION); }

function pwStrength(pw) {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return score;
}

const PW_COLORS = ["var(--border)","#e06b8a","#e8b96a","#7fba9e","#5aacb8"];
const PW_LABELS = ["","Muy débil","Débil","Buena","Fuerte"];

/* ─────────────────────────────────────────────
   AUTH SCREENS
───────────────────────────────────────────── */
function AuthShell({ darkMode, setDarkMode, children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}} />
      <div className="auth-shell">
        <div style={{position:"fixed",top:16,right:16}}>
          <button className="theme-btn" onClick={()=>setDarkMode(d=>!d)}>{darkMode?"☀️":"🌙"}</button>
        </div>
        {children}
      </div>
    </>
  );
}

function LoginScreen({ onLogin, onGoRegister, onGoForgot, darkMode, setDarkMode }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function submit() {
    setError("");
    if (!email.trim()) return setError("Ingresá tu email.");
    if (!password)     return setError("Ingresá tu contraseña.");
    setLoading(true);
    try {
      const res = await supabase.signIn(email.trim(), password);
      if (!res.ok) { setError(res.error); return; }
      const name = res.user?.user_metadata?.full_name || res.user?.email?.split("@")[0] || "Estudiante";
      const sess = { id: res.user.id, name, email: res.user.email, accessToken: res.session?.access_token };
      saveSession(sess);
      onLogin(sess);
    } catch(err) {
      setError("No se pudo conectar. Verificá tu conexión e intentá de nuevo.");
    } finally { setLoading(false); }
  }

  return (
    <AuthShell darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="auth-card">
        <div className="auth-logo">E°<span>Estudiante 360</span></div>
        <div style={{height:24}}/>
        <div className="auth-title">Bienvenido/a de vuelta</div>
        <div className="auth-subtitle">Ingresá con tu cuenta para continuar</div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className={"auth-inp"+(error?" error":"")} type="email" placeholder="tu@mail.com"
              value={email} onChange={e=>{setEmail(e.target.value);setError("");}} autoComplete="email"
              onKeyDown={e=>e.key==="Enter"&&submit()} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <div className="auth-pw-wrap">
              <input className={"auth-inp"+(error?" error":"")}
                type={showPw?"text":"password"} placeholder="••••••••"
                value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
                autoComplete="current-password" style={{paddingRight:42}}
                onKeyDown={e=>e.key==="Enter"&&submit()} />
              <button type="button" className="auth-pw-toggle" onClick={()=>setShowPw(s=>!s)}>
                {showPw?"🙈":"👁️"}
              </button>
            </div>
          </div>
          <button type="button" className="forgot-link" onClick={onGoForgot}>¿Olvidaste tu contraseña?</button>
          <button type="button" className="auth-btn" disabled={loading} onClick={submit}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </div>

        <div className="auth-divider">o</div>
        <div className="auth-switch">
          ¿No tenés cuenta?{" "}
          <button className="auth-link" onClick={onGoRegister}>Registrate acá</button>
        </div>
      </div>
    </AuthShell>
  );
}

function RegisterScreen({ onLogin, onGoLogin, darkMode, setDarkMode }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const strength = pwStrength(password);

  async function submit() {
    setError("");
    if (!name.trim())                    return setError("Ingresá tu nombre.");
    if (!email.trim())                   return setError("Ingresá tu email.");
    if (!/\S+@\S+\.\S+/.test(email))     return setError("El email no tiene un formato válido.");
    if (password.length < 6)             return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm)            return setError("Las contraseñas no coinciden.");
    setLoading(true);
    try {
      const res = await supabase.signUp(email.trim(), password, name.trim());
      if (!res.ok) { setError(res.error); return; }
      // Si Supabase devuelve sesión directa (email confirm desactivado)
      if (res.session?.access_token) {
        const sess = { id: res.user.id, name: name.trim(), email: res.user.email, accessToken: res.session.access_token };
        saveSession(sess);
        onLogin(sess);
      } else {
        // Supabase envió email de confirmación
        setSuccess(true);
      }
    } catch(err) {
      setError("No se pudo conectar. Verificá tu conexión e intentá de nuevo.");
    } finally { setLoading(false); }
  }

  return (
    <AuthShell darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="auth-card">
        <div className="auth-logo">E°<span>Estudiante 360</span></div>
        <div style={{height:24}}/>

        {success ? (
          <div style={{textAlign:"center",padding:"10px 0 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>📬</div>
            <div className="auth-title">¡Revisá tu email!</div>
            <div className="auth-subtitle" style={{marginBottom:20}}>
              Te enviamos un link de confirmación a <strong>{email}</strong>. Confirmá tu cuenta y después iniciá sesión.
            </div>
            <button className="auth-btn" onClick={onGoLogin}>Ir al login</button>
          </div>
        ) : (
          <>
            <div className="auth-title">Creá tu cuenta</div>
            <div className="auth-subtitle">Registrate para acceder a todas las herramientas de bienestar</div>

            {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={e=>{e.preventDefault();submit();}}>
          <div className="auth-field">
            <label className="auth-label">Nombre</label>
            <input className="auth-inp" type="text" placeholder="Tu nombre"
              value={name} onChange={e=>{setName(e.target.value);setError("");}} autoComplete="name" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-inp" type="email" placeholder="tu@mail.com"
              value={email} onChange={e=>{setEmail(e.target.value);setError("");}} autoComplete="email" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <div className="auth-pw-wrap">
              <input className="auth-inp" type={showPw?"text":"password"} placeholder="Mínimo 6 caracteres"
                value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
                autoComplete="new-password" style={{paddingRight:42}} />
              <button type="button" className="auth-pw-toggle" onClick={()=>setShowPw(s=>!s)}>
                {showPw?"🙈":"👁️"}
              </button>
            </div>
            {password && (
              <>
                <div className="auth-strength" style={{marginTop:6}}>
                  {[1,2,3,4].map(i=>(
                    <div key={i} className="auth-strength-bar"
                      style={{background:i<=strength?PW_COLORS[strength]:"var(--border)"}} />
                  ))}
                </div>
                <div style={{fontSize:11,color:PW_COLORS[strength],marginTop:4}}>{PW_LABELS[strength]}</div>
              </>
            )}
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirmar contraseña</label>
            <input className={"auth-inp"+(confirm&&confirm!==password?" error":"")}
              type={showPw?"text":"password"} placeholder="Repetí la contraseña"
              value={confirm} onChange={e=>{setConfirm(e.target.value);setError("");}}
              autoComplete="new-password" />
            {confirm && confirm !== password && (
              <div style={{fontSize:11,color:"var(--accent3)",marginTop:4}}>Las contraseñas no coinciden</div>
            )}
          </div>
          <button type="button" className="auth-btn" disabled={loading} onClick={submit}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-divider">o</div>
        <div className="auth-switch">
          ¿Ya tenés cuenta?{" "}
          <button className="auth-link" onClick={onGoLogin}>Iniciá sesión</button>
        </div>
        </>
        )}
      </div>
    </AuthShell>
  );
}

function ForgotScreen({ onGoLogin, darkMode, setDarkMode }) {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    if (!email.trim()) return setError("Ingresá tu email.");
    setLoading(true);
    try {
      const res = await supabase.resetPassword(email.trim());
      if (!res.ok) { setError(res.error); return; }
      setSent(true);
    } catch {
      setError("No se pudo conectar. Intentá de nuevo.");
    } finally { setLoading(false); }
  }

  return (
    <AuthShell darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="auth-card">
        <div className="auth-logo">E°<span>Estudiante 360</span></div>
        <div style={{height:24}}/>

        {sent ? (
          <div style={{textAlign:"center",padding:"10px 0 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>📬</div>
            <div className="auth-title">Email enviado</div>
            <div className="auth-subtitle" style={{marginBottom:20}}>
              Te mandamos un link para restablecer tu contraseña a <strong>{email}</strong>. Revisá también la carpeta de spam.
            </div>
            <button className="auth-btn" onClick={onGoLogin}>Volver al login</button>
          </div>
        ) : (
          <>
            <div className="auth-title">Recuperar contraseña</div>
            <div className="auth-subtitle">Ingresá tu email y te enviamos un link para restablecerla</div>
            {error && <div className="auth-error">⚠️ {error}</div>}
            <div>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input className="auth-inp" type="email" placeholder="tu@mail.com"
                  value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&submit()} />
              </div>
              <button type="button" className="auth-btn" disabled={loading} onClick={submit}>
                {loading ? "Enviando…" : "Enviar link"}
              </button>
            </div>
            <div className="auth-switch" style={{marginTop:16}}>
              <button className="auth-link" onClick={onGoLogin}>← Volver al login</button>
            </div>
          </>
        )}
      </div>
    </AuthShell>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [authScreen, setAuthScreen] = useState("login");
  const [user,       setUser]       = useState(() => getSession());

  const prefersDark = typeof window!=="undefined"&&window.matchMedia("(prefers-color-scheme:dark)").matches;
  const [darkMode, setDarkMode] = useState(prefersDark);
  useEffect(()=>{document.documentElement.setAttribute("data-theme",darkMode?"dark":"light");},[darkMode]);

  const [section,     setSection]    = useState("dashboard");
  const [mood,        setMood]       = useState(null);
  const [moodHistory, setMoodHistory]= useState(Array(7).fill(null));
  const [tasks,       setTasks]      = useState(INITIAL_TASKS);
  const [sosOpen,     setSosOpen]    = useState(false);
  const [stats,       setStats]      = useState({moodCount:0,doneTasks:0,diaryCount:0,breatheCount:0,chatCount:0,communityPosts:0});

  const bump = key => setStats(s=>({...s,[key]:s[key]+1}));

  function handleLogin(u)  { setUser(u); }
  async function handleLogout() {
    const sess = getSession();
    if (sess?.accessToken) await supabase.signOut(sess.accessToken).catch(()=>{});
    clearSession(); setUser(null); setAuthScreen("login");
  }

  // Auth gate
  if (!user) {
    const ap = { darkMode, setDarkMode };
    if (authScreen==="register") return <RegisterScreen {...ap} onLogin={handleLogin} onGoLogin={()=>setAuthScreen("login")} />;
    if (authScreen==="forgot")   return <ForgotScreen   {...ap} onGoLogin={()=>setAuthScreen("login")} />;
    return <LoginScreen {...ap} onLogin={handleLogin} onGoRegister={()=>setAuthScreen("register")} onGoForgot={()=>setAuthScreen("forgot")} />;
  }

  const titles = {
    dashboard:<><em>Dashboard</em></>,
    chat:     <>Chat con <em>Kira</em></>,
    mood:     <>Registro de <em>Emociones</em></>,
    diary:    <>Diario de <em>Bienestar</em></>,
    calendar: <>Calendario <em>Académico</em></>,
    materias: <>Mis <em>Materias</em></>,
    tasks:    <>Lista de <em>Tareas</em></>,
    relax:    <>Técnicas de <em>Relajación</em> y Estudio</>,
    logros:   <>Tus <em>Logros</em></>,
    community:<><em>Comunidad</em> Estudiantil</>,
  };

  function addMoodEntry(entry) {
    const idx=new Date().getDay();
    setMoodHistory(h=>{const n=[...h];n[idx===0?6:idx-1]=entry;return n;});
    bump("moodCount");
  }

  // first name only for greeting
  const firstName = user.name?.split(" ")[0] || "Estudiante";

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}} />
      <div className="shell">
        <div className="body-row">

          <nav className="sidebar">
            <div className="sb-logo">E°<span>360</span></div>
            {NAV.map(n=>(
              <button key={n.id} className={"sb-btn"+(section===n.id?" active":"")} onClick={()=>setSection(n.id)}>
                <span>{n.icon}</span>
                <span className="tip">{n.label}</span>
              </button>
            ))}
            {/* logout at bottom of sidebar */}
            <div style={{flex:1}}/>
            <button className="sb-btn" onClick={handleLogout} title="Cerrar sesión" style={{marginTop:8}}>
              <span>🚪</span>
              <span className="tip">Cerrar sesión</span>
            </button>
          </nav>

          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div className="topbar">
              <div className="topbar-title">{titles[section]}</div>
              <div className="topbar-right">
                {mood&&(
                  <div className="topbar-pill">
                    <span style={{fontSize:16}}>{MOODS.find(m=>m.l===mood)?.e}</span>
                    <span>{mood}</span>
                  </div>
                )}
                <div className="topbar-pill">
                  <div className="dot"/>
                  <span>{firstName}</span>
                </div>
                <button className="theme-btn" onClick={()=>setDarkMode(d=>!d)} title={darkMode?"Modo claro":"Modo oscuro"}>
                  {darkMode?"☀️":"🌙"}
                </button>
              </div>
            </div>

            <div className="main">
              {section==="dashboard" && <Dashboard mood={mood} tasks={tasks} setSection={setSection} stats={stats} userName={firstName} />}
              {section==="chat"      && <Chat mood={mood} onChatUsed={()=>bump("chatCount")} />}
              {section==="mood"      && <MoodSection mood={mood} setMood={setMood} moodHistory={moodHistory} addMoodEntry={addMoodEntry} />}
              {section==="diary"     && <DiarySection currentMood={mood} onDiaryEntry={()=>bump("diaryCount")} />}
              {section==="calendar"  && <CalendarSection />}
              {section==="materias"  && <MateriasSection />}
              {section==="tasks"     && <TasksSection tasks={tasks} setTasks={setTasks} onTaskDone={()=>bump("doneTasks")} />}
              {section==="relax"     && <RelaxSection onComplete={()=>bump("breatheCount")} />}
              {section==="logros"    && <LogrosSection stats={stats} />}
              {section==="community" && <CommunitySection onPost={()=>bump("communityPosts")} />}
            </div>

            <footer className="footer">
              Proyecto desarrollado en el marco de&nbsp;
              <strong style={{color:"var(--accent)"}}>Gestión del Desarrollo Tecnológico</strong>
              &nbsp;·&nbsp; Estudiante 360 © {new Date().getFullYear()}
            </footer>
          </div>
        </div>
      </div>

      <button className="sos-btn" onClick={()=>setSosOpen(true)} title="Ayuda rápida">🆘</button>
      {sosOpen&&<SosPanel onClose={()=>setSosOpen(false)} />}
    </>
  );
}
