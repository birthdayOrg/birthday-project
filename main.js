// ══════════════════════════════════════
//  Sara's Birthday — main.js
//  Heart catch minigame
// ══════════════════════════════════════

(function () {
  const TOTAL_HEARTS = 30;
  const REWARDS = [5, 15, 30];

  // Milestone heart emojis for variety
  const HEART_EMOJIS = ['❤️', '🩷', '💕', '💗', '💖', '💝', '💓', '💘'];

  const arena       = document.getElementById('game-arena');
  const basket      = document.getElementById('basket');
  const scoreEl     = document.getElementById('score');
  const progressEl  = document.getElementById('progress-fill');
  const startOverlay = document.getElementById('start-overlay');
  const startBtn    = document.getElementById('start-btn');

  let score = 0;
  let gameActive = false;
  let spawnInterval = null;
  let unlockedRewards = new Set();
  let basketX = arena ? arena.offsetWidth / 2 : 200;
  let animFrameId = null;

  // ── Init ──────────────────────────────
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  // ── Basket movement ───────────────────
  // Mouse
  document.addEventListener('mousemove', (e) => {
    if (!gameActive || !arena) return;
    const rect = arena.getBoundingClientRect();
    basketX = e.clientX - rect.left;
    clampBasket();
  });

  // Touch
  arena && arena.addEventListener('touchmove', (e) => {
    if (!gameActive) return;
    e.preventDefault();
    const rect = arena.getBoundingClientRect();
    basketX = e.touches[0].clientX - rect.left;
    clampBasket();
  }, { passive: false });

  function clampBasket() {
    const halfW = 24;
    basketX = Math.max(halfW, Math.min(arena.offsetWidth - halfW, basketX));
    basket.style.left = basketX + 'px';
  }

  // ── Start game ────────────────────────
  function startGame() {
    startOverlay.style.display = 'none';
    gameActive = true;
    score = 0;
    updateScore(0);
    spawnHearts();
    startBtn.textContent = 'Playing... ♥';
  }

  // ── Spawn hearts ──────────────────────
  function spawnHearts() {
    // Start at 1.4s interval, ramp up as score increases
    function getInterval() {
      if (score < 10) return 1400;
      if (score < 20) return 1000;
      return 700;
    }

    function spawn() {
      if (!gameActive) return;
      spawnSingleHeart();
      spawnInterval = setTimeout(spawn, getInterval());
    }

    spawn();
  }

  function spawnSingleHeart() {
    if (!arena) return;
    const heart = document.createElement('div');
    heart.className = 'heart-item';
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    const arenaW = arena.offsetWidth;
    const x = 30 + Math.random() * (arenaW - 60);
    const duration = 3000 + Math.random() * 2000; // 3-5s to fall

    heart.style.left = x + 'px';
    heart.style.top = '-40px';

    // Click to catch
    heart.addEventListener('click', () => catchHeart(heart, x, -30));
    heart.addEventListener('touchstart', (e) => {
      e.preventDefault();
      catchHeart(heart, x, -30);
    }, { passive: false });

    arena.appendChild(heart);
    animateHeart(heart, x, duration);
  }

  function animateHeart(heart, x, duration) {
    const startTime = performance.now();
    const arenaH = arena.offsetHeight;
    const startY = -40;
    const endY   = arenaH + 10;
    const range  = endY - startY;

    function frame(now) {
      if (!arena.contains(heart)) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const y = startY + range * progress;

      heart.style.top = y + 'px';

      // Check basket collision
      if (gameActive && checkBasketCollision(heart, x, y)) {
        catchHeart(heart, x, y);
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        heart.remove(); // missed
      }
    }

    requestAnimationFrame(frame);
  }

  function checkBasketCollision(heart, heartX, heartY) {
    const arenaH = arena.offsetHeight;
    const basketY = arenaH - 16 - 44; // bottom offset + emoji half-height
    const catchZone = 60; // px wide catch zone around basket center
    const vertZone  = 50;

    return (
      Math.abs(heartX - basketX) < catchZone &&
      Math.abs(heartY - basketY) < vertZone
    );
  }

  function catchHeart(heart, x, y) {
    if (!arena.contains(heart)) return;
    heart.remove();

    if (score >= TOTAL_HEARTS) return;
    updateScore(score + 1);
    showCatchEffect(x, y);
    checkMilestones();

    if (score >= TOTAL_HEARTS) {
      endGame();
    }
  }

  // ── Score & progress ──────────────────
  function updateScore(n) {
    score = n;
    scoreEl.textContent = score;
    const pct = Math.min((score / TOTAL_HEARTS) * 100, 100);
    progressEl.style.width = pct + '%';
  }

  // ── Milestones ────────────────────────
  function checkMilestones() {
    REWARDS.forEach(threshold => {
      if (score >= threshold && !unlockedRewards.has(threshold)) {
        unlockedRewards.add(threshold);
        unlockReward(threshold);
      }
    });
  }

  function unlockReward(threshold) {
    // Highlight reward pill
    const pillId = `reward-${threshold}`;
    const pill = document.getElementById(pillId);
    if (pill) pill.classList.add('unlocked');

    // Show panel
    const panelId = `panel-${threshold}`;
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.remove('hidden');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // ── Visual catch effect ───────────────
  function showCatchEffect(x, y) {
    const flash = document.createElement('div');
    flash.className = 'catch-flash';
    flash.textContent = '+1 ❤️';
    flash.style.left = (x - 20) + 'px';
    flash.style.top  = Math.max(0, y - 10) + 'px';
    arena.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());
  }

  // ── End game ──────────────────────────
  function endGame() {
    gameActive = false;
    clearTimeout(spawnInterval);

    // Remove remaining hearts
    arena.querySelectorAll('.heart-item').forEach(h => h.remove());

    // Show winner overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-start-overlay';
    overlay.innerHTML = `
      <div style="text-align:center; padding: 1.5rem;">
        <div style="font-size:3rem">🎉</div>
        <p style="font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:900; color:#3a1a24; margin:0.5rem 0">You caught all 30!</p>
        <p style="color:#7a4a58; font-style:italic; font-size:0.95rem">Scroll down to claim your Golden Ticket ✨</p>
      </div>`;
    arena.appendChild(overlay);
  }

})();
