# SOLID 원칙 정리

소프트웨어 개발에서 SOLID 원칙은 유지보수성과 확장성을 높이는 중요한 개념입니다. 이 문서에서는 SOLID 원칙을 쉽게 이해할 수 있도록 정리하였습니다.

---

## 📌 단일 책임 원칙 (SRP: Single Responsibility Principle)

**"하나의 클래스는 하나의 책임만 가져야 한다."**

### ✅ 단일 책임 원칙이란?

- 하나의 클래스나 함수는 하나의 기능만 담당해야 한다.
- 변경해야 할 이유(책임)가 여러 개라면 SRP를 위반한 것이다.
- 책임이 많으면 유지보수가 어려워지고 코드가 복잡해진다.

### 🚀 예제 코드

```tsx
function a() {}
function b() {}
function c() {}

function main() {
  a();
  b();
  c();
}
```

위 코드에서 `main()` 함수는 여러 개의 함수를 호출하지만, 각각의 함수는 단일 책임을 가진다. 만약 `main()`에서 여러 개의 로직을 직접 수행하면 SRP를 위반할 가능성이 높다. main()은 단일책임 위반 보다는 순서를 관장하는 함수라고 볼 수 있다.

### 🎯 적용 방법

- 하나의 함수/클래스가 여러 기능을 수행하면 분리한다.
- 예를 들어, **이미지를 생성하고 저장하는 기능이 하나의 함수에 있다면**, 저장 기능을 별도로 분리하는 것이 좋다.
- 모든 상황에 100% 적용하려고 얽매일 필요는 없으며, 필요할 때 리팩토링을 고려하면 된다.

---

## 🚀 개방-폐쇄 원칙 (OCP: Open/Closed Principle)

**"확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다."**

### ✅ 개방-폐쇄 원칙이란?

- 새로운 기능을 추가할 때 기존 코드를 변경하지 않고 확장할 수 있어야 한다.
- 기존 코드 수정 없이 새로운 기능을 쉽게 추가할 수 있도록 설계한다.

### ❌ OCP 위반 예제

```tsx
function main(type: string) {
  if (type === 'a') {
    doA();
  } else if (type === 'b') {
    doB();
  } else if (type === 'c') {
    doC();
  }
}
```

위 코드에서 새로운 타입 `d`를 추가하려면 `else if` 문을 추가해야 한다. 이는 OCP를 위반하는 방식이다.

### ✅ OCP 적용 방법

```tsx
interface Doable {
  do(): void;
}

function main(task: Doable) {
  task.do();
}

class A implements Doable {
  do() {
    console.log('A 실행');
  }
}

const a = {
  do() {
    console.log('A 실행');
  },
};
const b = {
  do() {
    console.log('B 실행');
  },
};

main(a);
main(b);
```

이렇게 하면 기존 `main` 함수를 수정하지 않고도 새로운 동작을 추가할 수 있다.

---

## 🦆 리스코프 치환 원칙 (LSP: Liskov Substitution Principle)

**"자식 클래스는 부모 클래스를 대체할 수 있어야 한다."**

### ✅ 리스코프 치환 원칙이란?

- 자식 클래스는 부모 클래스의 기능을 유지하면서 확장해야 한다.
- 부모 클래스를 사용하는 코드에서 자식 클래스를 대체해도 정상적으로 동작해야 한다.

### ❌ LSP 위반 예제

```tsx
class Animal {
  isAnimal() {
    return true;
  }
}

class Bird extends Animal {
  fly() {
    return '파닥파닥'; //string 반환
  }
  isBird() {
    return true;
  }
}

class Pengin extends Animal {
  override fly() {
    throw new Error('펭귄은못날아'); //never타입 반환
  }
  isBird() {
    return true;
  }
}

console.log(new Animal().isAniimal());
console.log(new Bird().fly());
console.log(new Pengin().fly()); //타입오류발생 (리스코프 치환 형식 위반).
```

위 코드에서 `Penguin` 클래스가 `Bird` 클래스를 상속받았지만, `fly()` 메서드를 오버라이드하여 예외를 던진다. 이는 LSP를 위반하는 것이다.

### ✅ LSP 준수 방법

- 아래 인터페이스 분리 원칙에서 확인 할 수 있다.

---

## 🔌 인터페이스 분리 원칙 (ISP: Interface Segregation Principle)

**"하나의 범용 인터페이스보다는 여러 개의 작은 인터페이스가 낫다."**

### ✅ ISP 적용 예제

```tsx
interface Quackable {
  quack(): string;
}

interface Flyable {
  fly(): string;
}

class Duck implements Quackable, Flyable {
  quack() {
    return '꽥꽥';
  }
  fly() {
    return '파닥파닥';
  }
}

class Penguin implements Quackable {
  quack() {
    return '꽥';
  }
}
```

이렇게 하면 `Penguin`이 필요하지 않은 `fly()` 메서드를 구현할 필요가 없다.

---

## 🏗 의존 관계 역전 원칙 (DIP: Dependency Inversion Principle)

**"구체적인 것이 아닌, 추상적인 것에 의존해야 한다."**

### ✅ DIP 적용 예제

```tsx
interface Drawable {
  draw(): void;
}

class Grimpan implements Drawable {
  draw() {
    console.log('Grimpan: 그림을 그린다');
  }
}

class AdvancedGrimpan implements Drawable {
  draw() {
    console.log('AdvancedGrimpan: AI를 사용해 그림을 그린다');
  }
}

class DrawingTool {
  private drawable: Drawable;

  constructor(drawable: Drawable) {
    this.drawable = drawable;
  }

  startDrawing() {
    this.drawable.draw();
  }
}

const grimpan = new Grimpan();
const drawingTool = new DrawingTool(grimpan);
drawingTool.startDrawing();
```

---

## 🎯 마무리

SOLID 원칙을 따르면 유지보수성이 높아지고, 확장하기 쉬운 코드를 작성할 수 있습니다. 하지만 모든 코드에 무조건 적용해야 하는 것은 아닙니다. **필요할 때 리팩토링하면서 적용하는 것이 중요합니다.**

---
