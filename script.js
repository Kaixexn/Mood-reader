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

const GEMINI_API_KEY = 'AIzaSyA0c_cnzPRJn0303KtbctwafYXp6ALGMK4';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

let currentColor = '#4ECDC4';
let currentResult = null;
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

  const prompt = `Someone picked the color ${hex} (R:${r} G:${g} B:${b}) to describe how they are feeling right now.${notes ? ` They also wrote: "${notes}"` : ''}

Think about what emotions this color carries — its warmth, coolness, brightness, or heaviness — and write a response that feels personal and human.

Reply in exactly this format:
MOOD: <1-3 word mood name, be specific and poetic, e.g. "quietly overwhelmed" or "bursting with hope">
NOTE: <3-5 sentences of genuine heartfelt warmth. Speak directly to them. Acknowledge what they might be feeling, validate it fully, and end with something encouraging. Write like a close friend who truly sees them — not a therapist, not a motivational poster, just a real human who cares.>`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 350,
          temperature: 0.9,
          topP: 0.95,
          topK: 40
        }
      })
    });

    const data = await res.json();

    // Guard against unexpected response shape
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
    return {
      mood: 'Reflective',
      note: "Whatever you're carrying right now, you don't have to carry it alone. Take a slow breath — you're doing better than you think, and it's okay to just feel what you feel today."
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

// ── XSS safety helper ─────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────────
renderHistory();
