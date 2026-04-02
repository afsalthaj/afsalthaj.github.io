---
title: 'Combine Free Monad Algebra with Scalaz'
description: 'Combining various algebras defined across the application using Free Monad in Scalaz — and a word of caution on when Free is worth it.'
pubDate: 'May 1 2018'
category: 'the-lab'
---


Here is my gist that combines the various algebra defined in various parts of the application, using **Free Monad** within **Scalaz**! For those who are impatient, jump straight to line number 58, that handles what Scalaz is missing!

```scala
package com.thaj.functionalprogramming.exercises.part4

import scalaz.{ Scalaz, _ }
import Scalaz._

// Thanks to https://underscore.io/blog/posts/2017/03/29/free-inject.html
object CombineFreeInScalaz {
  sealed trait Logging[A]
  case class Info(s: String) extends Logging[Unit]

  sealed trait BridgeExec[A]
  case class PrintBridge(s: String) extends BridgeExec[Unit]

  // This is just for describing how things work, and doesn't need to defined in scalaz.
  trait Inject[F[_], G[_]] {
    def inj[A](fa: F[A]): G[A]
  }

  // Inject implicits exists in scalaz, pointed out here for better understandability.
  implicit def injectCoproductLeft[F[_], X[_]]: Inject[F, Coproduct[F, X, ?]] =
    new Inject[F, Coproduct[F, X, ?]] {
      def inj[A](fa: F[A]): Coproduct[F, X, A] = Coproduct.leftc(fa)
    }

  // Inject implicits exists in scalaz, pointed out here for better understandability.
  // It is similar to the above implicit definition for left, however, we assume that the right can be `R`
  // specifiying it could be another coproduct or in fact it could be anything, and we use recursive implicit
  // resolution.
  implicit def injectCoproductRight[F[_], R[_], X[_]](implicit I: Inject[F, R]): Inject[F, Coproduct[X, R, ?]] =
    new Inject[F, Coproduct[X, R, ?]] {
      def inj[A](fa: F[A]): Coproduct[X, R, A] = Coproduct.rightc(I.inj(fa))
    }

  // Sadly, the above definition doesn't take care of the fact that what if R =:= F
  implicit def injectReflexive[F[_]]: Inject[F, F] =
    new Inject[F, F] {
      def inj[A](fa: F[A]): F[A] = fa
    }

  // A helper lift function that can lift any of your algebra to a Coproduct that defines your entire app.
  def inject[F[_], C[_], A](fa: F[A])(implicit m: Inject[F, C]) = Free.liftF[C, A](m.inj(fa))
  
  // However, we have  individual interpreters for each component in the app.
  // But what we need is an interpreter that interprets the coproduct to some unified effect.
  // Copying cats or in fact turned out to be cats implementation
  def mixInterpreters[F[_], G[_], H[_]](f: F ~> H, g: G ~> H): Coproduct[F, G, ?] ~> H = {
    new (Coproduct[F, G, ?] ~> H) {
      def apply[A](fa: Coproduct[F, G, A]): H[A] = {
        fa.run match {
          case -\/(ff) => f(ff)
          case \/-(gg) => g(gg)
        }
      }
    }
  }

  // A helper to access mixInterpreters
  implicit class MixInterpreterOps[F[_], H[_]](val f: F ~> H) {
    def or[G[_]](g: G ~> H): Coproduct[F, G, ?] ~> H = mixInterpreters[F, G, H](f, g)
  }

  // Lifted first algebra to a Corproduct
  private val logAsCoproduct: Free[Coproduct[Logging, BridgeExec, ?], Unit] =
    inject[Logging, Coproduct[Logging, BridgeExec, ?], Unit](Info("printLogging"))

  // Lifted second algebra to a Corproduct
  private val bridgeCoproduct: Free[Coproduct[Logging, BridgeExec, ?], Unit] =
    inject[BridgeExec, Coproduct[Logging, BridgeExec, ?], Unit](PrintBridge("pringBridge"))

  // Interpreter 1
  private def runLogging: Logging ~> Id = new (Logging ~> Id) {
    def apply[A](fa: Logging[A]): Id[A] = fa match {
      case Info(x) => println(x)
    }
  }

  // Interpreter 2
  private def runBridge: BridgeExec ~> Id = new (BridgeExec ~> Id) {
    def apply[A](fa: BridgeExec[A]): Id[A] = fa match {
      case PrintBridge(x) => println(x)
    }
  }

  // App interpreter
  val interpreter: Coproduct[Logging, BridgeExec, ?] ~> Scalaz.Id = runLogging.or(runBridge)

  // Your free program that is easily testable.
  val program: Free[Coproduct[Logging, BridgeExec, ?], Unit] =
    for {
      _ <- logAsCoproduct
      _ <- bridgeCoproduct
    } yield ()

  // Call this !
  def runThis = program.foldMap(interpreter)
}

```

Well, that was useless toy example.

