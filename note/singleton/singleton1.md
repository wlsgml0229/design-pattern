# 🎨 Singleton 패턴으로 구현하는 Grimpan

`Grimpan` 클래스를 작성하면서 **싱글톤(Singleton) 패턴**을 적용해, 여러 번 인스턴스를 생성하더라도 단 하나의 인스턴스만 사용되도록 구현하는 방법을 알아봅니다. 이 글에서는 잘못된 구현 사례와 개선된 코드를 비교하며 설명합니다.

---

## ❌ Case 1: 상태값이 멀어지는 설계

```tsx
let instance: Grimpan;

class Grimpan {
  constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
    if (instance) {
      instance = this;
    }
    return instance;
  }

  initialize() {}
  initializeMenu() {}
}
```

### 문제점

- 상태값을 외부에서 관리해야 하기 때문에 코드가 복잡해집니다.
- `class` 내부에서 이미 상태와 기능을 정의할 수 있음에도 불구하고, 추가적으로 상태를 관리해야 하는 비효율적인 구조입니다.

---

## ❌ Case 2: 타입 오류를 무시한 설계

```tsx
class Grimpan {
  instance: Grimpan;

  constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
    if (this.instance) {
      this.instance = this;
    }
    return this.instance;
  }

  initialize() {}
  initializeMenu() {}
}
```

### 문제점

- 각 호출마다 새로운 객체가 생성되며, 인스턴스가 일관되지 않습니다.
- 타입 오류를 무시하고 작성하더라도 싱글톤 패턴의 의도에 맞지 않는 결과를 초래합니다.

---

## ✅ 올바른 구현: Singleton 패턴 적용

싱글톤 패턴을 활용하여 단 하나의 인스턴스만 생성되도록 구현합니다.

```tsx
class Grimpan {
  private static instance: Grimpan | null = null;

  private constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
  }

  public static getInstance(canvas: HTMLElement | null): Grimpan {
    if (!this.instance) {
      this.instance = new Grimpan(canvas);
    }
    return this.instance;
  }

  initialize() {}
  initializeMenu() {}
}

export default Grimpan;
```

### 사용법

```tsx
const canvas = document.querySelector('#canvas');
const g1 = Grimpan.getInstance(canvas);
const g2 = Grimpan.getInstance(canvas);

console.log(g1 === g2); // true
```

### 개선 사항

- 클래스 내부에서 상태를 관리하며, 외부에서의 추가적인 관리가 필요 없습니다.
- 호출 시 항상 동일한 인스턴스를 반환하므로 일관성을 유지합니다.

---

## 🌟 추가 개선: Default Export

만약 단일 인스턴스만 필요한 경우, 다음과 같이 기본 내보내기를 설정할 수 있습니다.

```tsx
class Grimpan {
  constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
  }

  initialize() {}
  initializeMenu() {}
}

export default new Grimpan(document.querySelector('#canvas'));
```

### 사용해보기

- .js 를 파일에 붙여야 브라우저에서 동작함
- 서로다른 파일에 있어도 항상같음
- javascript 모듈이 싱글톤이기 때문에 import 한것끼리는 서로 같다.
- 다른파일에 있어도 같다

```tsx
import g1 from './grimpan.js';
import g2 from './grimpan.js';

//두개를 불러왔지만 항상 동일
console.log(g1 === g2);
```

언어특성을 안타는 싱글톤을 만들기위해 추가구현해보기
