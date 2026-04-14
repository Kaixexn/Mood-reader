const PRESETS = [
  { hex: '#E24B4A', label: 'Red' },
  { hex: '#EF9F27', label: 'Amber' },
  { hex: '#F9CA24', label: 'Yellow' },
  { hex: '#5DCAA5', label: 'Teal' },
  { hex: '#378ADD', label: 'Blue' },
  { hex: '#7F77DD', label: 'Purple' },
  { hex: '#D4537E', label: 'Pink' },
  { hex: '#97C459', label: 'Green' },
  { hex: '#888780', label: 'Gray' },
];

const GEMINI_API_KEY = 'AIzaSyCOHDCzsVxeAZ3m-nlXy9iaqvyVvf7e7V0';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${AIzaSyCOHDCzsVxeAZ3m-nlXy9iaqvyVvf7e7V0}`;

// Different writing styles to rotate through so every response feels different
const STYLES = [
  'like a warm older sibling who has been through hard times themselves',
  'like a best friend texting you at midnight who genuinely gets it',
  'like a gentle poet who finds beauty even in difficult emotions',
  'like a calm, grounded person who just wants you to breathe and feel seen',
  'like someone who has felt exactly this color before and wants you to know you are not alone',
  'like a caring person who skips the advice and just sits with you in the feeling',
  'like a journal entry written for you, soft and honest',
  'like a friend who always knows exactly what to say without trying too hard',
];

let currentColor = '#4ECDC4';
let currentResult = null;
let styleIndex = Math.floor(Math.random() * STYLES.length);
let history = [];
try { history = JSON.parse(localStorage.getItem('moodHistory') || '[]'); } catch {}

// ── DOM refs ──────────────────────────────────────────────
const picker     = document.getElementById('colorPicker');
const swatch     = document.getElementById('swatchCircle');
const hexVal     = document.getElementById('hexVal');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultArea = document.getElementById('resultArea');
const presetsEl  = document.getElementById('presets');

// ── Build preset dots ─────────────────────────────────────
PRESETS.forEach(p => {
  const dot = document.createElement('div');
  dot.className = 'preset-dot';
  dot.style.background = p.hex;
  dot.dataset.hex = p.hex;
  dot.title = p.label;
  dot.onclick = () => setColor(p.hex);
  presetsEl.appendChild(dot);
});

// ── Color setter ──────────────────────────────────────────
function setColor(hex) {
  currentColor = hex;
  picker.value = hex;
  swatch.style.background = hex;
  hexVal.textContent = hex.toUpperCase();
  document.querySelectorAll('.preset-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.hex.toUpperCase() === hex.toUpperCase());
  });
}

picker.addEventListener('input', e => setColor(e.target.value));
setColor(currentColor);

// ── Analyse button ────────────────────────────────────────
analyzeBtn.addEventListener('click', async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Reading...';
  resultArea.innerHTML = `<div class="result-card"><p class="loading-text">Feeling the colors, writing something just for you...</p></div>`;

  const ctx    = document.getElementById('context').value.trim();
  const result = await getAIMood(currentColor, ctx);
  currentResult = result;
  showResult(result, currentColor);

  analyzeBtn.disabled = false;
  analyzeBtn.textContent = 'Read my mood';
});

// ── Gemini API call ───────────────────────────────────────
async function getAIMood(hex, notes) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Rotate style on every call so responses never feel copy-pasted
  const style = STYLES[styleIndex % STYLES.length];
  styleIndex++;

  // Time of day adds natural context variety
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

  const prompt = `It is ${timeOfDay}. Someone opened a mood tracker and picked the color ${hex} (R:${r}, G:${g}, B:${b}) to represent how they feel right now.${notes ? ` They added: "${notes}"` : ' They did not add any notes.'}

Write your response ${style}.

The color ${hex} — think carefully about its emotional weight. Is it fiery, cold, murky, bright, heavy, soft? Let that guide the mood name and the tone of your note.

Do NOT recycle phrases like "it's okay to feel this way", "you are not alone", "take a deep breath", or "be kind to yourself". Say something FRESH and specific to this color and this moment.

