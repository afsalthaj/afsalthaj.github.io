---
title: 'Monad Transformers in Scala Unlocked'
description: 'A new mechanism to define new types that is ergonomic, easy to use and devoid of boilerplates.'
pubDate: 'Mar 30 2018'
category: 'the-lab'
---

Let’s start with a question.

Do you think the type `List` is a Monad? Yes, it has got a bind (flatMap) and unit (apply) method that satisfy the requirements to be monad + it follows monad laws. The monad list can also be termed as an `effect` because “given a type A, lifting it (somehow) as List adds new capabilities to it, such that, we can now aggregate over A, find the sum of A and so on and so forth. The type A never had these capabilities when it was existing by itself, until we lifted it to become a List. That was a deep dive straight away. Let’s take a breath now and say — Well, if you lift your type to a Monadic Effect, it now possess more capability. Get into a spaceship and say now YOU are capable of moving to space — Spaceship Monad!

Similarly, when we lift A to the effect `Option`, we say now A has another capability — A can have a defined absence — `None`. Now, we never want to throw `new Exception` to mark the absence of A.

Let’s lift the type A to another effect, `scala.util.Try`. Now A can be a `Failure` or a `Success` and not just A. The type A inherently has the capability to handle failure. I hope, you almost got the point now. 

This is more or less a conceptual understanding of what effects are, and we are naming it to be a “Monad”.  Pause here and play with Monads.


## Effect from a different angle

From another angle, we say any computation that should potentially yield `A` would become more intuitive and useful if it is yielding `A` under an effect, instead of a raw `A`. 
A typical example is trying to get an `account` from an account repository by passing an `Id`. 
If the computation has a return type of `Account`, it means it should always exist. We want the computation’s return type to expose the fact that `account` may or may not exist. 
In other words, it should return an `Account` under an effect — `Option`. Hence you may find the second `get` function in the below example to be more sensible.

```scala
def get[Account, Id](id: Id): Repository => Account = ???

def get[Account, Id](id: Id): Repository => Option[Account] = ???
```

## Was that effect enough?

Well, we said the repository may or may not provide an account, and hence we returned an `Option` of account. We know the computation is under the effect Option. But is that enough to depict the behaviour of a database operation? What if the operation resulted in a database failure and you want to tell that to the user of the function `get`? This simply means the result should be either a database exception or `Option[A]`. In other words, we need to lift `Option[A]` to another effect that can handle a database exception. We can use scalaz’s either `\/` to depict this behaviour. The `get` function hence returns a `DatabaseException \/ Option[A]`. At this point you have fairly a complex return type that is basically a stack of two effects — `Option` and on top of it, `\/[DatabaseException, ?]`.

## Multiple Effects and Monad Transformers

You are almost convinced that any computation can yield effects that are stacked upon each other similar to `DatabaseException \/ Option[Account]`. However, stacking the effects leads to difficulty in extracting the actual value that we need to further execute the rest of the computation with Account. We wish the stacked effect was just acting as one single effect — one single Monad, so that we can `flatMap` over it or `map` over it and continue the operation; something like this:

```scala
trait Repository

trait DatabaseException

def get[Account, Id](id: Id): Repository => DatabaseException \/ Option[Account] = ???
```

The only way to make that happen is `Monad Transformers` . 
We are saying we need a single effect that depicts the multiple layered effect. We use scalaz’s `OptionT` monad transformer to depict the effect of returning a value under the effectOption which is in turn, under the effect `\/` .


```scala
{
  sealed trait Account
  case object SavingsAccount extends Account
  case object InvestmentAccount extends Account
}

{
  sealed trait Account
  case object SavingsAccount extends Account
  case object InvestmentAccount extends Account
}

defined trait Account
defined object SavingsAccount
defined object InvestmentAccount

val optionalAccount: Option[Account] = Some(SavingsAccount)

def liftToEitherEffect[A](a: Option[A]): Throwable \/ Option[A] = a.right

val optionalAccountWithEitherEffect = liftToEitherEffect(optionalAccount)
// optionalAccountWithEitherEffect: Throwable \/ Option[Account] = \/-(Some(SavingsAccount))

// At this point, fetching account for further computation has become tedious.

type EitherEffect[A] = Throwable \/ A

val singleLayeredEffect =
  OptionT[EitherEffect, Account] { optionalAccountWithEitherEffect }
// singleLayeredEffect: OptionT[EitherEffect, Account] = OptionT(\/-(Some(SavingsAccount)))

singleLayeredEffect.map { account => account }
// do some computation with account straight away
// res17: OptionT[EitherEffect, Account] = OptionT(\/-(Some(SavingsAccount)))

```

You might need to stare at it for a while. When you had another effect from thin air wrapping your actual effect, you somehow want to make sure that you still have the capability to peal off all your effects with a single operation (in this case, map)and get the value without any sort of nested for comprehensions, and that’s all MonadTransformer does! 
In the above example, the monad transformer `OptionT` converts an effect ofOption layered with `\/[Throwable, ?]` 
to one single effect `OptionT` that makes you feel like it is still an option and you are flatMapping over it.


## Mechanism behind Monad Transformers

For those who want to know the mechanism behind monad transformers, you can easily identify it as composing monads, which is in fact a difficult task unlike applicatives, where the shapes are preserved. 
If you ever tried before to implement general monad composition, then you would have found that in order to implement join for nested monads `F` and `G`, you’d have to write a type such as `F[G[F[G[A]]]=> F[G[A]]` and that can’t be written generally. 
However, if `G` happens to have a traverse instance, we can sequence to turn `G[F[_]]` into `F[G[_]]`, leading to `F[F[G[G[A]]]]`, which in turn allow us to join the adjacent `F` layers as well as the adjacent `G` layers using their respective Monad instances. 
However, take this with a grain of salt. It is not always true, a `Traverse` of `G` will help compose monads always.

The issue of composing monads is often addressed with a custom-written version of each monad that’s specifically constructed for composition. 
This kind of thing is called a monad transformer. 

The `OptionT` transformer mentioned above composes `Option` with any other Monad having a `Traverse` instance.

Also its a general rule of thumb to identify layers as early as possible and get into Transformer as early as possible, a
nd compose your executions without getting bloated. Quite often, we might end make things complicated with transformers and other 
monad abstractions such as `Kleisli`. Something like this:


```scala
```scala
def s: Int => Throwable \/ Option[Int] = ???
// defined function s

type EitherEff[A] = Throwable \/ A
// defined type EitherEff

def s: Int => OptionT[EitherEff, Int] = ???
// defined function s

type OptionTEitherEff[A] = OptionT[EitherEff, A]
// defined type OptionTEitherEff

def s: Kleisli[OptionTEitherEff, Int, Int] = ???
// defined function s

```

My personal approach towards this problem, is to try and avoid the need of composing Monads if possible, because we have some smart monads available in libraries such as scalaz, cats and so forth that allow you to stay away from being complicated. 
Example, a Future that can return a disjunction (multiple layers) can be replaced with a single layer of scalaz.Task. 
If we think, we need to stack multiple effects then make sure you are getting into the monad transformer context as early as possible instead of pealing off abruptly certain part of the context to satisfy compiler.

Hope you enjoyed the read. Have fun!

PS: http://degoes.net/articles/effects-without-transformers