type EventListener = (event: string, payload: any) => void;

export class EventEmitter {
  private listeners: { [event: string]: EventListener[] } = {};

  emit(event: string, payload: any): void {
    const eventListeners = this.listeners[event] || [];
    for (const listener of eventListeners) {
      listener(event, payload);
    }
  }

  on(event: string, listener: EventListener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }
}