Reply in exactly this format and nothing else:
MOOD: <1-3 word mood name — poetic and specific, not generic>
NOTE: <4-5 sentences, warm and personal, no clichés>`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 1.8,   // max creative variance
          topP: 1.0,
          topK: 64
        }
      })
    });

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('Empty response');

    const moodMatch = text.match(/MOOD:\s*(.+)/i);
    const noteMatch = text.match(/NOTE:\s*([\s\S]+)/i);

    return {
      mood: moodMatch ? moodMatch[1].trim() : 'Reflective',
      note: noteMatch ? noteMatch[1].trim() : text.trim()
    };

  } catch (err) {
    console.warn('Gemini error:', err);
    // Rotate fallbacks too so even errors feel different
    const fallbacks = [
      "That color you picked — it says a lot even without words. Sit with it for a second. Whatever today has thrown at you, you are still here, still feeling, still moving.",
      "Something in you chose that color for a reason, and that reason is valid. You don't have to explain it to anyone. Just let yourself feel it fully.",
      "Colors don't lie — and whatever this one means to you right now, that feeling deserves space. Give yourself permission to just be where you are today.",
    ];
    return {
      mood: 'Reflective',
      note: fallbacks[styleIndex % fallbacks.length]
    };
  }
}

// ── Show result card ──────────────────────────────────────
function showResult(result, hex) {
  resultArea.innerHTML = `
    <div class="result-card">
      <div class="mood-name">
        <div class="mood-dot" style="background:${hex}"></div>
        ${escapeHtml(result.mood)}
      </div>
      <p class="note-text">${escapeHtml(result.note)}</p>
      <div class="result-actions">
        <button class="save-btn" id="saveBtn">Save this moment</button>
        <button class="read-again-btn" id="readAgainBtn">New reading</button>
      </div>
    </div>
  `;

  document.getElementById('saveBtn').onclick      = () => saveEntry(hex, result);
  document.getElementById('readAgainBtn').onclick = () => analyzeBtn.click();
}

// ── Save entry ────────────────────────────────────────────
function saveEntry(hex, result) {
  const ctx   = document.getElementById('context').value.trim();
  const entry = {
    color:   hex,
    mood:    result.mood,
    note:    result.note,
    context: ctx,
    time:    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date:    new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
  };

  history.unshift(entry);
  history = history.slice(0, 15);
  try { localStorage.setItem('moodHistory', JSON.stringify(history)); } catch {}
  renderHistory();
  showToast('Saved!');
}

// ── Render history ────────────────────────────────────────
function renderHistory() {
  const el = document.getElementById('historyList');
  if (!el) return;

  if (!history.length) {
    el.innerHTML = '<p class="no-history">Your saved moods will show up here.</p>';
    return;
  }

  el.innerHTML = `
    <div class="history-header">
      <span>Mood history (${history.length})</span>
      <button id="clearAllBtn" class="clear-all-btn">Clear all</button>
    </div>
    ${history.slice(0, 6).map(h => `
      <div class="history-item">
        <div class="h-dot" style="background:${h.color}"></div>
        <div class="history-info">
          <div class="h-mood">${escapeHtml(h.mood)}</div>
          <div class="h-date">${h.date} · ${h.time}</div>
          ${h.context ? `<div class="h-context">"${escapeHtml(h.context)}"</div>` : ''}
          <div class="h-note">${escapeHtml(h.note.slice(0, 140))}${h.note.length > 140 ? '...' : ''}</div>
        </div>
      </div>
    `).join('')}
  `;

  document.getElementById('clearAllBtn').onclick = clearAllHistory;
}

// ── Clear history ─────────────────────────────────────────
function clearAllHistory() {
  if (confirm('Clear your entire mood history? This cannot be undone.')) {
    history = [];
    localStorage.removeItem('moodHistory');
    renderHistory();
    showToast('History cleared.');
  }
}

// ── Toast ─────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ── XSS safety ────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────────
renderHistory();
