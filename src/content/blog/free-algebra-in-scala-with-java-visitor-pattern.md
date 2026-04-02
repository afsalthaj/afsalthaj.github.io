---
title: 'Free Algebra in Scala with Java Visitor Pattern'
description: 'Integrating the visitor pattern with Free Monad algebra in Scala — subtype polymorphic dispatch over pattern matching.'
pubDate: 'Apr 14 2018'
category: 'the-lab'
---

---

For those who are familiar with [Free Monad](https://underscore.io/blog/posts/2015/04/14/free-monads-are-simple.html) pattern, we know defining algebra for your operation is an intuitive process. For those who are familiar with visitor pattern in Java, you know Scala has an alternative (to a great extent) using pattern matching. In this blog, we are trying to integrate the visitor pattern (forgetting Scala's highly powerful pattern matching) with the operations which you have encoded using Free Monad algebra. We will see why we did this later on.

Let us go straight into some examples. Below given is a console operation encoded using Free Monad. It is straight forward and in fact the best solution for this particular use-case which is simple enough.

```scala
trait FreeConsoleOperation[A] {
  def toReader: Reader[Unit, A]
}

object FreeConsoleOperation {

  case object ReadLine extends FreeConsoleOperation[String] {
    override def toReader: Reader[Unit, String] = Reader(_ => scala.io.StdIn.readLine())
  }

  case class PrintLine(string: String) extends FreeConsoleOperation[Unit] {
    override def toReader: Reader[Unit, Unit] = Reader(_ => println(string))
  }

  def readLine[A]: Free[FreeConsoleOperation, String] =
    Suspend(ReadLine)

  def printLine(s: String): Free[FreeConsoleOperation, Unit] =
    Suspend(PrintLine(s))

  val f: Free[FreeConsoleOperation, String] = for {
    _ <- printLine("I interact with only console")
    s <- readLine
  } yield s

  val translator = new (FreeConsoleOperation ~> Reader[Unit, ?]) {
    def apply[A](a: FreeConsoleOperation[A]): Reader[Unit, A] = a.toReader
  }

  implicit def readerMonad: Monad[Reader[Unit, ?]] = Reader.readerMonad[Unit]

  def reader: Reader[Unit, String] =
    FreeMonad.runFree[FreeConsoleOperation, Reader[Unit, ?], String](f)(translator)
}
```

Now let us try and avoid the actual interpretation to `F` being part of the data (which represents as an operation) in the above example. For that we are going to use visitor pattern (instead of a pattern match on each data type and implementing the operation).

```scala
object FreeConsoleOperationWithVisitor { module =>
  trait ScalazConsoleVisitor[A] {
    def visit[F[_]](visitor: ScalazConsoleVisitor.Visitor[F]): F[A]
  }

  type ScalazConsoleVisitorFree[A] = Free[ScalazConsoleVisitor, A]

  object ScalazConsoleVisitor {

    trait Visitor[F[_]] extends (ScalazConsoleVisitor ~> F) {
      def apply[A](fa: ScalazConsoleVisitor[A]): F[A] = fa.visit(this)

      def readLine: F[String]

      def printLine(string: String): F[Unit]
    }

    case object ReadLine extends ScalazConsoleVisitor[String] {
      def visit[F[_]](visitor: Visitor[F]): F[String] = visitor.readLine
    }

    case class PrintLine(s: String) extends ScalazConsoleVisitor[Unit] {
      def visit[F[_]](visitor: Visitor[F]): F[Unit] = visitor.printLine(s)
    }
  }

  import ScalazConsoleVisitor._

  def printLine(s: String): ScalazConsoleVisitorFree[Unit] = Suspend(PrintLine(s))
  def readLine: ScalazConsoleVisitorFree[String] = Suspend(ScalazConsoleVisitor.ReadLine)

  val f: Free[ScalazConsoleVisitor, String] = for {
    _ <- printLine("I interact with only console")
    s <- readLine
  } yield s

  implicit def readerMonad: Monad[Reader[Unit, ?]] = Reader.readerMonad[Unit]

  def reader: Reader[Unit, String] =
    FreeMonad.runFree[ScalazConsoleVisitor, Reader[Unit, ?], String](f)(
      new Visitor[Reader[Unit, ?]] {
        def readLine: Reader[Unit, String] = Reader(_ => scala.io.StdIn.readLine())
        def printLine(string: String): Reader[Unit, Unit] = Reader(_ => print(string))
      })
}
```

The only difference between the two approaches is, the first one has toReader method as part of the algebra that returns the F. In the second approach, we are saying that there is a visitor which can return F. Obviously the visitor interface will consist of the exact operation as an abstraction.

Doobie is a perfect example in which the above pattern is widely used.
The working version of the two codebase is in here:

- https://github.com/afsalthaj/supaku-sukara/blob/master/src/main/scala/com/thaj/functionalprogramming/exercises/part4/FreeConsoleOperation.scala
- https://github.com/afsalthaj/supaku-sukara/blob/master/src/main/scala/com/thaj/functionalprogramming/exercises/part4/FreeConsoleOperationWithVisitor.scala

### Let's explain

A use case where we use pattern matching is a free monad algebra where operations are encoded as data, and you generally have an interpreter that matches on each data and corresponding logic is written then and there itself. Potentially they (should) return a result under the effect `F`.

Now you might wonder 👀 "oh what if I have dozens of such pattern match to be done, and is that the place to realise your operations?" Yes, as you might have thought, we are missing an abstraction in this process.

The above visitor pattern is a solution (or one of the dozens of patterns) that we can follow to abstract out this natural transformation.

Now there is a visitor interface which lists down all the operations (not as data but simple methods) which takes the actual inputs and returns the desired output under the effect F. It is the implementation of the visitor pattern that is going to act as your translator, and that's done through the apply method of visitor.

```scala
trait Visitor[F[_]] extends (ScalazConsoleVisitor ~> F) {
  def apply[A](fa: ScalazConsoleVisitor[A]): F[A] =
    fa.visit(this)
  ...
}
```

When you pass the visitor implementation (or translator or natural transformation) along with your `Free` program, in effect what happens is at every node in the tree of your program, the operations are realised using the visitor that you have injected in every node of `ScalazConsoleVisitor`.

### Subtype polymorphic dispatch and pattern matching

The above pattern boils down to selecting subtype polymorphic dispatch which requires one off vtable reference over pattern match which is encoded as a big if else statement in byte code that can question performance. More on this coming soon.
