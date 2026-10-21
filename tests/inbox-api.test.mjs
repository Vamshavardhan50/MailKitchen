import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { handleInboxApi } from '../server/inbox-api.mjs';

function fixture({ fail = false } = {}) {
  const records = new Map([['enquiry-1', { _id: 'enquiry-1', _type: 'enquirySubmission', status: 'new', managerNotes: 'Cloud note' }]]);
  let backup = [{ _id: 'enquiry-1', status: 'archived', managerNotes: 'Old backup' }];
  const client = {
    async getDocument(id) { return records.get(id); },
    async fetch() { if (fail) throw new Error('Offline'); return [...records.values()]; },
    patch(id) { return { set(fields) { return { async commit() { if (fail) throw new Error('Offline'); const record = { ...records.get(id), ...fields }; records.set(id, record); return record; } }; } }; },
    async delete(id) { if (fail) throw new Error('Offline'); records.delete(id); },
  };
  const call = async (path, body) => {
    const req = Readable.from(body ? [Buffer.from(JSON.stringify(body))] : []);
    req.method = body ? 'POST' : 'GET';
    let status, result;
    const res = { writeHead(code) { status = code; }, end(json) { result = JSON.parse(json); } };
    await handleInboxApi(req, res, path, { client, files: { inquiries: 'backup' }, readJson: () => structuredClone(backup), writeJson: (_, value) => { backup = value; } });
    return { status, ...result };
  };
  return { call, records, backup: () => backup };
}

test('inbox uses current cloud values instead of stale VPS backups', async () => {
  const f = fixture();
  const response = await f.call('/api/inquiries');
  assert.equal(response.inquiries[0].status, 'new');
  assert.equal(response.inquiries[0].managerNotes, 'Cloud note');
});

test('status and notes save to cloud and backup, including cloud-only records', async () => {
  const f = fixture();
  f.records.set('enquiry-2', { _id: 'enquiry-2', _type: 'enquirySubmission', status: 'new' });
  const response = await f.call('/api/inquiries/status', { id: 'enquiry-2', status: 'contacted', managerNotes: 'Called' });
  assert.equal(response.status, 200);
  assert.equal(f.records.get('enquiry-2').status, 'contacted');
  assert.equal(f.backup()[0].managerNotes, 'Called');
});

test('failed saves and deletes do not falsely succeed or remove local records', async () => {
  const f = fixture({ fail: true });
  assert.equal((await f.call('/api/inquiries/status', { id: 'enquiry-1', status: 'confirmed' })).success, false);
  assert.equal((await f.call('/api/inquiries/delete', { id: 'enquiry-1' })).status, 503);
  assert.equal(f.backup().length, 1);
});

test('inbox refuses invalid statuses and deletes outside its document type', async () => {
  const f = fixture();
  assert.equal((await f.call('/api/inquiries/status', { id: 'enquiry-1', status: 'invalid' })).status, 400);
  f.records.set('homepage', { _id: 'homepage', _type: 'homepage' });
  assert.equal((await f.call('/api/inquiries/delete', { id: 'homepage' })).status, 404);
  assert.ok(f.records.has('homepage'));
});
