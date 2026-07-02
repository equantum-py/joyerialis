async function getErrorMessage(res, fallbackMessage) {
  try {
    const body = await res.json();
    return body?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export const settingService = {
  async getSettings() {
    const res = await fetch('/api/admin-v2/settings');
    if (!res.ok) throw new Error(await getErrorMessage(res, 'Error al obtener configuraciones'));
    return await res.json();
  },

  async updateSettings(data) {
    const res = await fetch('/api/admin-v2/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, 'Error al actualizar configuraciones'));
    return await res.json();
  }
};
