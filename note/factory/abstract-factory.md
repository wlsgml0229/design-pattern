# 🎯 추상 팩토리란?

추상 팩토리 패턴은 **연관성이 있는 객체군**이 여러 개 있을 경우 이들을 묶어 추상화하고, 어떤 구체적인 상황이 주어지면 팩토리 객체에서 집합으로 묶은 객체군을 **구현화하는 생성 패턴**입니다. 핵심은 제품 집합을 타입별로 생성할 수 있다는 점입니다.

추상팩토리 패턴을 쉽게 이해하기 위해, 자동차 제조 과정을 예시로 들어보겠습니다. 자동차는 엔진, 타이어 등 여러 부품들의 조합으로 이루어지며, 각 제조사마다 고유한 부품을 사용한다는 점을 생각하고 구현 해 보겠습니다. 🚗

## 🔍 핵심 구성요소

추상 팩토리를 구현하기 위해 사용할 핵심 요소들은 아래와 같습니다.

| 구성요소                       | 설명                   | 예시                         |
| ------------------------------ | ---------------------- | ---------------------------- |
| 추상 제품 (Abstract Product)   | 제품의 공통 인터페이스 | `Engine`, `Tires` 인터페이스 |
| 구체 제품 (Concrete Product)   | 실제 구현체            | `HyundaiEngine`, `KiaTires`  |
| 추상 팩토리 (Abstract Factory) | 제품 생성 인터페이스   | `CarFactory` 인터페이스      |
| 구체 팩토리 (Concrete Factory) | 실제 제품 생성 구현체  | HyundaiCarFactory            |

## 💻 핵심 구성 요소 구현

<img width="747" alt="Image" src="https://github.com/user-attachments/assets/38dac674-bbf6-44d1-a47d-6992e13be6e9" />

### 기본 인터페이스

자동차를 만들기 위해 엔진과 타이어는 공통적으로 구현이 필요합니다.

```tsx
interface Engine {
  getType(): string;
  getHorsepower(): number;
}

interface Tires {
  getSize(): number;
  getBrand(): string;
}
```

### 구체적인 제품 클래스

위에서 구현한 기본 인터페이스를 받아 각 제조사에 맞는 엔진, 타이어를 구현합니다.

```tsx
class HyundaiEngine implements Engine {
  getType(): string {
    return 'Hyundai Smartstream';
  }
  getHorsepower(): number {
    return 180;
  }
}

class KiaEngine implements Engine {
  getType(): string {
    return 'Kia Theta';
  }
  getHorsepower(): number {
    return 190;
  }
}
```

## 3. 팩토리 구현

추상 팩토리 인터페이스와 구체적인 팩토리 클래스를 다음과 같이 구현합니다.

인터페이스를 통해서 구현할 기능을 선언, 공통적으로 각 제조사 별 팩토리를 생성합니다.

각 제품군에 대해 사용될 공통된 메서드들을 정의합니다.

```tsx
// 추상 인터페이스
interface CarFactory {
  createEngine(): Engine;
  createTires(): Tires;
}

class HyundaiCarFactory implements CarFactory {
  createEngine(): Engine {
    return new HyundaiEngine();
  }
  createTires(): Tires {
    return new HyundaiTires();
  }
}
```

## 4. 클라이언트 코드 작성

엔진과 타이어를 조립 과정을 담당하는 `assembleCar` 함수 구현 합니다.

```tsx
function assembleCar(factory: CarFactory) {
  const engine = factory.createEngine();
  const tires = factory.createTires();
}

// 사용하기
const hyundaiFactory = new HyundaiCarFactory();
assembleCar(hyundaiFactory);
//새로운 브랜드 아래에 추가하여 기존코드를 건들지 않음.
```

### 🎯 assembleCar 함수의 역할

1. **일관된 생성 프로세스**: 모든 자동차의 조립 과정을 표준화합니다.
2. **캡슐화**: 복잡한 객체 생성 과정을 숨기고 간단한 인터페이스를 제공합니다.
3. **품질 보증**: 연관된 부품들이 올바르게 조합되는 것을 보장합니다.

### 🤔 왜 assembleCar 함수에서 추상 팩토리를 주입하여 사용할까?

`assembleCar` 함수가 `CarFactory` 추상 인터페이스를 매개변수로 받는 이유는:

1. **느슨한 결합**: 구체적인 팩토리 클래스가 아닌 추상 인터페이스에 의존함으로써, 코드의 결합도를 낮춥니다.
2. **교체 용이성**: 현대차 팩토리에서 기아차 팩토리로 쉽게 교체할 수 있습니다.
3. **확장성**: 새로운 자동차 브랜드를 추가할 때 기존 코드를 수정할 필요가 없습니다.

## 주의사항 ⚠️

1. 불필요한 추상화 지양

```tsx
// 이런 단순한 경우는 오버엔지니어링이 될 수 있습니다
interface SimpleFactory {
  createA(): A;
  createB(): B;
}
```

1. 제품군의 결합도 검증

```tsx
// 이런 경우는 추상 팩토리가 적절하지 않음
interface RandomFactory {
  createLogger(): Logger;
  createDatabase(): Database;
  // 이 두 객체는 반드시 함께 사용될 필요가 없음
}
```

## 결론 💡

추상 팩토리 패턴은 제품군 단위의 객체 생성을 일관성 있게 관리할 수 있어 유용하지만, 과도한 추상화는 오히려 실제로 호출되는 구현체를 찾기 위해 여러 인터페이스와 클래스를 탐색해야 하는 경우가 많아질 수 있습니다. 필요할 때만 추상화를 도입하는 것이 중요하며, 처음부터 모든 것을 추상화하려 하기보다는 중복되는 코드가 많아지거나 하는 경우 추상화를 고려하며 접근하는 방법이 바람직 하지 않을까 라는 생각입니다.
