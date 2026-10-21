const CONFIG = {
  inquiries: { type: 'enquirySubmission', note: 'managerNotes', states: ['new', 'contacted', 'confirmed', 'archived'] },
  applications: { type: 'jobApplication', note: 'hrNotes', states: ['new', 'reviewing', 'interview', 'hired', 'rejected'] },
};

// Called only after the admin session guard. Sanity records and VPS backups are
// merged by ID, with the current cloud record taking precedence.
export async function handleInboxApi(req, res, pathname, { client, files, readJson, writeJson }) {
  const match = /^\/api\/(inquiries|applications)(?:\/(status|delete))?$/.exec(pathname);
  if (!match) return false;
  const [, name, action] = match;
  const config = CONFIG[name];
  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  };
  try {
    const list = readJson(files[name]);
    if (req.method === 'GET' && !action) {
      const records = new Map(list.map(item => [item._id || item.id, item]));
      if (client) {
        const cloud = await client.fetch('*[_type == $type && !(_id in path("drafts.**"))]', { type: config.type });
        for (const item of cloud) records.set(item._id, item);
      }
      send(200, { success: true, [name]: [...records.values()].sort((a, b) => String(b.receivedAt || b.submittedAt || '').localeCompare(String(a.receivedAt || a.submittedAt || ''))) });
      return true;
    }
    if (req.method !== 'POST' || !action) { send(405, { success: false, error: 'This action is not supported.' }); return true; }
    let body = '';
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 100000) throw new Error('The note is too long. Please shorten it and try again.');
    }
    const payload = JSON.parse(body || '{}');
    if (typeof payload.id !== 'string' || !payload.id) { send(400, { success: false, error: 'Select a record first.' }); return true; }
    const local = list.find(item => (item._id || item.id) === payload.id);
    const cloud = client ? await client.getDocument(payload.id) : null;
    if ((cloud && cloud._type !== config.type) || (!local && !cloud)) { send(404, { success: false, error: 'This record no longer exists. Refresh the inbox.' }); return true; }
    if (action === 'delete') {
      if (cloud) await client.delete(payload.id);
      writeJson(files[name], readJson(files[name]).filter(item => (item._id || item.id) !== payload.id));
      send(200, { success: true }); return true;
    }
    const fields = {};
    if (payload.status !== undefined) {
      if (!config.states.includes(payload.status)) { send(400, { success: false, error: 'Choose a valid status.' }); return true; }
      fields.status = payload.status;
    }
    if (payload[config.note] !== undefined) {
      if (typeof payload[config.note] !== 'string') { send(400, { success: false, error: 'Enter a text note.' }); return true; }
      fields[config.note] = payload[config.note];
    }
    const saved = cloud ? await client.patch(payload.id).set(fields).commit({ visibility: 'sync' }) : { ...local, ...fields };
    writeJson(files[name], [saved, ...readJson(files[name]).filter(item => (item._id || item.id) !== payload.id)]);
    send(200, { success: true, item: saved });
  } catch {
    send(503, { success: false, error: 'The inbox could not be updated. Please check your connection and try again.' });
  }
  return true;
}
