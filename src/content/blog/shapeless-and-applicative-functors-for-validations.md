---
title: 'Shapeless and Applicative Functors for Server Side Validations'
description: 'Deriving validation instances for any entity automatically using shapeless Generic and Scalaz applicative builders.'
pubDate: 'Apr 11 2018'
category: 'the-lab'
---

_This blog was originally published on [Medium](https://afsal-taj06.medium.com/shapeless-and-applicative-functors-together-a-typical-use-case-433111f0a69f)._

---

_(Work in progress, there are typos and inconsistencies, so excuse)_

This is a quick deep dive into shapeless and Scalaz applicative builder pattern working together and solving a use-case for better understanding. You may well be tweaking further to get your stuff done based on what is presented here.

### Audience

This is targeted for those who know [type classes](http://learnyouahaskell.com/types-and-typeclasses) (Haskell type class taken to Scala), Generic Repr in [shapeless](https://github.com/milessabin/shapeless), [applicative functors](https://softwaremill.com/applicative-functor/), [applicative builder pattern](http://eed3si9n.com/learning-scalaz/Applicative+Builder.html) in Scalaz/Cats (and optionally [tagged type](http://eed3si9n.com/learning-scalaz/Tagged+type.html))

### Problem(s)

A typical example of using applicative builders is when you need to validate an entity where the validation of each field in the entity returns an applicative functor. And when you have dozens of such entities (never dealt with it until yesterday as I am writing this) sharing fields across each other, you finally have a bloated boiler plate of Advanced (for some) Scala.

Ok, so how many times have you hacked around validating fields each one returning an applicative and then write long boiler plates of using applicative builder pattern for each of your aggregates in the app? Something like this:

```scala
(column1.validate |@| column2.validate |@| column3.successNel[ValidationError]) { Entity.apply }
```

How many times have you re-written the validation logic for fields that are shared across aggregates, and then write applicative builders explicitly every time?

Or at the very least, how many times you were confused on where to put all of the boiler plates of applicative builders in your application?

### Solution

What do you think of a solution that provides the following as an alternative?

_When you provide validations (only) for every field values in your app that you use in your application:_

- _You get validation for all your entity objects, value objects and aggregates for **FREE**_
- _Return the list of errors or the validated entity for all your entities in your application with just one `|@|` in your entire app._
- _You get a compile time error if you try to use a column that doesn't have a validation instance in any entity or value objects (Well, this is not a big deal you know but sounds good though :D)_

### Let's write some code

The validation behaviour is encoded as a type class, with a validate function returning an applicative functor.


```scala
  import scalaz.ValidationNel

  trait Validation[A] {
    def validate(a: A): ValidationNel[ValidationError, A]
  }

  object Validation {
    implicit def validation[A](implicit a: Validation[A]): Validation[A] = a

    // Inspired from shapeless docs
    def createInstance[A](f: A => ValidationNel[ValidationError, A]): Validation[A]  = {
      a => f(a)
    }

    implicit class Validator[A](a: A) {
      def validate(implicit validator: Validation[A]): ValidationNel[ValidationError, A] =
        validator validate a
    }

    sealed trait ValidationError

    object ValidationError {
      case class InvalidValue(msg: String) extends ValidationError
    // Bla
    }
  }

```

Let's use tagged types instead of primitives just to differentiate your types are your own types.


```scala
import scalaz.syntax.std.option._
import scalaz.{@@, Show, Tag}
import scalaz.syntax.show._

trait Tagger[A] {
  sealed trait Marker
  final type Type = A @@ Marker
  def apply(a: A): Type = Tag[A, Marker](a)
  def unapply(tagged: Type): Option[A] = unwrapped(tagged).some
  def unwrapped(tagged: Type): A = Tag.unwrap(tagged)
}

```

Let's define an aggregate (may not make much sense, doesn't matter)


```scala

    import SuperExchange._
    import scalaz.std.string._

    import scalaz.syntax.validation._
    import SuperExchange._

    case class SuperExchange(id: ExchangeId, name: Name)

    object SuperExchange {
      type ExchangeId = ExchangeId.Type
      object ExchangeId extends Tagger[String]

      type Name = Name.Type
      object Name extends Tagger[String]
    }
    
```

Let's define instances for each field.

```scala
implicit val validateName: Validation[Name] =
  _.successNel[ValidationError]

implicit val validateExchangeId: Validation[ExchangeId]=
  _.successNel[ValidationError]

```

Ok, now we have instances of Validation for each field in SuperExchange. Now our intention is to get an instance for SuperExchange for free.

For that, first let's create an instance for any HList, provided we have the validation instance for its head and tail (which in turns has a validation instance for its head and tail and it goes on recursively until HNil).


```scala
import shapeless.{HList, ::, HNil }
import scalaz.syntax.applicative._
import scalaz.syntax.either._
import scalaz.syntax.validation._

implicit val hnilEncode: Validation[HNil] =
  Validation.createInstance( _.successNel[ValidationError]) //Yea, that's it

implicit def hlistEncoder[H, T <: HList] (
  implicit
    hEncoder: Validation[H],
    tEncoder: Validation[T]
  ): Validation[H :: T] =
   Validation.createInstance {
     case h :: t => (hEncoder.validate(h) |@| tEncoder.validate(t)){_ :: _}
   }

```

Once we have the instance for `HList` (that means we have a validation instance for `Generic.Repr`), and once we have a Generic instance for SuperExchange (which you get for Free from shapeless), we can derive the validation instance for `SuperExchange`.
Let's have that in place.


```scala
implicit def genericValidation[A, R](
  implicit gen: Generic.Aux[A, R], env: Validation[R]
): Validation[A] =
  new Validation[A] { 
    override def validate(b: A) = 
      env.validate(gen.to(b)).map(gen.from) 
  }

// Please note that Generic.Aux[A, R] === Generic[A] {type Repr = R} 
// as we cannot do env: Validation[gen.Repr]

```

You may note that, there is a bit going on with respect to `gen.to` and `gen.from`, but that is just us trying to satisfy the compiler work and it is not something far from the docs of shapeless. When you do `env.validate(gen.to(b))` what you get in return is a `Validation[Generic.Repr]` and not for `A` (which is in fact going to be our aggregate or entity). To get the validation instance for `A` you map it further on the returned applicative and get `A` from `Repr` using `gen.from`.

That's it. Now that you have the instances freely available for any entities that use (and only use) ExchangeId and Name types. Let's test this.

```scala
@ //This is ammonite configured for shapeless

@ implicitly[Validation[SuperExchange]].validate(SuperExchange(ExchangeId("id"), Name("name")))
res48: ValidationNel[ValidationError, SuperExchange] = Success(SuperExchange("id", "name"))


```

Let's work it for other entities that re-use some of the entities, and see if we can forget about applicative builders and be in a nice world.


```scala
@ //This is ammonite configured for shapeless

@ object NewNumber extends Tagger[Int]
defined object NewNumber

@ type NewNumber = NewNumber.Type
defined type NewNumber

@ case class World(name: Name, exchangId: ExchangeId, newNumber: NewNumber)
defined class World

@ implicit val newNumberValidation: Validation[NewNumber] =
   a =>
    if (Tag.unwrap(a) > 10)
      (ValidationError.InvalidValue("NewNumber is greater than 10"): ValidationError).failureNel[NewNumber]
    else
      a.successNel[ValidationError]
newNumberValidation: Validation[Int] = ammonite.$sess.cmd50$$$Lambda$2743/796603018@4e1984de

@ implicitly[Validation[World]].validate(World(Name("name"), ExchangeId("id"), 1))
res51: ValidationNel[ValidationError, World] = Success(World("name", "id", 1))

@ implicitly[Validation[World]].validate(World(Name("name"), ExchangeId("id"), 11))
res52: ValidationNel[ValidationError, World] = Failure(NonEmpty[InvalidValue(NewNumber is greater than 10)])

```

Please note that we have given validation instance for that extra field `newNumber`, else we get a compile time error.

Conceptually it is very pleasing: "Provide validations for all the fields, and any entities that use them are automatically validated".

Stare at these codes for a while, and I will probably come up with a better explanation of the concepts later on.

Thanks and have fun!
