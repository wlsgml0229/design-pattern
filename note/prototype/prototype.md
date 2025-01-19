# 🏗️ 프로토타입 패턴과 클론 메서드 활용하기

## 🎭 프로토타입 패턴이란?

\*\*"복제하기 패턴"\*\*이라고도 불리는 프로토타입 패턴은 **비슷한 구조의 객체를 여러 개 만들 때** 유용하다.

```typescript
interface Clonable {
  clone(): Clonable;
}

class HistoryStack extends Array implements Clonable {
  clone(): HistoryStack {
    return this.slice() as HistoryStack;
  }
}
```

### ✅ 프로토타입 방식의 클론 메서드 장점

1. **배열이 불변(immutable) 배열이 됨** → 원본 데이터를 유지하면서 변경 가능
2. **얕은 복사(Shallow Copy)** → 배열 자체의 참조는 끊기지만, 내부 요소는 여전히 같은 참조를 가질 수 있음
3. **기존 객체와의 연관 관계가 제거됨** → 새로운 객체로 동작
4. **객체의 프로토타입을 유지하면서 복사됨** → 상속 구조를 유지하며 복사 가능

---

## 🛑 JSON.stringify()를 이용한 복사의 한계

```typescript
const original = new HistoryStack(1, 2, 3);
const cloned = JSON.parse(JSON.stringify(original));
```

❗ **이 방법은 **\*\*\***\*`clone()`**\*\*\*\*\*\* 메서드를 복사하지 못할 수도 있음!\*\*

🔍 이유:

- `JSON.stringify()`는 객체를 문자열로 변환한 뒤 다시 객체로 변환하는 과정에서 **메서드를 포함하지 않음**
- 즉, 복사된 객체는 원본의 메서드를 상속받지 못하기 때문에 `clone()` 메서드가 사라질 수 있음
- 이런 경우 `lodash` 같은 라이브러리를 활용한 깊은 복사(Deep Copy)를 고려해야 함

---

## 🎭 프로토타입 패턴을 활용한 객체 복제

```typescript
class A {
  constructor(
    public one: number,
    public two: number,
    public three: number,
    public four: number,
  ) {}
  clone() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    );
  }
}

const a = new A(1, 2, 3, 4);
const aClone = a.clone();

// 원본은 유지한 채 일부 변경 가능
aClone.four = 40;
```

### 🏆 프로토타입 패턴을 사용하면 좋은 경우

✅ **비슷한 속성을 가진 객체를 여러 개 만들 때**

- 복사 후 일부 속성만 변경하는 경우 유용

✅ **비용이 큰 계산 결과를 저장해야 할 때**

- 캐싱을 직접 구현하는 대신 `clone()`을 활용하여 처리

```typescript
class HeavyObject {
  constructor(public data: any) {}
  clone() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    );
  }
}

const obj = new HeavyObject({ very: 'heavy' });
const objClone = obj.clone();
```

---

## ⚠️ 프로토타입 패턴 사용 시 주의할 점

🛑 **잘못 구현된 복사 방식은 원본 객체가 변경될 수도 있음**

- 얕은 복사(Shallow Copy)인지 깊은 복사(Deep Copy)인지 구분할 것
- `Object.create()` 방식은 얕은 복사이므로 내부 객체까지 복사되지 않음

🛑 **상속 관계가 복잡할 경우 적용이 어려울 수 있음**

- 부모 클래스의 `private` 속성이 많다면 `clone()`이 제대로 작동하지 않을 수도 있음

---
