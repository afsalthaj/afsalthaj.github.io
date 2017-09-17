---
layout: post
title: A simple example of using java builder in a Functional Way!
---

{% highlight scala %}

@   def buildInstance[A, B](a: Maybe[A])(f: B => A => B) : State[B, Unit] = {
      for {
        instance <- State.get[B]
        modifiedInstance <- State.put(a.cata(f(instance)(_), instance))
      } yield modifiedInstance
    } 

{% endhighlight %}


{% highlight scala %}

@   // Assume that Name is not a scala class, and is a Java bean kind of thing ; 
@   // Name.withFirstName("afsal").withLastName("thaj").withBlaBla.withFirstName("changingafsalsname").withLastName("thoughtofchangingitagain")
 
@   case class Name(firstName: String, lastName: String) {
      def setFirstName(newFirstName: String): Name = Name(firstName, lastName)
      def setLastName(newLastName: String): Name = Name(firstName, newLastName)
    } 

{% endhighlight %}
    

{% highlight scala %}    

@   // another example on client side 
@   val initialStateOfName = Name("wrongfirstname", "wronglastname") 
@   (for {
      _ <- buildInstance[String, Name]("afsal".just)(_.setFirstName)
      _ <- buildInstance[String, Name]("thaj".just)(_.setLastName)
    } yield ()).exec(initialStateOfName) 
res33: Id[Name] = Name("wrongfirstname", "thaj")

{% endhighlight %}


{% highlight scala %}
  
@   // just 1 state change? 
@   // 1 simple example on the client side 
@   val initialStateOfName = Name("nonafsal", "thaj") 
initialStateOfName: Name = Name("nonafsal", "thaj")
@   buildInstance[String, Name]("afsal".just)(_.setFirstName).exec(initialStateOfName) 
res35: Id[Name] = Name("nonafsal", "thaj")

{% endhighlight %}
