---
title: 'Invariant Functors Unlocked'
description: 'The often-forgotten invariant functor — what it is, how covariant and contravariant functors relate to it, and when you actually need one.'
pubDate: 'Jun 29 2018'
category: 'the-lab'
---

---

We tend to forget this quite often. An invariant functor or an exponential functor is, given `A => B` and `B => A`, it converts type `A` to type `B` in the same context `F[_]`. We call this `xmap`.

```scala
trait InvariantFunctor[F[_]] {
  def xmap[A, B](fa: F[A], f: A => B, g: B => A): F[B]
}
```

---

## Covariant Functor

That's the famous `Functor`! Covariant functor implements `xmap` by discarding the function `g: B => A`.

```scala
trait Functor[F[_]] { self =>
  def map[A, B](fa: F[A], f: A => B): F[B]

  def xmap[A, B](fa: F[A], f: A => B, g: B => A): F[B] =
    map(fa, f)
}
```

---

## Contravariant Functor

As expected, it discards `f: A => B` and makes use of `contramap` to implement `xmap`.

```scala
trait ContraVariantFunctor[F[_]] {
  def contramap[A, B](fa: F[A], g: B => A): F[B]

  def xmap[A, B](fa: F[A], f: A => B, g: B => A): F[B] =
    contramap(fa, g)
}
```

---

## Example for Contravariant Functor

```scala
// Write Json. In this case the type parameters in the type class
// came at the method parameters level (contravariant position), calling for having
// a `Contramap`

trait EncodeJson[A] { self =>

  def toJson(a: A): Json

  def contramap[B](f: B => A): EncodeJson[B] = new EncodeJson[B] {
    def toJson(b: B): Json = self.toJson(f(b))
  }

} // Implies EncodeJson can have an instance of contravariant functor
```

---

## Usage

```scala
case class Something(value: Int)

// We have implicit EncodeJson available for Int.
def toJson(a: Int) = EncodeJson[Int].toJson(a)

def toJson(a: Something): EncodeJson[Something] =
  EncodeJson[Int].contramap { _.value }
```

---

## Example for Covariant Functor

As expected, it is `DecodeJson`, where the type parameter in the type class comes at covariant position (method result).

```scala
trait DecodeJson[A] { self =>
  def fromJson(a: Json): A

  def map[B](f: A => B): DecodeJson[B] = new DecodeJson[B] {
    def fromJson(a: Json): B = f(self.fromJson(a))
  }
}
```

---

## Note

If type parameters are at covariant position, that means the method return contains the type.

If type parameters are at contravariant position, that means the method parameters contain the type.

---

## When is invariant functor?

We may have types at covariant (output) or contravariant (input) position. However, we may sometimes deal with both covariance and contravariance in the same type class.

Let's bring in EncodeJson and DecodeJson into one type class.

## EncodeJson and DecodeJson

```scala
trait CodecJson[A] { self =>
  def fromJson(a: Json): A
  def toJson(a: A): Json

  def xmap[B](f: A => B, g: B => A): CodecJson[B] =
    new CodecJson[B] {
      def fromJson(a: Json): B = f(self.fromJson(a))
      def toJson(b: B): Json = self.toJson(g(b))
    }
}
```

---

## Functor but invariant

So an individual `map` or `contramap` to upcast (or downcast) an A to B in the context of `F[_]` is not possible if `F` has types both in covariant and contravariant positions. It means, `F` has to have an invariant functor for it!

## Apply, Applicative to Divide, Divisible

We saw the contravariant version of functor. We will see the contravariant version of `Apply`, which is called `Divide` and how that can be more powerful if `EncodeJson` had an instance of `Divide` in the next blog. Along with it, we will discuss more on `Apply` and `Applicative` and how `Divide` and `Divisible` form the hierarchy!
