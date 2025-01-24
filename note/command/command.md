## 커맨드 패턴이란?

커맨드 패턴은 **요청을 하나의 객체로 캡슐화하여 필요할 때 실행, 저장, 취소할 수 있도록 하는 디자인 패턴**입니다. 즉, **요청을 실행하는 객체(Invoker)와 실제 작업을 수행하는 객체(Receiver)를 분리하는 것**이 핵심입니다.

이 패턴을 사용하면 **기능을 모듈화하고, 실행 취소(Undo)나 요청의 저장 및 로깅 같은 기능을 쉽게 구현할 수 있습니다**.

---

## 🔑 **커맨드 패턴의 주요 구성 요소**

| 구성 요소             | 설명                               | 예제                 |
| --------------------- | ---------------------------------- | -------------------- |
| **Receiver (리시버)** | 실제 동작을 수행하는 객체          | 게임 캐릭터          |
| **Command (커맨드)**  | 리시버의 동작을 감싸는 객체        | 점프 명령, 공격 명령 |
| **Invoker (인보커)**  | 명령을 실행하는 역할 (실제 동작 X) | 게임 컨트롤러        |

## 💻 **TypeScript 예제 코드**

```tsx
// 1. 리시버 (Receiver) - 실제 행동을 수행하는 캐릭터
class GameCharacter {
  jump() {
    console.log('캐릭터가 점프했다! 🦘');
  }

  attack() {
    console.log('캐릭터가 공격했다! ⚔️');
  }
}

// 2. 커맨드 인터페이스 (Command)
interface Command {
  execute(): void;
}

// ⏫ 3. 점프 명령 (Concrete Command)
class JumpCommand implements Command {
  private character: GameCharacter;

  constructor(character: GameCharacter) {
    this.character = character;
  }

  execute() {
    this.character.jump();
  }
}

// ⚔️ 4. 공격 명령 (Concrete Command)
class AttackCommand implements Command {
  private character: GameCharacter;

  constructor(character: GameCharacter) {
    this.character = character;
  }

  execute() {
    this.character.attack();
  }
}

// 5. 인보커 (Invoker) - 명령을 실행하는 역할 (실제 동작을 하면 안됨)
class GameController {
  private command?: Command;

  setCommand(command: Command) {
    this.command = command;
  }

  pressButton() {
    if (this.command) {
      this.command.execute(); // ❌ 직접 동작 X → ✔️ 명령 실행
    } else {
      console.log('아무 명령도 설정되지 않았어!');
    }
  }
}

// 🏃‍♂️ 6. 실행 예제
const character = new GameCharacter();
const jumpCommand = new JumpCommand(character);
const attackCommand = new AttackCommand(character);
const controller = new GameController();

controller.setCommand(jumpCommand);
controller.pressButton(); // "캐릭터가 점프했다! 🦘"

controller.setCommand(attackCommand);
controller.pressButton(); // "캐릭터가 공격했다! ⚔️"
```

---

## ❓ **왜 이렇게 구현할까?**

**"어차피 커맨드 인터페이스를 생성해서 `execute()`밖에 안 쓰는데, 왜 이렇게 복잡하게 구현했는지?"** 라는 생각을 할 수 있습니다.

### 1️⃣ **OCP(개방-폐쇄 원칙)**

→ 기존코드를 수정하지 않고 새롭게 추가할 수 있으며, 확장에는 열려있고 수정에는 닫혀있어야한다.

**→ 새로운 명령을 쉽게 추가 가능**

```tsx
class DefendCommand implements Command {
  private character: GameCharacter;

  constructor(character: GameCharacter) {
    this.character = character;
  }

  execute() {
    console.log('캐릭터가 방어했다! 🛡️');
  }
}
```

기존 `GameController` 코드는 건드릴 필요 없이, 새로운 방어 행동객체만 만들면 됩니다.

---

### 2️⃣ **요청을 저장하고 실행 취소(Undo) 기능을 쉽게 구현 가능**

커맨드 패턴을 쓰면 **명령을 저장하고 실행 취소(Undo) 기능**을 추가하기도 쉽습니다.

```tsx
class GameControllerWithUndo {
  private commandHistory: Command[] = [];

  executeCommand(command: Command) {
    command.execute();
    this.commandHistory.push(command);
  }

  undoLastCommand() {
    this.commandHistory.pop();
    console.log('마지막 명령 실행 취소! 🔄');
  }
}
```

이제 실행했던 명령을 저장해 두고, 필요할 때 실행 취소를 할 수 있습니다.

## ❓ **인보커(Invoker)에서 실제 동작을 하면 안 되는 이유**

커맨드 패턴에서는 **"인보커에서 실제 동작을 하면 안 된다"** 라는 원칙이 있습니다. 강의에서도 나왔던 내용인데 좀더 자세하게 정리해 보았습니다.

인보커에서 실제 동작을 하면 안되는 이유는 **"명령을 캡슐화해서 실행만 담당해야 하기 때문"** 입니다.

### ❌ **잘못된 예시 (Invoker가 직접 행동)**

```tsx
class WrongGameController {
  private character: GameCharacter;

  constructor(character: GameCharacter) {
    this.character = character;
  }

  pressJumpButton() {
    this.character.jump(); // ❌ 직접 실행하면 커맨드 패턴 의미가 없음
  }

  pressAttackButton() {
    this.character.attack(); // ❌ 직접 실행하면 확장성이 떨어짐
  }
}
```

위처럼 하면 **"버튼마다 새로운 메서드를 계속 추가해야 함"**

→ 유지보수가 어렵고, 새로운 동작을 추가할 때마다 `GameController`를 수정 해야만 합니다.

### ✅ **올바른 예시 (Invoker는 명령만 실행)**

```tsx
controller.setCommand(jumpCommand);
controller.pressButton(); // "캐릭터가 점프했다! 🦘"
```

→ `GameController`는 `execute()`를 호출할 뿐, **"점프가 어떻게 구현되는지 모름"**

→ 이렇게 하면 **새로운 명령(예: 방어, 대쉬 등)을 쉽게 추가 가능!**
