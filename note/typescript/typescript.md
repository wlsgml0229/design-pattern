# 🔧 TypeScript: 언어적특징

TypeScript를 사용하면서 자주 접하게 되는 **Interface**와 **Abstract Class**, 그리고 객체 리터럴의 타입 검증에 대해 이야기해 보겠습니다. 이 글에서는 각각의 특성과 차이를 코드 예제와 함께 살펴보며 정리하겠습니다.

---

## 💡 객체 리터럴과 타입 검증

TypeScript에서는 객체 리터럴을 직접 함수에 전달할 때와 변수를 선언한 뒤 전달할 때 타입 검사 동작 방식이 다릅니다.

```
interface Obj {
  name: string;
}
function main(obj: Obj) {}

// 🚫 오류 발생
main({
  name: 'hello',
  xyz: 'abc', // Obj에 정의되지 않은 속성
});
```

객체 리터럴을 직접 함수에 전달하면, TypeScript가 "잉여 속성 검사(Excess Property Check)"를 수행합니다. Obj에 없는 `xyz` 속성 때문에 오류가 발생합니다. 하지만 변수를 사용하면 다른 결과를 얻을 수 있습니다:

```
// ✅ 정상 동작
const obj = {
  name: 'hello',
  xyz: 'abc', // 여전히 Obj에 정의되지 않음
};
main(obj);
```

변수를 통해 전달하면 잉여 속성 검사가 수행되지 않습니다. TypeScript는 `obj` 변수가 Obj 인터페이스와 호환되면 오류를 발생시키지 않습니다. **이 차이를 이해하면 디버깅에서 시간을 절약할 수 있습니다!**

---

## 🌐 Interface와 Abstract Class의 차이

TypeScript에서 Interface와 Abstract Class는 타입 정의와 객체 설계에서 중요한 역할을 합니다. 하지만 두 개념은 다르게 동작하므로 상황에 맞게 선택해야 합니다.

### 🔰 Interface의 특징

1. **전부 public**: Interface의 모든 속성과 메서드는 기본적으로 `public`입니다.
2. **다중 구현 가능**: 한 클래스가 여러 개의 인터페이스를 구현할 수 있습니다.
3. **행동 정의**: 구현체가 어떤 행동을 해야 하는지를 강제합니다.

```
interface Runnable {
  run(): void;
}

interface Walkable {
  walk(): void;
}

class A implements Runnable, Walkable {
  run() {
    console.log('Running');
  }
  walk() {
    console.log('Walking');
  }
}
```

### 🔰 Abstract Class의 특징

1. **로직 포함 가능**: 추상 메서드 외에도 구현된 메서드를 포함할 수 있습니다.
2. **단일 상속**: 클래스는 하나의 추상 클래스만 상속받을 수 있습니다.
3. **접근 제한자 지원**: `private`, `protected` 등을 사용할 수 있습니다.

```
abstract class A {
  constructor(public name: string) {}

  abstract greet(): void;

  sayHello() {
    console.log(`Hello, ${this.name}!`);
  }
}

class B extends A {
  greet() {
    console.log('Greetings!');
  }
}
```

### 🛠 Abstract Class를 선호하는 이유

추상 클래스는 로직을 포함할 수 있기 때문에 Interface보다 더 강력한 설계 도구가 될 수 있습니다. 예를 들어, 공통 메서드가 여러 구현체에서 재사용되어야 하는 경우 추상 클래스를 사용하면 코드를 줄이고 유지보수를 용이하게 만들 수 있습니다.

---

## 💪 구조적 타이핑(덕 타이핑)

TypeScript는 **구조적 타이핑(Structural Typing)** 또는 **덕 타이핑(Duck Typing)**을 사용합니다. 이는 객체의 형태(shape)로 타입을 판단하는 방식을 의미합니다.

```
abstract class Ac {
  public hello: string;
  constructor(hello: string) {
    this.hello = hello;
  }
}

// ✅ 같은 타입으로 간주됨
const ac: Ac = {
  hello: 'world',
};

// 동일한 결과
const acInstance = new Ac('world');
```

### 함수에서의 활용

덕 타이핑 덕분에 객체 리터럴이나 클래스 인스턴스 모두 함수의 인자로 전달 가능합니다.

```
function main2(obj: Ac) {}
main2({ hello: 'TypeScript' });
```

이처럼 TypeScript는 **객체의 모양**이 일치하면 타입을 동일하게 간주합니다.

---

## 💡 Abstract Class와 Interface의 선택 기준

### ✅ Abstract Class를 선택해야 하는 경우

1. 로직이 포함된 메서드를 정의해야 하는 경우
2. 공통된 구현체를 재사용하고 싶은 경우

### ✅ Interface를 선택해야 하는 경우

1. 다중 구현이 필요한 경우
2. 클래스가 특정 행동을 반드시 구현해야 할 때

---

## 📖 JavaScript와의 차이점

1. JavaScript에는 **Interface**가 없습니다. 하지만 TypeScript에서 Interface는 타입 검증을 위해 사용됩니다.
2. TypeScript에서 `abstract` 키워드를 제거하면 JavaScript에서도 추상 클래스의 기본 형태로 사용 가능합니다.

### 💡 다중 상속이 필요한 경우의 해결책

JavaScript는 단일 상속 언어입니다. 다중 상속이 필요할 때는 **조합 클래스**를 사용합니다:

```
class Runnable {
  run() {
    console.log('Running');
  }
}

class Walkable {
  walk() {
    console.log('Walking');
  }
}

class RunAndWalkable extends Walkable {
  run() {
    console.log('Custom Running');
  }
}

class B extends Runnable {
  walk() {
    console.log('Custom Walking');
  }
}
```

이 방식은 중간 클래스나 믹스인을 활용하여 다중 상속의 제한을 우회할 수 있습니다
