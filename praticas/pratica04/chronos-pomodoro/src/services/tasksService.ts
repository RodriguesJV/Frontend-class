const API_URL = 'http://localhost:3333';

export type TaskPayload = {
  id: string;
  name: string;
  duration: number;
  type: string;
  startDate: number;
};

export const tasksService = {
  async getAll() {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
  },

  async create(task: TaskPayload) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return response.json();
  },

  async complete(id: string) {
    const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
    });
    return response.json();
  },

  async interrupt(id: string) {
    const response = await fetch(`${API_URL}/tasks/${id}/interrupt`, {
      method: 'PATCH',
    });
    return response.json();
  },

  async deleteAll() { 
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'DELETE',
    });
    return response.json();
  },
};