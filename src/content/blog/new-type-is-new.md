---
title: 'NewType is New Now!'
description: 'Let\'s come up with a new mechanism to define new types that is ergonomic, easy to use and devoid of boilerplates.'
pubDate: 'Mar 18 2026'
category: 'the lab'
---

# NewType is New Now!

> Let's come up with a new mechanism to define new types that is ergonomic, easy to use and devoid of boilerplates.

---

For those who need to get straight into the code with explanations as comments, please feel free to jump to:

https://scastie.scala-lang.org/afsalthaj/4rTuhrx6Tw6wohdyaP73bg/2

Others, read on!

---

## Type-driven development

In type-driven development, it is often necessary to distinguish between different interpretations of the same underlying type.

For example, for the underlying type `Int`, there are multiple possible Monoids:

- Sum → empty = 0
- Product → empty = 1

Even if you don’t know what a Monoid is yet, the classic way to distinguish between these interpretations is to create a **newtype**.

A newtype is a **zero-cost specialization** of the underlying type.

It behaves like the original type but carries **different semantics**.

---

## Existential Types

```scala
trait Foo {
  type Type
  def get: Type
}

object X {
  val foo: Foo =
    new Foo {
      override type Type = Int
      override def get: Type = 1
    }

  val int: Int = foo.get
  // Error:
  // found: foo.Type
  // required: Int
}
```

```scala
val int1: foo.Type = foo.get // compiles
val int2: Int = foo.get      // does not compile
```

---

## Initial Approach

```scala
trait NewType[A] {
  type Type
  def wrap(a: A): Type
  def unwrap(a: Type): A
}

def newType[A]: NewType[A] =
  new NewType[A] {
    type Type = A
    override def wrap(a: A): Type = a
    override def unwrap(a: Type): A = a
  }
```

---

## Example: Multiplication Monoid

```scala
val Mult: NewType[Int] = newType[Int]
type Mult = Mult.Type

implicit val multiplyingMonoid =
  new Monoid[Mult] {
    override def empty: Mult = Mult.wrap(1)

    override def combine(x: Mult, y: Mult): Mult =
      Mult.wrap(Mult.unwrap(x) * Mult.unwrap(y))
  }
```

---

## Improving with Subtyping

```scala
trait NewType[A] {
  type Type <: A
  def wrap(a: A): Type
  def unwrap(a: Type): A
}
```

---

## Example: Sum Monoid

```scala
val Sum: NewType[Int] = newType[Int]
type Sum = Sum.Type

implicit val summingMonoid =
  new Monoid[Sum] {
    override def empty: Sum = Sum.wrap(0)

    override def combine(x: Sum, y: Sum): Sum =
      Sum.wrap(x + y)
  }
```

---

## Ergonomics

```scala
trait NewType[A] {
  type Type <: A
  def apply(a: A): Type
}

def newType[A]: NewType[A] =
  new NewType[A] {
    type Type = A
    override def apply(a: A): Type = a
  }

val Sum: NewType[Int] = newType[Int]
type Sum = Sum.Type

implicit val summingMonoid =
  new Monoid[Sum] {
    override def empty: Sum = Sum(0)

    override def combine(x: Sum, y: Sum): Sum =
      Sum(x + y)
  }
```

---

## Higher-Kinded Support

```scala
trait NewType[A] {
  type Type <: A
  def apply(a: A): Type

  def toF[F[_]](fa: F[A]): F[Type]
  def fromF[F[_]](fa: F[Type]): F[A]
}

def newType[A]: NewType[A] =
  new NewType[A] {
    type Type = A
    override def apply(a: A): Type = a

    override def toF[F[_]](fa: F[A]): F[Type] = fa
    override def fromF[F[_]](fa: F[Type]): F[A] = fa
  }

val Mult: NewType[Int] = newType[Int]
type Mult = Mult.Type
```

---

## Example: Lists

```scala
val list1: List[Mult] = List(1, 2, 3).map(Mult(_))

val list2: List[Mult] =
  Mult.toF(List(1, 2, 3))
```

---

## Typeclass Reuse

```scala
trait Eq[A] {
  def eqv(x: A, y: A): Boolean
}
```

Manual:

```scala
implicit val eqMultManual: Eq[Mult] =
  new Eq[Mult] {
    override def eqv(x: Mult, y: Mult): Boolean = x == y
  }
```

Derived:

```scala
implicit val eqInt: Eq[Int] = ???

implicit val eqMult: Eq[Mult] =
  Mult.toF(eqInt)
```

---

## Reverse Conversion

```scala
implicit val eqMult: Eq[Mult] = ???

implicit val eqInt: Eq[Int] =
  Mult.fromF(eqMult)
```

---

## Variance Tricks

If contravariant:

```scala
trait Eq[-A]
```

If covariant:

```scala
trait CovariantTypeclass[+A]
```

---

## Final Thoughts

This is not the final version — better abstractions exist and are evolving.

Credits:

- John De Goes
- Leigh Perry

Further reading:
https://francistoth.github.io/2020/04/11/newtypes.html

---

## Summary

- Newtypes enable **zero-cost abstraction**
- Separate **semantics from representation**
- Improve **type safety without runtime overhead**