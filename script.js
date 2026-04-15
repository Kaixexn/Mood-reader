const letters = {
  "#0000FF": {
    1: {
      greeting: "A note for you, in Blue",
      body: `You are the still surface of a lake at dawn — quiet, vast, and full of something worth diving into. Blue is the color of the truth-teller, the deep thinker, the one who feels things slowly and completely.

Whatever is weighing on you today, it is safe here. You don't have to rush through it.`
    },
    2: {
      greeting: "A note for you, in Blue",
      body: `There's a reason we look up at the sky when we need to breathe. Blue holds space. And so do you — for others, for your thoughts, for the feelings that don't have names yet.

Give yourself the same sky you give everyone else.`
    },
    3: {
      greeting: "A note for you, in Blue",
      body: `Blue minds tend to carry a lot silently. You notice things others miss, feel things longer than most. That isn't a burden — it's a gift.

The world needs your kind of depth more than it will ever say out loud.`
    },
    4: {
      greeting: "A note for you, in Blue",
      body: `When everything feels like static, blue is the channel that still comes through clearly. You are more grounded than you think. Even in the middle of uncertainty, something steady lives inside you.

Trust it today.`
    },
    5: {
      greeting: "A note for you, in Blue",
      body: `The ocean doesn't apologize for its waves. Neither should you apologize for the depth of what you feel. You are allowed to be complex. You are allowed to be both storm and calm.

Blue holds all of it.`
    }
  },

  "#FF0000": {
    1: {
      greeting: "A note for you, in Red",
      body: `Red doesn't whisper. It shows up — fully, fiercely, without apology. And so do you, even when it's terrifying. Whatever you're feeling right now has heat and life in it, and that aliveness is something precious.

Don't dim it.`
    },
    2: {
      greeting: "A note for you, in Red",
      body: `The heart is red for a reason. It pumps hard, it keeps going, it doesn't quit even when you beg it to rest. You are braver than you realize.

The fact that you still feel deeply — that's courage in its purest form.`
    },
    3: {
      greeting: "A note for you, in Red",
      body: `Red is the color of people who care too much to pretend they don't. You love loudly, you hurt loudly, you live loudly. The world may tell you to turn it down.

Don't. Your fire is someone else's warmth.`
    },
    4: {
      greeting: "A note for you, in Red",
      body: `There is power in you today — even if it feels like frustration or urgency or restless energy. Red feelings are asking you to move, to act, to change something.

Listen to that. You already know what needs to happen.`
    },
    5: {
      greeting: "A note for you, in Red",
      body: `Not everyone is brave enough to feel the way you do. Red is the color of people who haven't given up — on life, on love, on what they believe in.

That's you. Burning bright, still here, still trying. That matters more than you know.`
    }
  },

  "#00FF00": {
    1: {
      greeting: "A note for you, in Green",
      body: `You chose green, and green chose you back. It is the color of things that quietly keep growing even in the dark — roots pushing through soil before a single leaf appears.

Something in you is growing right now too, even if you can't see it yet.`
    },
    2: {
      greeting: "A note for you, in Green",
      body: `Healing isn't always dramatic. Sometimes it looks like a slow morning, a deep exhale, a small decision to be kinder to yourself today than you were yesterday.

Green is patient. And so, it seems, are you.`
    },
    3: {
      greeting: "A note for you, in Green",
      body: `The forest doesn't rush its seasons. It trusts the process completely — letting go in autumn, resting in winter, blooming without announcement in spring.

You are in a season too. Trust it. Your growth is on its way.`
    },
    4: {
      greeting: "A note for you, in Green",
      body: `Green is the color of balance — not perfect stillness, but the sway of a tree that bends without breaking. You've bent before. You've come back before.

Whatever storm you're navigating, you have deep roots. They'll hold.`
    },
    5: {
      greeting: "A note for you, in Green",
      body: `There is something quietly brave about choosing to heal. About waking up one more day and deciding to tend to yourself like a garden — with water, with light, with patience.

Green people do that. You are doing that. Keep going.`
    }
  },

  "#FFFF00": {
    1: {
      greeting: "A note for you, in Yellow",
      body: `Yellow is the color of the first hour of morning light — the kind that finds its way through curtains without asking permission. You carry that kind of light too.

Even on the grey days, it's still in there. Someone is warmer just because you exist.`
    },
    2: {
      greeting: "A note for you, in Yellow",
      body: `Joy is not frivolous. Choosing to find brightness, to laugh, to notice the good things — that is one of the most courageous acts there is.

Yellow people carry sunshine in their pockets. You are that person for someone today.`
    },
    3: {
      greeting: "A note for you, in Yellow",
      body: `Yellow is the color of the mind that never stops wondering, noticing, connecting dots. Your curiosity is a gift. Your enthusiasm is contagious even when you don't mean it to be.

The world is more alive because you ask questions.`
    },
    4: {
      greeting: "A note for you, in Yellow",
      body: `Hope is yellow. Not loud, not certain — just quietly, persistently present, like sunflowers that turn their faces toward the light no matter what.

You have that in you. That small, stubborn turning toward better things. Hold onto it.`
    },
    5: {
      greeting: "A note for you, in Yellow",
      body: `You are allowed to be happy. You are allowed to feel light even when things aren't perfect. Joy doesn't have to be earned.

Yellow doesn't apologize for being bright. Neither should you.`
    }
  },

  "#800080": {
    1: {
      greeting: "A note for you, in Purple",
      body: `Purple is the color of people who live between worlds — who dream vividly, feel deeply, and see things others walk right past. Your inner life is rich and real.

Honor it. Not everyone is given that kind of interior world.`
    },
    2: {
      greeting: "A note for you, in Purple",
      body: `You have a wisdom in you that didn't come from books. It came from paying attention — to people, to patterns, to the quiet voice inside you that always seems to know.

Trust that voice a little more today.`
    },
    3: {
      greeting: "A note for you, in Purple",
      body: `Purple has always been the color of the ones who imagine things before they exist — the dreamers, the visionaries, the quiet revolutionaries.

Whatever you're creating, imagining, or becoming right now — it matters. Keep making it real.`
    },
    4: {
      greeting: "A note for you, in Purple",
      body: `There's something sacred about sensitivity. About being the person in the room who feels the shift in energy, who notices what goes unsaid, who carries meaning in everything.

Purple people are rare. You are rare.`
    },
    5: {
      greeting: "A note for you, in Purple",
      body: `Your intuition is not a small thing. It is a compass that has been quietly calibrating your whole life. When the world is noisy and confusing, you have the ability to go inward and find something true.

That is your greatest strength.`
    }
  }
};

