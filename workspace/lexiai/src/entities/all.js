// Simple localStorage-backed repository utilities
function readStore(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function sortBy(items, field, direction = 'asc') {
  const factor = direction === 'desc' ? -1 : 1
  return [...items].sort((a, b) => {
    const va = a[field]; const vb = b[field]
    if (va == null && vb == null) return 0
    if (va == null) return 1
    if (vb == null) return -1
    return va > vb ? factor : va < vb ? -factor : 0
  })
}

function applyOrder(items, order) {
  if (!order) return items
  const desc = order.startsWith('-')
  const field = desc ? order.slice(1) : order
  return sortBy(items, field, desc ? 'desc' : 'asc')
}

class BaseEntityRepo {
  constructor(key) { this.key = key }
  list(order) { return applyOrder(readStore(this.key), order) }
  filter(where = {}, order) {
    const items = readStore(this.key).filter(item => Object.entries(where).every(([k, v]) => item[k] === v))
    return applyOrder(items, order)
  }
  get(id) { return readStore(this.key).find(i => i.id === id) || null }
  async create(data) {
    const now = new Date().toISOString()
    const item = { id: generateId(), created_date: now, ...data }
    const items = readStore(this.key)
    items.push(item)
    writeStore(this.key, items)
    return item
  }
  async update(id, patch) {
    const items = readStore(this.key)
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) throw new Error('Not found')
    items[idx] = { ...items[idx], ...patch }
    writeStore(this.key, items)
    return items[idx]
  }
  async delete(id) {
    const items = readStore(this.key)
    writeStore(this.key, items.filter(i => i.id !== id))
    return true
  }
}

export class LegalCase extends BaseEntityRepo {
  constructor() { super('legal_cases') }
  static list(order) { return new LegalCase().list(order) }
  static filter(where, order) { return new LegalCase().filter(where, order) }
  static get(id) { return new LegalCase().get(id) }
  static create(data) { return new LegalCase().create(data) }
  static update(id, patch) { return new LegalCase().update(id, patch) }
  static delete(id) { return new LegalCase().delete(id) }
  static schema() {
    return {
      name: 'LegalCase',
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Name or title of the legal case' },
        description: { type: 'string', description: 'Detailed description of the case' },
        case_type: {
          type: 'string',
          enum: [
            'personal_injury', 'contract_dispute', 'family_law', 'criminal_defense',
            'employment', 'real_estate', 'corporate', 'intellectual_property', 'immigration', 'other'
          ],
          description: 'Type of legal case'
        },
        jurisdiction: { type: 'string', description: 'State or jurisdiction for the case' },
        status: { type: 'string', enum: ['active','research','drafting','filing','completed','closed'], default: 'active', description: 'Current status of the case' },
        priority: { type: 'string', enum: ['low','medium','high','urgent'], default: 'medium', description: 'Priority level of the case' },
        deadline: { type: 'string', format: 'date', description: 'Important deadline for the case' },
      },
      required: ['title', 'case_type']
    }
  }
}

export class Document extends BaseEntityRepo {
  constructor() { super('documents') }
  static list(order) { return new Document().list(order) }
  static filter(where, order) { return new Document().filter(where, order) }
  static get(id) { return new Document().get(id) }
  static create(data) { return new Document().create(data) }
  static update(id, patch) { return new Document().update(id, patch) }
  static delete(id) { return new Document().delete(id) }
}

export class ChatMessage extends BaseEntityRepo {
  constructor() { super('chat_messages') }
  static list(order) { return new ChatMessage().list(order) }
  static filter(where, order) { return new ChatMessage().filter(where, order) }
  static get(id) { return new ChatMessage().get(id) }
  static create(data) { return new ChatMessage().create(data) }
  static update(id, patch) { return new ChatMessage().update(id, patch) }
  static delete(id) { return new ChatMessage().delete(id) }
}