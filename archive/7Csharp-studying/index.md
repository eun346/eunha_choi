---
title: C# Foundations for Unity
published: 2025-12-16
description: Study notes and small code examples on types, operators, control flow, arrays, and methods as preparation for Unity scripting.
tags: [C#, Unity, Programming Fundamentals]
category: Study Notes
draft: false
---

These are my C# foundation notes as I prepare for more structured Unity scripting. I’m using small examples to review types, operators, control flow, arrays, and methods before applying them to interaction and gameplay systems.

---

## 1. Variables and Data Types

### What is a variable?

A variable is a named space in memory that stores a value.
In C#, every variable must have a **type**, which determines:

* how much memory it uses
* what kind of values it can store

---

### Value Types 

Common value types include:
![valType](./images/1valType.png)

Example:
```csharp
int level = 100;
float speed = 3.14f;
bool isActive = true;
char grade = 'A';
```

Key point:
**The type decides what operations are allowed.**
You cannot treat an `int` like a `bool`, even if the value “looks similar”.

---

### Variable Initialization

Variables can be:

* initialized immediately
* declared first, assigned later

Example:
```csharp
int a1, a2, a3;
a1 = 10;

int b = 20;
```

Local variables must be assigned before they are read, while fields receive type-specific default values. I still prefer explicit initialization when the intended starting state matters.

---

## 2. Operators

### Arithmetic Operators

The basic arithmetic operators are:

* `+` addition
* `-` subtraction
* `*` multiplication
* `/` division
* `%` remainder

Example:

```csharp
int num1 = 5;
int num2 = 2;

int sum = num1 + num2;   // 7
int mod = num1 % num2;   // 1
```

---

### Division and Casting 

If both operands are integers, **integer division happens**.

```csharp
int a = 5;
int b = 2;
float result = a / b;   // result = 2 (not 2.5)
```

Correct way:

```csharp
float result = (float)a / b; // 2.5
```

---

## 3. Conditional Statements

### if / else

Conditionals allow the program to choose a path.

```csharp
int num = 11;

if (num > 10)
{
    Debug.Log("num is greater than 10");
}
else
{
    Debug.Log("num is 10 or less");
}
```

Conditions must evaluate to `bool`.

---

### Logical Operators

* `&&` AND
* `||` OR

Example:

```csharp
if (num > 0 && num < 20)
{
    Debug.Log("num is between 1 and 19");
}
```

Important detail:
C# uses **short-circuit evaluation**.
The second condition may not be evaluated if the first already determines the result.

---

### Switch Statements and Enums

Switch statements work well when program states are discrete and named.

```csharp
enum STATE
{
    NONE = 0,
    INIT, //1
    PLAY = 100, //100
    OVER, //101

}

STATE currentState = STATE.INIT;

switch (currentState)
{
    case STATE.INIT:
        Debug.Log("Initialize");
        break;
    case STATE.PLAY:
        Debug.Log("Play");
        break;
    default:
        Debug.Log("No active state");
        break;
}
```

---

## 4. Loops

### For Loops

Used when the number of iterations is known.

```csharp
for (int i = 0; i < 5; i++)
{
    Debug.Log(i); // 0 1 2 3 4
}
```

---

### While and Do-While

Used when the stopping condition is more important than the count.

Key difference:

* `while` checks first
* `do-while` runs at least once

```csharp
int num1 = 0;
while (num1 < 10)
{
    Debug.Log(num1);
    num1++;
}

int num2 = 0;
do
{
    Debug.Log(num2);
    num2++;
}
while (num2 < 5);
```

---

### Break and Continue

```csharp
for (int i = 0; i < 10; i++)
{
    if (i % 2 == 0) continue;
    if (i > 8) break;
    Debug.Log(i);
}
```


---

## 5. Arrays 

### Why Arrays Exist

Arrays store **multiple values of the same type** in one structure.

```csharp
int[] scores = { 90, 70, 50 };
```

Access by index:

```csharp
scores[0]; // 90
```

A loop is a common way to process every array element:

```csharp
for (int i = 0; i < scores.Length; i++)
{
    Debug.Log(scores[i]);
}
```

---

### 2D Arrays

Used when data has rows and columns.

```csharp
int[,] grid = new int[2, 3];
```

Access:

```csharp
grid[0, 1];
```

---

## 6. Methods (Functions)

### Why Methods Matter

Methods:
* reduce duplication
* make code readable
* isolate logic

Important rule:
**A method should do one thing.**
If it does more, it probably should be split.

---

### Example

```csharp
void Print()
{
    Debug.Log("Hello World");
}

int MaxInt()
{
    return int.MaxValue;
}

int Sum(int a, int b)
{
    return a + b;
}
```

---

# Next Step
My next step is to turn these isolated examples into a small Unity component that uses an enum for state, arrays for related values, and methods to keep interaction logic organized.