const history = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewport);
  }

  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      body {
        padding: 8px !important;
        margin: 0 !important;
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      
      .envelope-row {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        margin-bottom: 16px !important;
      }
      
      .envelope-preset {
        flex: 1 !important;
        min-height: 56px !important;
        padding: 12px !important;
        font-size: 16px !important;
        border-radius: 12px !important;
        margin: 0 !important;
        min-width: 0 !important;
        touch-action: manipulation !important;
      }
      
      #resultArea {
        margin: 24px 0 !important;
        padding: 0 8px !important;
      }
      
      .letter-card {
        padding: 24px 20px !important;
        border-radius: 20px !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      
      .letter-greeting {
        font-size: 20px !important;
        line-height: 1.3 !important;
        margin: 0 0 16px 0 !important;
      }
      
      .letter-body {
        font-size: 16px !important;
        line-height: 1.6 !important;
        margin: 0 0 16px 0 !important;
        hyphens: auto !important;
        word-break: break-word !important;
      }
      
      .letter-sign {
        font-size: 14px !important;
        opacity: 0.8 !important;
        margin: 0 !important;
      }
      
      #historyList {
        padding: 16px !important;
        margin: 24px -8px !important;
        background: rgba(0,0,0,0.03) !important;
        border-radius: 16px !important;
      }
      
      #historyList p {
        margin: 0 0 12px 0 !important;
        font-size: 14px !important;
      }
      
      #historyList ul {
        padding: 0 !important;
        margin: 0 !important;
      }
      
      #historyList li {
        font-size: 14px !important;
        padding: 8px 0 !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
      }
      
      #historyList li:last-child {
        border-bottom: none !important;
      }
      
      * {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
    }
    
    @media (hover: none) and (pointer: coarse) {
      .envelope-preset {
        min-height: 60px !important;
        padding: 16px !important;
      }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.envelope-preset').forEach(envelope => {
    envelope.addEventListener('click', () => {
      const colorGroup = envelope.closest('.envelope-row');
      const color = colorGroup.dataset.color;
      const note = parseInt(envelope.dataset.note);

      const letter = letters[color]?.[note];
      if (!letter) return;

      const resultArea = document.getElementById('resultArea');

      resultArea.style.opacity = '0';
      resultArea.style.transform = 'translateY(16px)';
      resultArea.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      setTimeout(() => {
        resultArea.innerHTML = `
          <div class="letter-card">
            <p class="letter-greeting">${letter.greeting}</p>
            <div class="letter-body-container">
              ${letter.body.split('\n\n').map(paragraph => 
                `<p class="letter-body">${paragraph}</p>`
              ).join('')}
            </div>
            <p class="letter-sign">— with care, Mood Notes ✉️</p>
          </div>
        `;

        resultArea.style.opacity = '1';
        resultArea.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          resultArea.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      }, 200);

      const colorNames = {
        "#0000FF": "Blue",
        "#FF0000": "Red",
        "#00FF00": "Green",
        "#FFFF00": "Yellow",
        "#800080": "Purple"
      };

      history.unshift({
        color: colorNames[color] || color,
        note,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      const historyList = document.getElementById('historyList');
      if (historyList) {
        const historyHTML = history.length ? `
          <p style="margin: 0 0 12px 0; opacity: 0.7; font-size: 14px; font-weight: 500;">Your recent envelopes:</p>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${history.slice(0, 5).map(h => 
              `<li style="margin: 0; padding: 8px 0; opacity: 0.8; font-size: 14px; border-bottom: 1px solid rgba(0,0,0,0.08);">
                ✉️ ${h.color} — Note ${h.note} 
                <span style="opacity: 0.6; font-size: 13px;">${h.time}</span>
              </li>`
            ).join('')}
          </ul>
        ` : '';
        
        historyList.innerHTML = historyHTML;
      }
    });

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
      });
    }
  });
});
