'use strict';

// A successful transport is not necessarily a successful form submission.
// Keep the message on errors, activation requests, and ambiguous responses.
async function submitInquiry(payload, request = fetch, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await request('https://formsubmit.co/ajax/veeraboinanagoor@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('The message service could not accept your submission.');
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid response from the message service.');
    const message = typeof data.message === 'string' ? data.message : '';
    if (/activat|confirm.*email|verify.*email/i.test(message)) {
      return { state: 'activation', message: 'This contact form is awaiting email confirmation. Your message has not been confirmed as sent. Please use the email link to reach me.' };
    }
    if (data.success !== true && data.success !== 'true') {
      throw new Error('The message service did not confirm your submission.');
    }
    return { state: 'success', message: 'Your message was submitted successfully. Thanks for getting in touch!' };
  } finally {
    clearTimeout(timer);
  }
}

if (typeof module !== 'undefined') module.exports = { submitInquiry };

if (typeof document !== 'undefined' && document.querySelector('#contact-form')) {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const label = document.querySelector('#send-label');
  const messageField = document.querySelector('#contact-message');
  const messageCount = document.querySelector('#message-count');
  let submitting = false;
  const controls = [...form.querySelectorAll('input, select, textarea, button')];
  const updateCount = () => { messageCount.textContent = `${messageField.value.length} / 5000`; };
  messageField.addEventListener('input', updateCount);
  form.addEventListener('input', () => {
    if (!submitting && status.dataset.state === 'success') {
      status.textContent = '';
      delete status.dataset.state;
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    if (values._honey) return;
    for (const key of ['name', 'email', 'message']) values[key] = values[key].trim();
    if (values.name.length < 2 || values.message.length < 10) {
      status.dataset.state = 'error';
      status.textContent = 'Please enter a name of at least 2 characters and a message of at least 10 characters.';
      (values.name.length < 2 ? document.querySelector('#contact-name') : messageField).focus();
      return;
    }
    values._subject = 'Portfolio inquiry: ' + values.topic;
    values._url = window.location.origin + window.location.pathname;
    submitting = true;
    controls.forEach(control => { control.disabled = true; });
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Sending…';
    status.dataset.state = 'pending';
    status.textContent = 'Sending your message…';
    try {
      const result = await submitInquiry(values);
      status.dataset.state = result.state;
      status.textContent = result.message;
      if (result.state === 'success') { form.reset(); updateCount(); }
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Your message could not be confirmed as sent. Please try again, or use the email link. Your message is still here.';
    } finally {
      submitting = false;
      controls.forEach(control => { control.disabled = false; });
      form.removeAttribute('aria-busy');
      label.textContent = 'Send message';
      status.focus();
    }
  });
}
