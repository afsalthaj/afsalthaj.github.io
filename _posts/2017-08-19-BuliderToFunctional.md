---
layout: post
title: A simple example of using java builder in a Functional Way!
---

Assume you have 2 optional parameters: `Maybe(firstName), Maybe(lastName)`
And you want to instantiate a `Name` class (Builder) in Java with these parameters, if they exist.
Let us try writing it.

{% highlight scala %}

  new Name
   .withFirstName(param1.getOrElse(..well I dont know))
   
   
  // Oh! That doesn't work. We could try this 
   val s = new Something
   
   (firstName, lastName) match {
     case (Just(f), Just(l)) => (new Name).withFirstName(f).withLastName(l)
     case (Empty, Just(l)) => (new Name).withLastName(l)
     case (Just(f), Empty) => (new Name).withLastName(l)
     case (Empty, Empty) => new Name
   }
 
{% endhighlight %}

Think of ten to twenty classes similar to `Name` with parameters being optional.
 
## A Solution

### State Monad 

{% highlight scala %}

@   // Assume that Name is not a scala class, and is a Java bean kind of thing ; 
@   // Name.withFirstName("afsal").withLastName("thaj").withBlaBla.withFirstName("changingafsalsname").withLastName("thoughtofchangingitagain")
 
@   case class Name(firstName: String, lastName: String) {
      def setFirstName(newFirstName: String): Name = Name(newFirstName, lastName)
      def setLastName(newLastName: String): Name = Name(firstName, newLastName)
    } 

{% endhighlight %}


{% highlight scala %}

@   def buildInstance[A, B](a: Maybe[A])(f: B => A => B) : State[B, Unit] = {
      for {
        instance <- State.get[B]
        modifiedInstance <- State.put(a.cata(f(instance)(_), instance))
      } yield modifiedInstance
    } 
    
    
{% endhighlight %}
    

{% highlight scala %}    

@   val initialStateOfName = Name("wrongfirstname", "wronglastname") 

@   (for {
      _ <- buildInstance[String, Name]("afsal".just)(_.setFirstName)
      _ <- buildInstance[String, Name]("thaj".just)(_.setLastName)
    } yield ()).exec(initialStateOfName) 
res44: Id[Name] = Name("afsal", "thaj")

// What if your lastName parameter was Maybe.Empty (Optional `None`)

 (for {
      _ <- buildInstance[String, Name]("afsal".just)(_.setFirstName)
      _ <- buildInstance[String, Name](Maybe.Empty[String])(_.setLastName)
    } yield ()).exec(initialStateOfName) 
res37: Id[Name] = Name("afsal", "wronglastname")


// And a very simple thing to note, our initialState is immutable, it hasn't changed
@ initialStateOfName 
res38: Name = Name("wrongfirstname", "wronglastname")

{% endhighlight %}


{% highlight scala %}
  
@   // If you know about only firstName, and doesn't know anything about last Name
@   val initialStateOfName = Name("nonafsal", "thaj") 
@   buildInstance[String, Name]("afsal".just)(_.setFirstName).exec(initialStateOfName) 
res35: Id[Name] = Name("nonafsal", "thaj")

{% endhighlight %}

I have intentionally avoided the use of `State.modify` function in scalaz, since it is less
expressive at this stage. 

### If you don't know State..

You can see some of my code scribblings on State data-type (without scalaz) in the following links. 
You may read them in its order. The comments in code may give you some idea on what is state data type. 
That will make you feel comfortable with some notes in scalaz tutorial (Google).
* https://github.com/afsalthaj/supaku-sukara/blob/master/src/main/scala/com/thaj/functionalprogramming/exercises/part1/PureStatefulAPI.scala
* https://github.com/afsalthaj/supaku-sukara/blob/master/src/main/scala/com/thaj/functionalprogramming/exercises/part1/PureStatefulAPIAdvanced.scala
* https://github.com/afsalthaj/supaku-sukara/blob/master/src/main/scala/com/thaj/functionalprogramming/exercises/part1/PureStatefulAPIGeneric.scala
* https://github.com/afsalthaj/supaku-sukara/blob/master/src/main/scala/com/thaj/functionalprogramming/exercises/part1/PurelyFunctionalImperativeProgramming.scala
