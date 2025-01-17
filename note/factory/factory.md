# 🎨 팩토리 패턴 적용하기

## 📌 개요

팩토리 패턴(Factory Pattern)은 객체 생성 로직을 별도의 클래스로 분리하여 관리하는 디자인 패턴입니다. 이 글에서는 **팩토리 메서드 패턴(Factory Method Pattern)** 을 TypeScript로 구현하고, `abstract` 클래스와 `interface`를 활용하는 방법을 비교해보겠습니다.

---

## 🏗️ 단일 팩토리 방식

많이 사용되는 방식인 if / else 를 활용한 방식입니다.

```tsx
import ChromeGrimpan from './ChromeGrimpan';
import IEGrimpan from './IEGrimpan';

function grimpanFactory(type: string) {
  if (type === 'ie') {
    return IEGrimpan.getInstance();
  } else if (type === 'chrome') {
    return ChromeGrimpan.getInstance();
  } else {
    throw new Error('일치하는 Grimpan이 없습니다!');
  }
}
```

### 🚨 문제점

1. **단일 책임 원칙(SRP) 위반**: `grimpanFactory`는 객체 생성과 타입 판별이라는 두 가지 역할을 수행함.
2. **개방-폐쇄 원칙(OCP) 위반**: 새로운 `Grimpan` 타입이 추가될 때마다 `if-else` 문을 수정해야 함.

---

## ✅ 팩토리 메서드 패턴 적용

### 📌 1. 추상 클래스 (`AbstractGrimpan`)

```tsx
export default abstract class Grimpan {
  protected constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
  }
  abstract initialize(): void;
  abstract initializeMenu(): void;
  static getInstance(): Grimpan;
}
```

### 📌 2. 구체적 구현 (`ChromeGrimpan`, `IEGrimpan`)

```tsx
import Grimpan from './AbstractGrimpan';

export default class ChromeGrimpan extends Grimpan {
  private static instance: ChromeGrimpan;

  initialize() {}
  initializeMenu() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(document.querySelector('canvas'));
    }
    return this.instance;
  }
}
```

### 📌 3. 팩토리 메서드 (`AbstractGrimpanFactory`)

```tsx
abstract class AbstractGrimpanFactory {
  abstract createGrimpan(): Grimpan;
}
export default AbstractGrimpanFactory;
```

### 📌 4. 구체적인 팩토리 (`ChromeGrimpanFactory`, `IEGrimpanFactory`)

```tsx
class ChromeGrimpanFactory extends AbstractGrimpanFactory {
  override createGrimpan() {
    return ChromeGrimpan.getInstance();
  }
}

class IEGrimpanFactory extends AbstractGrimpanFactory {
  override createGrimpan() {
    return IEGrimpan.getInstance();
  }
}
```

### 📌 5. 클라이언트 코드 (`main`)

```tsx
function main() {
  const grimpan = new ChromeGrimpanFactory().createGrimpan();
  grimpan.initialize();
  grimpan.initializeMenu();
}
```

---

## 🛠️ `static` 팩토리 방식

### 📌 `abstract static`의 한계

TypeScript에서는 `abstract static`을 지원하지 않기 때문에 아래와 같이 변경합니다.

```tsx
abstract class AbstractGrimpanFactory {
  static createGrimpan() {
    throw new Error('하위 클래스에서 구현 필요');
  }
}
```

### 📌 대안: `static` 팩토리 구현

```tsx
class ChromeGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return ChromeGrimpan.getInstance();
  }
}

class IEGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return IEGrimpan.getInstance();
  }
}
```

### 📌 클라이언트 코드 개선

```tsx
function main(factory: typeof AbstractGrimpanFactory) {
  const grimpan = factory.createGrimpan();
  grimpan.initialize();
  grimpan.initializeMenu();
}
```

---

## ⚖️ `abstract` vs `interface`

### ✅ `abstract` 클래스의 장점

1. **공통 구현을 제공**할 수 있음 (코드 중복 감소)
2. **기본 메서드 제공 가능** (`initialize` 등)

### 🚨 `interface`의 단점

1. **구현을 포함할 수 없음** (모든 구현부를 직접 추가해야 함 → 중복 발생 가능)

### 📌 `interface`로 변경한 코드

```tsx
interface IGrimpan {
  initialize(): void;
  initializeMenu(): void;
}

class ChromeGrimpan implements IGrimpan {
  initialize() {}
  initializeMenu() {}
}
```

---

## 🔥 결론

✔ **팩토리 패턴을 사용하면** `if-else` 없이 새로운 클래스를 확장 가능 📈

✔ **`abstract` 클래스가 `interface`보다 중복을 줄이는 데 유리함** 🏆

✔ **`static` 팩토리 방식을 사용할 경우, `abstract static`이 안 되므로 주의** ⚠️
