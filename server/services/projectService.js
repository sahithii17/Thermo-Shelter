import { randomUUID } from "node:crypto";
const projects = new Map();
export function saveProject(project) { const id = randomUUID(); const record = { ...project, id, createdAt: new Date().toISOString() }; projects.set(id, record); return record; }
export function getProject(id) { return projects.get(id) || null; }
