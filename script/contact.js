import gsap from "gsap";
import { initAnimations } from "./anime.js";
import { client } from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import emailjs from '@emailjs/browser';

const builder = imageUrlBuilder(client);
function urlFor(source) { return builder.image(source); }

const EMAILJS_PUBLIC_KEY    = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Tet6K7frJPYMXhM45';
const EMAILJS_SERVICE_ID    = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_93ba2as';
const CONTACT_TEMPLATE_ID   = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_l8njpbp';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

function flickerReveal(element, delay = 0) {
  gsap.set(element, { opacity: 0, scale: 0.98, filter: "brightness(0.7) contrast(1.2)" });
  const tl = gsap.timeline({ delay });
  tl.to(element, { duration: 0.05, opacity: 0.3 })
    .to(element, { duration: 0.08, opacity: 0 })
    .to(element, { duration: 0.03, opacity: 0.6 })
    .to(element, { duration: 0.06, opacity: 0.1 })
    .to(element, { duration: 0.04, opacity: 0.8 })
    .to(element, { duration: 0.07, opacity: 0 })
    .to(element, { duration: 0.02, opacity: 0.4 })
    .to(element, { duration: 0.05, opacity: 0 })
    .to(element, { duration: 0.03, opacity: 0.9 })
    .to(element, { duration: 0.04, opacity: 0.2 })
    .to(element, { duration: 0.3, opacity: 1, scale: 1, filter: "brightness(1) contrast(1)", ease: "power2.out" });
  return tl;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadContactData();
  initAnimations();

  const contactGif = document.querySelector(".contact-gif");
  if (contactGif) flickerReveal(contactGif, 1);

  initContactForm();
});

async function loadContactData() {
  try {
    const data = await client.fetch(`*[_type == "contactPage"][0]`);
    if (!data) return;
    const header = document.querySelector('.contact-header-title h2');
    if (header && data.headerTitle) header.textContent = data.headerTitle;
    const gifImg = document.querySelector('.contact-gif img');
    if (gifImg && data.contactGif) gifImg.src = urlFor(data.contactGif).url();
  } catch (e) {
    console.error('Error loading contact data:', e);
  }
}

function initContactForm() {
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('cf-submit');
  const status = document.getElementById('cf-status');
  if (!form) return;

  // Inject invisible honeypot field — bots fill it, humans don't
  const hp = document.createElement('input');
  hp.type = 'text';
  hp.name = 'website';
  hp.setAttribute('tabindex', '-1');
  hp.setAttribute('autocomplete', 'off');
  hp.setAttribute('aria-hidden', 'true');
  hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
  form.appendChild(hp);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: silently discard if a bot filled the hidden field
    if (hp.value) return;

    const name    = form.sender_name.value.trim();
    const email   = form.sender_email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus(status, 'Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus(status, 'Enter a valid email address.', 'error');
      return;
    }

    submit.disabled = true;
    setStatus(status, 'Sending…', '');

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, CONTACT_TEMPLATE_ID, {
        sender_name:  name,
        sender_email: email,
        message:      message,
        sent_from:    window.location.href,
      });
      form.reset();
      setStatus(status, "✓ Message sent — I'll be in touch soon.", 'success');
    } catch (err) {
      console.error('EmailJS contact error:', err);
      setStatus(status, 'Failed to send — try emailing directly.', 'error');
    } finally {
      submit.disabled = false;
    }
  });
}

function setStatus(el, message, type) {
  el.textContent = message; // textContent — XSS-safe
  el.className = `mono contact-form-status${type ? ' ' + type : ''}`;
}
