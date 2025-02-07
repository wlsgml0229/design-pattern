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

//싱글턴 패턴이면 좋다.
//내용이 많아질거기 때문에, redis나 mysql, mongodb 같은곳에 맡길수도 있다.
//addEvent는 그럼 해당 내용이 될 것임
// 서버 - 오토스케일링을 많이 한다.
//코드상 메모리에 저장하도록 해놓으면 서버들간 공유가 안됨 redis
// 더큰 규모의 서비스 운영하기에 편리하다
//이벤트명이 겹칮지않게 주의해주고 symbol로 사용하는걸 권장된다.

export class SubscriptionManager {
  listeners: {
    [key: string]: Listener[];
  } = {};
  private static instance: SubscriptionManager;
  private constructor() {}

  addEvent(event: string) {
    if (this.listeners[event]) {
      return this.listeners[event];
    }
    this.listeners[event] = [];
    return this.listeners[event];
  }

  subscribe(event: string, v: Listener): void {
    this.listeners[event].push(v);
  }
  unsubscripbe(event: string, name: string): void {
    this.listeners[event] = this.listeners[event].filter(
      (v) => v.name !== name,
    );
  }

  publish(event: string) {
    this.listeners[event].forEach((target) => {
      target.publish(event);
    });
  }
}

//메뉴
// SubscriptionManager.getInstance().subscribe('saveComplete', {
//   name: 'men]u',
//   publish: this.afterComplete.bind(this),
// });

//그림판
// SubscriptionManager.getInstance().publish('saveComplete');