I think, with my experience with Free (learning scalaz, learning the red book, reading Free things, Runar's paper on Trampolining to Free and in fact implementing free things in production with Scala), I can say operations as data with Free is attractive, **but that can bring significant set of boiler plates that is strong enough to damage the entire design of the app if you are doing something non-trivial**. So you need to really consider the complexity of your app before you try to make it simple with Free and find ways to hide away boilers from business logic. A blog can't be your source of truth as most of them including this one talks Free using its constructs.

Back to the tangent, what happens if we have three algebras? Well, that was kind of a terrible fight with Scala type system but that's fine for me personally! **I will also consider the library [iotaz](https://github.com/frees-io/iota/blob/master/docs/scalaz.md) to achieve the same with less boiler plates.**


```scala
import scalaz.{Scalaz, _}
import Scalaz._

// Thanks to https://underscore.io/blog/posts/2017/03/29/free-inject.html
object CombineFreeInScalaz {
  sealed trait Logging[A]
  case class Info(s: String) extends Logging[Unit]

  sealed trait BridgeExec[A]
  case class PrintBridge(s: String) extends BridgeExec[Unit]

  sealed trait BridgeExe1c[A]
  case class PrintBridge1(s: String) extends BridgeExe1c[Unit]

  // This is just for describing how things work, and doesn't need to defined in scalaz.
  trait Inject[F[_], G[_]] {
    def inj[A](fa: F[A]): G[A]
  }

  // Inject implicits exists in scalaz, pointed out here for better understandability.
  implicit def injectCoproductLeft[F[_], X[_]]: Inject[F, Coproduct[F, X, ?]] =
    new Inject[F, Coproduct[F, X, ?]] {
      def inj[A](fa: F[A]): Coproduct[F, X, A] = Coproduct.leftc(fa)
    }

  // Inject implicits exists in scalaz, pointed out here for better understandability.
  // It is similar to the above implicit definition for left, however, we assume that the right can be `R`
  // specifiying it could be another coproduct or in fact it could be anything, and we use recursive implicit
  // resolution.
  implicit def injectCoproductRight[F[_], R[_], X[_]](implicit I: Inject[F, R]): Inject[F, Coproduct[X, R, ?]] =
    new Inject[F, Coproduct[X, R, ?]] {
      def inj[A](fa: F[A]): Coproduct[X, R, A] = Coproduct.rightc(I.inj(fa))
    }

  // Sadly, the above definition doesn't take care of the fact that what if R =:= F
  implicit def injectReflexive[F[_]]: Inject[F, F] =
    new Inject[F, F] {
      def inj[A](fa: F[A]): F[A] = fa
    }

  // A helper lift function that can lift any of your algebra to a Coproduct that defines your entire app.
  def inject[F[_], C[_], A](fa: F[A])(implicit m: Inject[F, C]) = Free.liftF[C, A](m.inj(fa))

  // However, we have  individual interpreters for each component in the app.
  // But what we need is an interpreter that interprets the coproduct to some unified effect.
  // Copying cats or in fact turned out to be cats implementation
  def mixInterpreters[F[_], G[_], H[_]](f: F ~> H, g: G ~> H): Coproduct[F, G, ?] ~> H = {
    new (Coproduct[F, G, ?] ~> H) {
      def apply[A](fa: Coproduct[F, G, A]): H[A] = {
        fa.run match {
          case -\/(ff) => f(ff)
          case \/-(gg) => g(gg)
        }
      }
    }
  }

  type SubApp[A] =  Coproduct[BridgeExec, BridgeExe1c, A]
  type App[A] = Coproduct[Logging, SubApp, A]

  // A helper to access mixInterpreters
  implicit class MixInterpreterOps[F[_], H[_]](val f: F ~> H) {
    def or[G[_]](g: G ~> H): Coproduct[F, G, ?] ~> H = mixInterpreters[F, G, H](f, g)
  }

  // Lifted first algebra to a Corproduct
  private val logAsCoproduct: Free[ App, Unit] =
    inject[Logging, App, Unit](Info("printLogging"))

  // Lifted second algebra to a Corproduct
  private val bridgeCoproduct: Free[App, Unit] =
    inject[BridgeExec, App, Unit](PrintBridge("pringBridge"))

  // Interpreter 1
  private def runLogging: Logging ~> Id = new (Logging ~> Id) {
    def apply[A](fa: Logging[A]): Id[A] = fa match {
      case Info(x) => println(x)
    }
  }

  // Interpreter 2
  private def runBridge: BridgeExec ~> Id = new (BridgeExec ~> Id) {
    def apply[A](fa: BridgeExec[A]): Id[A] = fa match {
      case PrintBridge(x) => println(x)
    }
  }

  private def runBridges: BridgeExe1c ~> Id = new (BridgeExe1c ~> Id) {
    def apply[A](fa: BridgeExe1c[A]): Id[A] = fa match {
      case PrintBridge1(x) => println(x)
    }
  }

  val sub: ~>[Coproduct[BridgeExec, BridgeExe1c, ?], Scalaz.Id] = runBridge.or(runBridges)
  // App interpreter
  val interpreter: App ~> Scalaz.Id = runLogging.or[Coproduct[BridgeExec, BridgeExe1c, ?]](sub)

  // Your free program that is easily testable.
  val program: Free[App, Unit] =
    for {
      _ <- logAsCoproduct
      _ <- bridgeCoproduct
    } yield ()

  // Call this !
  def runThis = program.foldMap(interpreter)
}

```

Thanks developers! Have fun developing only robust apps!
