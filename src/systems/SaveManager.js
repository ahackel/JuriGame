const SAVE_KEY = 'jurigame-save-v1';

export class SaveManager {
  static save(state) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Speichern fehlgeschlagen', e);
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Laden fehlgeschlagen', e);
      return null;
    }
  }

  static clear() {
    localStorage.removeItem(SAVE_KEY);
  }
}
