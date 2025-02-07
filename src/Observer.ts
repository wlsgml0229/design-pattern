abstract class Observer {
  abstract subscribe(v: Listener): void;
  abstract unsubscribe(name: string): void;
  abstract publish(): void;
}

interface Listener {
  name: string;
  publish(event: string): void;
}

class SaveCompleteObserver extends Observer {
  listeners: Listener[] = []; //메뉴, 히스토리 등 알람 받고싶어하는 거들

  override subscribe(v: Listener): void {
    this.listeners.push(v);
  }

  override unsubscribe(name: string): void {
    this.listeners = this.listeners.filter((v) => v.name !== name);
  }

  override publish() {
    this.listeners.forEach((target) => {
      target.publish('complete');
    });
  }
}
