## 🔍 Pub/Sub 패턴이란?

Pub/Sub 패턴은 **이벤트 기반 아키텍처**에서 사용되는 디자인 패턴으로, **발행자(Publisher)** 와 **구독자(Subscriber)** 가 직접적으로 연결되지 않고 **중앙 관리자(Manager)** 를 통해 서로 소통하는 방식입니다.

### 🛠 주요 개념

1. **Publisher (발행자)**: 이벤트를 발생시키는 주체
2. **Subscriber (구독자)**: 특정 이벤트를 감지하고 동작하는 주체
3. **Manager (중앙 관리자)**: 이벤트를 관리하고, 발행된 이벤트를 구독자들에게 전달하는 역할

이 패턴을 사용하면 **발행자와 구독자가 직접 의존하지 않아** 결합도를 낮출 수 있습니다. 즉, **확장성과 유지보수성이 좋아지는 효과**를 얻을 수 있습니다.

---

## 🏗 Pub/Sub 패턴 적용하기

아래는 **Pub/Sub 패턴을 적용한 `SubscriptionManager` 클래스** 입니다. 이 클래스는 **싱글턴 패턴**을 적용하여 전역적으로 하나의 이벤트 관리자로 동작하도록 구현되었습니다.

```typescript
export class SubscriptionManager {
  listeners: { [key: string]: Listener[] } = {};
  private static instance: SubscriptionManager;
  private constructor() {}

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  addEvent(event: string) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    return this.listeners[event];
  }

  subscribe(event: string, v: Listener): void {
    this.listeners[event].push(v);
  }

  unsubscribe(event: string, name: string): void {
    this.listeners[event] = this.listeners[event].filter(
      (v) => v.name !== name,
    );
  }

  publish(event: string) {
    this.listeners[event]?.forEach((target) => {
      target.publish(event);
    });
  }
}
```

### 🔑 핵심 포인트

1. **싱글턴 패턴 적용**: `getInstance()` 메서드를 통해 하나의 인스턴스만 유지
2. **이벤트 등록 (`addEvent`)**: 중복 방지를 위해 한 번만 생성
3. **구독 (`subscribe`)**: 특정 이벤트를 감지하고 실행할 리스너 추가
4. **구독 해제 (`unsubscribe`)**: 특정 구독자를 제거할 수 있음
5. **이벤트 발행 (`publish`)**: 등록된 모든 리스너 실행

이렇게 구현하면 여러 개의 컴포넌트가 특정 이벤트를 구독하고, 이벤트가 발생하면 한 번에 알림을 받을 수 있습니다. 🎯

---

## 🌍 확장성을 위한 고려 사항

### 🏗 대규모 서비스 운영 시 고려할 점

Pub/Sub 패턴을 단순한 메모리 저장 방식으로 구현하면, **서버가 여러 대로 오토스케일링될 때 데이터가 공유되지 않는 문제**가 발생할 수 있습니다. 이를 해결하기 위해 **외부 저장소**를 활용하는 것이 좋습니다.

### 🛢 외부 저장소 활용 (Redis, MySQL, MongoDB)

Pub/Sub 이벤트 데이터를 **Redis, MySQL, MongoDB 같은 데이터베이스에 저장**하면, 여러 서버에서도 **일관된 이벤트 처리**가 가능합니다. 각 저장소의 특징은 다음과 같습니다:

- **Redis**: 빠른 속도의 인메모리 데이터베이스로 Pub/Sub 기능을 기본적으로 제공. 서버 간 공유가 용이함.
- **MySQL**: 관계형 데이터베이스로 이벤트 로그 저장 및 복잡한 쿼리 수행 가능.
- **MongoDB**: NoSQL 데이터베이스로 대량의 이벤트 데이터를 저장하고 빠르게 조회 가능.

### 🔒 이벤트 네이밍 규칙과 Symbol 활용

이벤트명을 문자열로 지정하면 중복될 위험이 있습니다. 이를 방지하기 위해 **Symbol을 활용하여 고유한 이벤트명을 생성**하는 것이 권장됩니다.

```typescript
const SAVE_COMPLETE = Symbol('saveComplete');
SubscriptionManager.getInstance().subscribe(SAVE_COMPLETE, {
  name: 'menu',
  publish: this.afterComplete.bind(this),
});
```

### 🚀 확장성 있는 서비스 운영

- **오토스케일링** 환경에서는 단순한 메모리 저장 방식이 아닌 Redis 등의 공유 저장소 사용
- **이벤트 네이밍 관리**를 위해 Symbol 사용하여 중복 방지
- **대량의 이벤트 처리**가 필요한 경우 데이터베이스 기반으로 설계

이러한 기법을 적용하면 **더 큰 규모의 서비스에서도 안정적으로 Pub/Sub 패턴을 운영할 수 있습니다**. 🎯
