// In-memory store for conversation history per user
// Shape: Map<userId, { history: [{role, parts}], updatedAt: Date }>

const store = new Map();
const MAX_HISTORY = 20;

class ConversationModel {
  static get(userId) {
    return store.get(String(userId))?.history || [];
  }

  static push(userId, role, text) {
    const id = String(userId);
    const entry = store.get(id) || { history: [], updatedAt: null };
    entry.history.push({ role, parts: [{ text }] });
    if (entry.history.length > MAX_HISTORY) {
      entry.history.splice(0, entry.history.length - MAX_HISTORY);
    }
    entry.updatedAt = new Date();
    store.set(id, entry);
  }

  static clear(userId) {
    store.delete(String(userId));
  }

  static getAll() {
    return [...store.entries()].map(([id, val]) => ({
      userId: id,
      messageCount: val.history.length,
      updatedAt: val.updatedAt,
    }));
  }
}

// Cleanup stale sessions (older than 2 hours) every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, val] of store.entries()) {
    if (val.updatedAt && val.updatedAt.getTime() < cutoff) {
      store.delete(id);
    }
  }
}, 30 * 60 * 1000);

module.exports = ConversationModel;
