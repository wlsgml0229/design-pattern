# 🌍 언어 특성을 고려한 싱글톤 패턴 개선

자바스크립트는 기본적으로 모듈 시스템을 활용하면 싱글톤 패턴처럼 동작할 수 있다. 하지만 특정 언어의 특성에 종속되지 않는 방식으로 싱글톤을 구현하면 유지보수성과 확장성이 향상된다. 다양한 환경에서도 일관된 방식으로 싱글톤을 적용할 수 있도록 개선하는 방법을 탐구해 보자.

## 📌 싱글톤 패턴이란?

싱글톤 패턴은 **어떤 클래스의 인스턴스가 오직 하나만 생성되도록 보장하는 디자인 패턴**이다. 특정 객체가 여러 개 생성되면 안 되는 경우(예: 전역 설정 관리, 캐시, 로깅 시스템 등)에 유용하게 사용할 수 있다.

### ✅ 싱글톤의 특징

- 클래스의 인스턴스가 단 하나만 존재함을 보장한다.
- 동일한 인스턴스를 어디서든 접근할 수 있도록 한다.
- 전역 상태를 공유해야 할 때 유용하다.
- 하지만 잘못 사용하면 의존성이 강해져 코드가 복잡해질 수 있다.

---

## 🏗️ Grimpan 클래스 개선하기

아래는 **Grimpan(그림판) 클래스**를 싱글톤 패턴으로 구현한 코드이다.

```typescript
class Grimpan {
  private static instance: Grimpan;

  constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
  }

  initialize() {}
  initializeMenu() {}

  static getInstance(): Grimpan {
    if (!this.instance) {
      this.instance = new Grimpan(document.querySelector('canvas'));
    }
    return this.instance;
  }
}

export default Grimpan;
```

### 🔍 코드 분석

1. **`private static instance: Grimpan;`**
   - 클래스 내부에서 하나의 인스턴스만 관리하도록 한다.
2. \*\*생성자 \*\***`constructor()`**
   - `private`을 설정하면 외부에서 `new Grimpan()`을 직접 호출하는 것을 막을 수 있다.
   - 다만, 현재 예제에서는 `private`이 적용되지 않아 직접 호출이 가능하다.
3. **`static getInstance()`**
   - 클래스의 유일한 인스턴스를 반환한다.
   - 만약 인스턴스가 없으면 `new Grimpan(...)`을 통해 최초 생성한다.
   - 이후 호출 시에는 기존 인스턴스를 반환한다.

---

## 🎯 싱글톤 패턴의 장점과 단점

### ✅ 장점

1. **유일한 인스턴스 보장**
   - 특정 객체가 하나만 존재해야 할 때 유용하다.
2. **전역 접근 가능**
   - 어디서든 동일한 인스턴스를 접근할 수 있어 편리하다.
3. **메모리 절약**
   - 같은 객체를 여러 번 생성하는 것이 아니라 하나의 객체를 재사용하므로 메모리를 절약할 수 있다.

### ❌ 단점

1. **테스트가 어려움**
   - `new Grimpan()`을 직접 생성하는 방식과 다르게, `getInstance()`를 통해 접근해야 하므로 **의존성이 강해져 단위 테스트(Mock 객체 생성)가 어렵다**.
2. **단일 책임 원칙(SRP) 위반 가능성**

   - \- getInstance() 메서드는 인스턴스 관리까지 담당하기 때문에, 단일 책임 원칙에 어긋날 수 있다.

     &#x20; \- 예를 들어, 현재는 하나의 인스턴스만 관리하지만, 나중에 인스턴스를 여러 개로 확장하고 싶다면 해당 메서드를 수정해야 한다. 이는 단일 책임 원칙 위배로 이어질 수 있다.

---

## 🛠️ 개선 방법

### 🎯 1. 생성자 `private` 설정

```typescript
class Grimpan {
  private static instance: Grimpan;
  private constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
  }
  static getInstance(): Grimpan {
    if (!this.instance) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      this.instance = new Grimpan(canvas);
    }
    return this.instance;
  }
}
```

### 🎯 2. 의존성 주입 (Dependency Injection) 활용

```typescript
class Grimpan {
  private static instance: Grimpan;
  private constructor(private canvas: HTMLCanvasElement) {}

  static getInstance(canvas: HTMLCanvasElement): Grimpan {
    if (!this.instance) {
      this.instance = new Grimpan(canvas);
    }
    return this.instance;
  }
}
```

테스트 시 다음과 같이 `Mock Canvas`를 활용할 수 있다.

```typescript
const mockCanvas = document.createElement('canvas');
const grimpan = Grimpan.getInstance(mockCanvas);
```

---

## 🔄 싱글톤 패턴의 강한 결합 vs 약한 결합

### 🔗 강한 결합 예제

```typescript
function main() {
  Grimpan.getInstance().initialize();
}
main();
```

이 방식은 특정 클래스에 대한 의존성이 강하다.

### 🔗 약한 결합 예제

```typescript
function main(instance: any) {
  instance.initialize();
}
main(Grimpan.getInstance());
```

이렇게 하면 다양한 인스턴스를 활용할 수 있어 코드 재사용성이 증가한다.

---

## 📢 결론

싱글톤 패턴은 **유일한 인스턴스를 보장**해야 하는 경우 유용하게 사용할 수 있다. 그러나 **테스트의 어려움, 단일 책임 원칙 위배 가능성, 의존성 증가** 등의 단점도 존재하므로, 프로젝트의 요구 사항에 따라 신중하게 적용해야 한다.
