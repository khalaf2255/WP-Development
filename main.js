/* ==========================================================================
   WordPress Plugin Development Course - Core Interactive JS (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCodeCopyButtons();
  initScrollPreservation();
});

/**
  * Automatically finds all VS Code code blocks (.vscode-window)
  * and attaches an interactive Copy Button ("📋 نسخ الكود") with visual feedback.
  */
function initCodeCopyButtons() {
  const codeWindows = document.querySelectorAll('.vscode-window');

  codeWindows.forEach(win => {
    const header = win.querySelector('.vscode-header');
    const codeEl = win.querySelector('pre code');
    if (!header || !codeEl) return;

    // Prevent adding duplicate buttons if initialized multiple times
    if (header.querySelector('.copy-code-btn')) return;

    // Create Copy Button
    const btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'نسخ الكود البرمجي');
    btn.innerHTML = '📋 <span>نسخ الكود</span>';

    btn.addEventListener('click', () => {
      const textToCopy = codeEl.innerText || codeEl.textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '✅ <span>تم النسخ!</span>';
        
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '📋 <span>نسخ الكود</span>';
        }, 2000);
      }).catch(err => {
        // Fallback for older browsers or restricted contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          btn.classList.add('copied');
          btn.innerHTML = '✅ <span>تم النسخ!</span>';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '📋 <span>نسخ الكود</span>';
          }, 2000);
        } catch (e) {
          console.error('Copy failed', e);
        }
        document.body.removeChild(textarea);
      });
    });

    header.appendChild(btn);
  });
}

/**
  * Saves and restores the exact scroll position of each lesson page
  * so refreshing returns the user to the exact reading spot.
  */
function initScrollPreservation() {
  const pageKey = 'wp_course_scroll_' + window.location.pathname;

  // Restore scroll position on load
  const savedScroll = localStorage.getItem(pageKey);
  if (savedScroll !== null) {
    const scrollY = parseInt(savedScroll, 10);
    if (!isNaN(scrollY) && scrollY > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, 50);
    }
  }

  // Save scroll position while scrolling (debounced)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      localStorage.setItem(pageKey, window.scrollY);
    }, 100);
  }, { passive: true });
}
