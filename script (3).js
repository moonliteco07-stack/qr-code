/* ============================================================
   A LITTLE SOMETHING FOR YOU — shared script
   Runs on both index.html and message.html; each section checks
   for the elements it needs before doing anything.
   ============================================================ */

/* ---------------------------------------------------------
   1. FLOATING HEARTS (both pages)
--------------------------------------------------------- */
(function floatingHearts(){
  const container = document.getElementById('heartsContainer');
  if(!container) return;

  const symbols = ['❤️','💗','💕','🥰','💖'];

  function spawnHeart(){
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left = Math.random() * 100;
    const size = 14 + Math.random() * 18;
    const duration = 7 + Math.random() * 6;
    const drift = (Math.random() * 80 - 40) + 'px';

    heart.style.left = left + '%';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';
    heart.style.setProperty('--drift', drift);

    container.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  // gentle, continuous drift of hearts
  for(let i = 0; i < 6; i++){
    setTimeout(spawnHeart, i * 900);
  }
  setInterval(spawnHeart, 1400);
})();


/* ---------------------------------------------------------
   2. QR CODE GENERATOR (index.html only)
--------------------------------------------------------- */
(function qrGenerator(){
  const qrContainer = document.getElementById('qrcode');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const openBtn = document.getElementById('openBtn');
  const urlInput = document.getElementById('targetUrl');

  if(!qrContainer || !generateBtn) return; // not on this page

  let qrInstance = null;

  function resolveUrl(){
    const val = urlInput.value.trim();
    if(val) return val;
    // fallback: use message.html relative to this page (only works
    // for local preview in the SAME browser, not for phone scanning)
    return new URL('message.html', window.location.href).href;
  }

  function generateQR(){
    const url = resolveUrl();

    // clear previous QR
    qrContainer.innerHTML = '';

    qrInstance = new QRCode(qrContainer, {
      text: url,
      width: 190,
      height: 190,
      colorDark: '#2b1638',
      colorLight: '#fbf1ee',
      correctLevel: QRCode.CorrectLevel.H
    });

    if(!urlInput.value.trim()){
      urlInput.placeholder = 'Using local preview link — host online for phone scanning';
    }
  }

  generateBtn.addEventListener('click', generateQR);

  // auto-generate once on load so the card never looks empty
  window.addEventListener('DOMContentLoaded', generateQR);

  downloadBtn.addEventListener('click', () => {
    if(!qrContainer.querySelector('img') && !qrContainer.querySelector('canvas')){
      generateQR();
    }
    setTimeout(() => {
      const img = qrContainer.querySelector('img');
      const canvas = qrContainer.querySelector('canvas');
      const link = document.createElement('a');
      link.download = 'yusraaa-qr-code.png';

      if(img && img.src){
        link.href = img.src;
      } else if(canvas){
        link.href = canvas.toDataURL('image/png');
      } else {
        return;
      }
      link.click();
    }, 150);
  });

  openBtn.addEventListener('click', () => {
    const val = urlInput.value.trim();
    const url = val || new URL('message.html', window.location.href).href;
    window.open(url, '_blank');
  });
})();


/* ---------------------------------------------------------
   3. TYPEWRITER HEADING (message.html only)
--------------------------------------------------------- */
(function typewriterHeading(){
  const el = document.getElementById('typedText');
  if(!el) return;

  const fullText = 'Yusraaa ❤️';
  let i = 0;

  function type(){
    if(i <= fullText.length){
      el.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, 110);
    }
  }
  type();
})();


/* ---------------------------------------------------------
   4. SCROLL REVEAL FOR MESSAGE PARAGRAPHS (message.html only)
--------------------------------------------------------- */
(function messageReveal(){
  const paragraphs = document.querySelectorAll('[data-reveal]');
  const divider = document.getElementById('divider');
  if(!paragraphs.length) return;

  if(divider){
    setTimeout(() => divider.classList.add('visible'), 1400);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if(entry.isIntersecting){
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  paragraphs.forEach((p, index) => {
    // stagger the very first reveal slightly so it feels intentional
    setTimeout(() => observer.observe(p), index === 0 ? 1600 : 0);
  });
})();


/* ---------------------------------------------------------
   5. "YOU'RE SPECIAL" OVERLAY (message.html only)
--------------------------------------------------------- */
(function specialOverlay(){
  const btn = document.getElementById('specialBtn');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('overlayClose');
  if(!btn || !overlay) return;

  btn.addEventListener('click', () => overlay.classList.add('show'));
  closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) overlay.classList.remove('show');
  });
})();
