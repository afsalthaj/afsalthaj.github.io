---
title: 'Fix Points and Y Combinator in Scala'
description: 'A detailed exploration of fix points and the Y combinator in Scala — the foundation before you explore Fix at a type-level.'
pubDate: 'Apr 18 2021'
category: 'the-lab'
---

**Fix point types and Y combinator — in Scala.**

Let's do some math.

If we continuously do `cosine` of 0 and keep on applying `cosine` over the result, we end up in a number finally that gets `fixed` forever. The number is 0.73908513321516067.

```scala
cos ( cos ( cos ( cos (x))))
```

Ofcourse this example is a blatant copy from one of the most wonderful blogs ever written about fix-points in Scheme language — [https://mvanier.livejournal.com/2897.html](https://mvanier.livejournal.com/2897.html).

You can choose to read it. This blog is a mere adoption of the ideas presented in the blog, but in Scala language.

## Fix point being a function

So, yes, the fix-point of `cos` is `x` if `cos(x) = x`. But a fix-point may not be always a real number. It could be even a `type`. A `function` is a `type` indeed.

Sure what does that mean? Well if `fix-point` of a function like `cos` is a `real-number`, and if you say that a `fix-point` can be a `function` itself, that means the following:

> There exists a `function`, whose fix-point can be a `function` itself.

## Show an example

A factorial of a number 3 is 3 * 2 * 1. Its implementation is as follows:

```scala
val factorial: Int => Int =
    n => if (n == 0) 1 else n * factorial(n - 1)
```

Sure, that's easy. But let's say someone asked you to implement the same `factorial` such that the name of the function shouldn't come in the body. Why? I think, answering this `Why` leads to applications that use `Fix Points`.

So, I request you to consider it as a challenge and a first step towards the understanding of `Fix` and `Recursion Schemes` and its wonderful application level usages.

Answering the question, well may be I can do

```scala
def factorial(f: Int => Int): Int => Int =
    n => if (n == 0) 1 else n * f(n - 1)
```

Ah, sure, but that's not a factorial.

Ofcourse, that's not a factorial, so let's call it as `almostFactorial`.

```scala
def almostFactorial(f: Int => Int): Int => Int =
     n => if (n == 0) 1 else n * f(n - 1)
```

Now we need to implement a sensible `factorial` in terms of `almostFactorial`. All of us know, the real factorial exists when the `f` (now staying as an argument in `almostFactorial`) is `almostFactorial` itself.

i.e,

```scala
val factorial: Int => Int = almostFactorial(almostFactorial(almostFactorial(.....)))
```

Well if you try to implement it, you will be writing it forever.

Fine, let's take a different approach then.

```scala
val factorial0: Int => Int = almostFactorial(identity)
```

```scala
factorial0(0) // returns 1 ==> works
factorial0(1) // doesn't work, coz identity(n - 1) == identity(1 - 1) == identity(0) == 0
```

So `factorial0` works only for zero. That's fine for now.

Let's implement for factorial1.

```scala
val factorial1 = almostFactorial(factorial0) // that works
val factorial2 = almostFactorial(factorial1) // that works too
val factorial2_ = almostFactorial(almostFactorial(almostFactorial(identity))) // that works too
val factorialInfinity: Int => Int =
    almostFactorial(almostFactorial(almostFactorial ............. almostFactorial( ......... ))) // forever
```

`factorialInfinity` is a function, which is a fixpoint of `almostFactorial`. Infact `factorialInfinity` is our real `factorial` implementation.

```
factorial = fix-point-of almostFactorial
```

Hmmm. I think its time to figure out what is this `fix-point-of`. Is there a function called `fix-point-of` that allows us to pass `almostFactorial` and return a real `factorial`? In other words, is there a function called `fix-point-of` that takes a function and returns the fix-point of that function.

```scala
def fixPointOf(f: <someFn>): fixPointOf_SomeFn
```

This `fixPointOf` is also called "y combinator". The `Y` combinator is the one that converts a function to its fix-point.

So, let's implement `y` such that it can take a function and returns its fix-point.

```scala
// val factorial = almostFactorial(factorial)
// implies the following:
// If we are building a function called toFixPoint that takes `fn` as an argument then,
// that means the following
// toFixPoint(fn: Fn) = fn(toFixPoint(fn))
// Rename toFixPoint as Y, we will see later why
// Y(fn: Fn) = fn(Y(fn))
```

The above pseudo-code in Scala is

```scala
// (A => A) => (A => A) is aligned to the signature of almostFactorial
def Y[A](f: (A => A) => (A => A)) = f(Y(f))

val factorial = Y(almostFactorial)
// Stack overflow haha
```

Stack overflow is, when you call Y the following thing happens:

```scala
f(Y(f)) == f(f(f(f(f.......))))
```

In other words, it tries to compute the fix-point function for you and it never ends.

Lambda saves us from this stack overflow — in a surprising way.

```scala
def Y[A](f: (A => A) => (A => A)): A => A = f(Y(f)) // Stack unsafe
// same as
def Y[A](f: (A => A) => (A => A)): A => A = f(a => Y(f)(a)) // Stack safe
```

Now my factorial implementation is

```scala
val factorial = Y(almostFactorial)
// factorial(3) is 6
```

Now, that works. However, we could further improve things.

```scala
def Y[A, B](f: (A => B) => (A => B)): A => B = f(a => Y(f)(a)) // Stack safe
val factorial = Y(almostFactorial)
```

## Is our `Y` a combinator? No!

To become a combinator, the implementation of `Y` shouldn't have any free variables in it. Our `Y` is not a combinator — the implementation `f(Y(f))` has a free variable, and that's `Y` itself.

The post then goes through a series of refactorings using `partFactorial`, `Any` type, extracting `almostFactorial`, and building up to a proper Y combinator without free variables:

```scala
def yCombinator[A, B] =
   (f: (A => B) => (A => B)) => {
     val lambdaXFxx = ((x: Any) => f((y: A) => x.asInstanceOf[Any => (A => B)](y)))
     f(lambdaXFxx(lambdaXFxx))
   }

def factorial = yCombinator(almostFactorial)
// Works !!
```

And proves that `yCombinator2(f)` is equivalent to `y(f) = f(y(f))`.

## Generalise y combinator

```scala
def y[A, B] =
   (f: (A => B) => (A => B)) => {
     val lambdaXFxx = ((x: Any) => f((y: A) => x.asInstanceOf[Any => (A => B)](y)))
     f(lambdaXFxx(lambdaXFxx))
   }
```

And in Scala 3:

```scala
def yScala3[A, B] =
   (f: (A => B) => (A => B)) => {
     lazy val lambda:[Z] => Z => (A => B) =
         ([Z] => (z: Z) => f((y: A) => lambda(z)(y)))
     f(lambda(lambda))
   }

def factorial = y(almostFactorial)
```

Not only you learned fix-points, you learned its implementation in Scala through `y f = f (y f)` and proved that there exists a combinator, that is devoid of free variables that can achieve the same result in both strict and lazy languages.

---

*Reference: [The Y Combinator (Slight Return)](https://mvanier.livejournal.com/2897.html) — one of the most wonderful blogs ever written about fix-points in Scheme.*
