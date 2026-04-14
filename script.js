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

let currentColor = '#4ECDC4';
let currentResult = null;
let history = [];
try { history = JSON.parse(localStorage.getItem('moodHistory') || '[]'); } catch {}

const picker = document.getElementById('colorPicker');
const swatch = document.getElementById('swatchCircle');
const hexVal = document.getElementById('hexVal');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultArea = document.getElementById('resultArea');
const presetsEl = document.getElementById('presets');

PRESETS.forEach(p => {
  const dot = document.createElement('div');
  dot.className = 'preset-dot';
  dot.style.background = p.hex;
  dot.dataset.hex = p.hex;
  dot.dataset.label = p.label;
  dot.title = p.label;
  dot.onclick = () => setColor(p.hex);
  presetsEl.appendChild(dot);
});

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

analyzeBtn.addEventListener('click', async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Reading...';
  resultArea.innerHTML = `<div class="result-card"><p class="loading-text">Feeling the colors, writing something just for you...</p></div>`;

  const ctx = document.getElementById('context').value.trim();
  const result = await getAIMood(currentColor, ctx);
  currentResult = result;
  showResult(result, currentColor);

  analyzeBtn.disabled = false;
  analyzeBtn.textContent = 'Read my mood';
});

async function getAIMood(hex, notes) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const randomSeed = Math.random().toString(36).substring(7);

  const prompt = `Session ID: ${randomSeed} - Creative writing task!

Someone picked color ${hex} (R:${r} G:${g} B:${b}) to describe their mood.${notes ? ` Notes: "${notes}"` : ''}

Respond with UNIQUE response every time:
MOOD: <1-3 word mood name - be creative, vary it!>
NOTE: <3-5 sentences of warm, personal encouragement>

Write like a DIFFERENT caring friend each time. Vary tone, style, metaphors!`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA0c_cnzPRJn0303KtbctwafYXp6ALGMK4`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            maxOutputTokens: 350,
            temperature: 0.95,
            topP: 0.98,
            topK: 50
          }
        })
      }
    );

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    const moodMatch = text.match(/MOOD:\s*(.+)/i);
    const noteMatch = text.match(/NOTE:\s*([\s\S]+)/i);

    return {
      mood: moodMatch ? moodMatch[1].trim() : 'Reflective',
      note: noteMatch ? noteMatch[1].trim() : text.trim()
    };
  } catch {
    return {
      mood: 'Reflective',
      note: `Hey, whatever shade you're feeling today, it's valid. ${randomSeed.slice(0,3)} reminds me you're unique. Breathe. You've got this.`
    };
  }
}

function showResult(result, hex) {
  resultArea.innerHTML = `
    <div class="result-card">
      <div class="mood-name">
        <div class="mood-dot" style="background:${hex}"></div>
        ${result.mood}
      </div>
      <p class="note-text">${result.note}</p>
      <div class="result-actions">
        <button class="save-btn" id="saveBtn">💾 Save Moment</button>
        <button class="read-again-btn" id="readAgainBtn">🎲 New Reading</button>
      </div>
    </div>
  `;
  
  document.getElementById('saveBtn').onclick = () => saveEntry(hex, result);
  document.getElementById('readAgainBtn').onclick = () => {
    analyzeBtn.click();
  };
}

function saveEntry(hex, result) {
  const ctx = document.getElementById('context').value.trim();
  const entry = {
    color: hex,
    mood: result.mood,
    note: result.note,
    context: ctx,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
  };

  history.unshift(entry);
  history = history.slice(0, 15);
  try { localStorage.setItem('moodHistory', JSON.stringify(history)); } catch {}
  renderHistory();
  showToast('Saved to history! ✨');
}

function renderHistory() {
  const el = document.getElementById('historyList');
  if (!el) return;
  
  if (!history.length) {
    el.innerHTML = '<p class="no-history">Your saved moods will show up here. Save your first reading!</p>';
    return;
  }
  
  el.innerHTML = `
    <div class="history-header">
      <h3>📜 Your Mood History (${history.length})</h3>
      <button id="clearAllBtn" class="clear-all-btn">🗑️ Clear All</button>
    </div>
    ${history.slice(0, 6).map(h => `
      <div class="history-item">
        <div class="h-dot" style="background:${h.color}"></div>
        <div class="history-info">
          <div class="h-mood">${h.mood}</div>
          <div class="h-date">${h.date} · ${h.time}</div>
          ${h.context ? `<div class="h-context">"${h.context}"</div>` : ''}
          <div class="h-note">${h.note.slice(0, 140)}${h.note.length > 140 ? '...' : ''}</div>
        </div>
      </div>
    `).join('')}
  `;
  
  document.getElementById('clearAllBtn')?.onclick = clearAllHistory;
}

function clearAllHistory() {
  if (confirm('Clear entire mood history? This cannot be undone.')) {
    history = [];
    localStorage.removeItem('moodHistory');
    renderHistory();
    showToast('History cleared! 🧹');
  }
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

renderHistory();
