const { test } = require('node:test');
const assert = require('node:assert/strict');
const { submitInquiry } = require('../contact.js');

const payload = { name: 'Form test', email: 'test@example.com', message: 'Local verification only.' };
const reply = data => async () => ({ ok: true, json: async () => data });

test('submits JSON to the configured address without credentials', async () => {
  let sent;
  const request = async (url, options) => {
    sent = { url, options };
    return { ok: true, json: async () => ({ success: 'true', message: 'Form submitted successfully' }) };
  };
  const result = await submitInquiry(payload, request);
  assert.equal(result.state, 'success');
  assert.equal(sent.url, 'https://formsubmit.co/ajax/veeraboinanagoor@gmail.com');
  assert.equal(sent.options.method, 'POST');
  assert.equal(sent.options.credentials, 'omit');
  assert.deepEqual(JSON.parse(sent.options.body), payload);
});

test('accepts a boolean service confirmation', async () => {
  assert.equal((await submitInquiry(payload, reply({ success: true }))).state, 'success');
});

test('activation never appears as successful delivery, even with a success flag', async () => {
  const result = await submitInquiry(payload, reply({ success: true, message: 'Please activate this form by confirming your email.' }));
  assert.equal(result.state, 'activation');
});

test('rejects unconfirmed, malformed, and unsuccessful responses', async () => {
  for (const data of [{ success: false }, { success: 'false' }, {}, null]) {
    await assert.rejects(submitInquiry(payload, reply(data)));
  }
  await assert.rejects(submitInquiry(payload, async () => ({ ok: false })));
  await assert.rejects(submitInquiry(payload, async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } })));
});

test('network errors propagate so the UI can retain the draft', async () => {
  await assert.rejects(submitInquiry(payload, async () => { throw new TypeError('Offline'); }));
});

test('a stalled request is aborted instead of leaving the form stuck', async () => {
  let aborted = false;
  const request = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => { aborted = true; reject(new Error('Timed out')); });
  });
  await assert.rejects(submitInquiry(payload, request, 5));
  assert.equal(aborted, true);
});
