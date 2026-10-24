'use strict';
async function submitInquiry(payload, request = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await request('https://formsubmit.co/ajax/veeraboinanagoor@gmail.com', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal
    });
    if (!response.ok) throw new Error('The message service could not accept your submission.');
    const data = await response.json();
    const message = typeof data.message === 'string' ? data.message : '';
    if (/activat|confirm.*email|verify.*email/i.test(message)) return { state: 'activation', message: 'This form needs one-time email confirmation before delivery can be relied on. Your message has not been confirmed as sent. Please use the email link if you need to reach me now.' };
    if (data.success !== true && data.success !== 'true') throw new Error('The message service did not confirm your submission.');
    return { state: 'success', message: 'Your message was submitted successfully. Thanks for getting in touch!' };
  } finally { clearTimeout(timer); }
}
if (typeof module !== 'undefined') module.exports = { submitInquiry };
if (typeof document !== 'undefined') {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const label = document.querySelector('#send-label');
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    if (values._honey) return;
    for (const key of ['name', 'email', 'message']) values[key] = (values[key] || '').trim();
    if (!values.name || values.message.length < 10) { status.dataset.state = 'error'; status.textContent = 'Please enter your name and a message of at least 10 characters.'; status.focus({ preventScroll: true }); return; }
    values._subject = 'Portfolio inquiry: ' + values.topic;
    values._url = window.location.origin + window.location.pathname;
    submitting = true; submitButton.disabled = true; form.setAttribute('aria-busy', 'true'); label.textContent = 'Sending…';
    status.dataset.state = 'pending'; status.textContent = 'Sending your message…';
    try {
      const result = await submitInquiry(values);
      status.dataset.state = result.state; status.textContent = result.message;
      if (result.state === 'success') form.reset();
    } catch {
      status.dataset.state = 'error'; status.textContent = 'Your message could not be confirmed as sent. Please try again, or use the email link. Your message is still here.';
    } finally {
      submitting = false; submitButton.disabled = false; form.removeAttribute('aria-busy'); label.textContent = 'Send message'; status.focus({ preventScroll: true });
    }
  });
}
