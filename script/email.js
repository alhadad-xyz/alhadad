import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Tet6K7frJPYMXhM45';
const EMAILJS_SERVICE_ID      = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_93ba2as';
const EMAILJS_TEMPLATE_ID     = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID || 'template_9912arc';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/**
 * Initialise all footer email subscription forms on the page.
 */
export function initEmailForms() {
  const forms = document.querySelectorAll('.footer-email-row');
  forms.forEach(form => setupForm(form));
}

function setupForm(form) {
  const input  = form.querySelector('input');
  const button = form.querySelector('button');
  if (!input || !button) return;

  async function submit() {
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      showFeedback(form, 'Enter a valid email ↗', 'error');
      return;
    }

    // Honeypot check (set by initEmailForms if bot filled the hidden field)
    const honeypot = form.querySelector('.hp-field');
    if (honeypot && honeypot.value) return; // silently discard bot submission

    button.disabled = true;
    input.disabled  = true;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        subscriber_email: email,
        to_name: 'Alhadad',
        sent_from: window.location.href,
      });
      input.value = '';
      showFeedback(form, "You're in ✓", 'success');
    } catch (err) {
      console.error('EmailJS error:', err);
      showFeedback(form, 'Failed – try again', 'error');
    } finally {
      button.disabled = false;
      input.disabled  = false;
    }
  }

  // Inject hidden honeypot field (invisible to humans, bots fill it)
  if (!form.querySelector('.hp-field')) {
    const hp = document.createElement('input');
    hp.type      = 'text';
    hp.name      = 'website'; // enticing field name for bots
    hp.className = 'hp-field';
    hp.setAttribute('tabindex', '-1');
    hp.setAttribute('autocomplete', 'off');
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
    form.appendChild(hp);
  }

  button.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFeedback(form, message, type) {
  const existing = form.parentElement.querySelector('.email-feedback');
  if (existing) existing.remove();

  const p = document.createElement('p');
  p.className = 'email-feedback mono';
  p.textContent = message; // textContent — no XSS risk
  p.style.cssText = `
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: ${type === 'success' ? 'var(--base-300)' : '#e44'};
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  form.parentElement.appendChild(p);

  requestAnimationFrame(() => { p.style.opacity = '1'; });
  setTimeout(() => {
    p.style.opacity = '0';
    setTimeout(() => p.remove(), 300);
  }, 4000);
}
