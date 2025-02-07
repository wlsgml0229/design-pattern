# 📢 옵저버 패턴(Observer Pattern) in TypeScript

## 🔍 옵저버 패턴이란?

옵저버 패턴(Observer Pattern)은 **발행(Subject)** 과 **구독(Observer)** 개념을 기반으로 하는 디자인 패턴입니다. 특정 객체의 상태가 변경될 때, 그 변화를 구독한 다른 객체들에게 자동으로 알리는 방식으로 동작합니다.

이 패턴은 **느슨한 결합(Loose Coupling)** 을 유지하면서 객체 간의 관계를 효율적으로 관리할 수 있도록 도와줍니다.

### 🤔 느슨한 결합이란?

느슨한 결합(Loose Coupling)이란, 객체 간의 의존도를 최소화하여 변경이 일어나도 다른 객체에 미치는 영향을 줄이는 설계를 의미합니다.

옵저버 패턴에서는 **발행자(Subject)** 가 **구독자(Observer)** 에 대한 직접적인 참조를 가지지 않고, 특정 인터페이스를 통해서만 상호작용합니다. 이 덕분에 구독자들이 동적으로 추가되거나 제거될 수 있으며, 발행자의 변경이 전체 시스템에 미치는 영향을 최소화할 수 있습니다.

---

## 💡 언제 사용할까?

실무에서 옵저버 패턴을 사용하는 대표적인 경우는 다음과 같습니다.

1. **이벤트 기반 시스템** - UI 이벤트 리스너 (버튼 클릭, 입력 감지 등)
2. **상태 변화 감지** - Redux, Vuex 같은 상태 관리 라이브러리
3. **알림 시스템** - 이메일, 푸시 알림, 웹소켓 기반 실시간 알림
4. **MVC 패턴의 View 업데이트** - Model이 변경될 때 View를 자동으로 업데이트

### 🛠 Vuex와 옵저버 패턴

Vuex와 같은 상태 관리 라이브러리는 옵저버 패턴을 기반으로 동작합니다.

- **Store(발행자)**: 상태(State)를 관리하고 변화가 있을 때 알림을 보냅니다.
- **Component(구독자)**: Store의 상태를 구독하고, 상태가 변경되면 자동으로 UI를 업데이트합니다.

예를 들어, Vuex의 `subscribe` 메서드는 상태 변화를 감지하고, 등록된 콜백 함수를 실행하는 옵저버 패턴의 대표적인 예입니다.

```javascript
store.subscribe((mutation, state) => {
  console.log('상태 변경 감지!', mutation.type, state);
});
```

---

## 🔨 옵저버 패턴 TypeScript 구현

```typescript
// 발행자 (Subject)
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
```

📌 현재 코드의 문제점
saveCompleteObserver가 존재해야만 subscribe를 할 수 있으므로, 특정 객체(grimpan)와 직접적으로 결합되어 있습니다.
subscribe 시 this.afterSaveComplete.bind(this)를 넘겨주어 afterSaveComplete 메서드가 특정 동작을 수행하도록 강제되고 있습니다.
더 느슨한 결합을 위해 pub/sub패턴을 사용 할 수 있습니다.

---

### 1️⃣ 기본 옵저버 패턴 구현

```typescript
// 발행자 (Subject)
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

// 구독자 (Observer)
class ConcreteObserver implements Observer {
  constructor(private name: string) {}

  update(data: any): void {
    console.log(`${this.name} received update:`, data);
  }
}

// 사용 예시
const subject = new Subject();
const observer1 = new ConcreteObserver('Observer 1');
const observer2 = new ConcreteObserver('Observer 2');

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notifyObservers('데이터가 변경되었습니다!');
```

✅ 위 코드에서 `Subject` 는 상태가 변경될 때 `Observer` 들에게 자동으로 알림을 보내는 역할을 합니다.

---

## 🏠 실생활 속 옵저버 패턴 예제

### 📩 뉴스레터 시스템

일상생활에서 옵저버 패턴을 쉽게 찾을 수 있는 예로 **뉴스레터 구독 시스템** 이 있습니다. 사용자가 뉴스레터를 구독하면, 새로운 뉴스가 발행될 때마다 자동으로 이메일을 받을 수 있습니다.

```typescript
class Newsletter {
  private subscribers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.subscribers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== observer);
  }

  sendNewsletter(content: string): void {
    this.subscribers.forEach((subscriber) => subscriber.update(content));
  }
}

class User implements Observer {
  constructor(private email: string) {}

  update(content: string): void {
    console.log(`📧 ${this.email} 님께 뉴스레터 발송: ${content}`);
  }
}

// 뉴스레터 시스템 생성
const newsletter = new Newsletter();

// 사용자 구독
const user1 = new User('user1@example.com');
const user2 = new User('user2@example.com');
newsletter.subscribe(user1);
newsletter.subscribe(user2);

// 뉴스레터 발송
newsletter.sendNewsletter('이번 주 새로운 소식! 📢');
```

✅ `Newsletter` 객체가 뉴스레터를 발행하면, 구독한 모든 `User` 들에게 자동으로 알림이 전송됩니다.

### 📊 뉴스레터 시스템의 구조

```plaintext
    Newsletter (Subject)
         │
 ┌───────┴────────┐
 │                │
User1 (Observer)  User2 (Observer)
```

- `Newsletter` 는 새로운 뉴스가 있을 때 `notifyObservers` 를 호출하여 구독자들에게 알림을 보냅니다.
- `User` 객체는 구독을 통해 알림을 받을 수 있고, 원할 때 구독을 취소할 수도 있습니다.

---

## 🎯 마무리

옵저버 패턴은 **이벤트 중심 시스템, 상태 관리, 실시간 알림** 등에서 자주 활용됩니다. TypeScript로 직접 구현해보면 동작 원리를 더 쉽게 이해할 수 있습니다.

실무에서도 이 패턴을 적절히 활용하면 **객체 간 결합도를 낮추고 유지보수성을 높이는 효과** 를 얻을 수 있습니다. 🚀
