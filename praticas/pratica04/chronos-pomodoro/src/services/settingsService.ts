const API_URL = 'http://localhost:3333';

export type SettingsPayload = {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
};

export const settingsService = {
  async get(): Promise<SettingsPayload> {
    const response = await fetch(`${API_URL}/settings`);
    return response.json();
  },

  async save(payload: SettingsPayload): Promise<SettingsPayload> {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },
};