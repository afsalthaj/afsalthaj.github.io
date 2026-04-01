---
title: 'When Java Tried to Be Functional: The Broken Optional'
description: 'Java borrowed Optional from FP and broke the Functor law. A story of copying ideas fast, shipping half-reliably, and the mess it leaves behind.'
pubDate: 'Jun 11 2021'
category: 'the-lab'
---

This is a blatant copy of Atlassian's https://blog.developer.atlassian.com/optional-broken/ .

You can jump into below snippet and understand what's the issue, and choose to skip rest of the blog.

```java
public class Silliness {
  public static void main(String[] args) {
    Map<String, String> mapp = new HashMap<>();
    mapp.put("afsal", null);

    Optional.ofNullable("afsal")
      .map(mapp::get).map(String::toUpperCase)); // works but wrong

    Optional.ofNullable("afsal")
      .map(v -> mapp.get(v).toUpperCase())); // fails, but right
  }
}
```

An FP enthusiast may say, `java.Optional` doesn't follow Functor law, while it inherently tried to become a `Functor`.

```
functor.map(f).map(g) === functor.map(g compose f)
```

## The Cost of Copying Ideas Fast

There's something quietly dangerous about borrowing a concept from one paradigm and dropping it into another without carrying over the rules that made it work in the first place. Java's `Optional` is a textbook case. Someone on the JDK team looked at `Option` in Scala (or `Maybe` in Haskell), thought _"that's neat, let's add it"_, probably got a pat on the back for the contribution, and shipped it — without the one property that made the original idea reliable: the Functor law.

And that's the thing about moving fast with half the understanding. It _looks_ like progress. It _feels_ like progress. The API compiles, the tests pass (because no one wrote the test that matters), and everyone moves on. Meanwhile, every developer downstream inherits a subtle, silent contract violation that turns their `map` chains into landmines. The kind of bug that doesn't blow up in a unit test — it blows up in production, on a Friday, when someone maps over a `null` that was never supposed to exist.

This isn't unique to Java. It's a pattern you see everywhere: a concept gets popularised, someone copies the syntax but not the semantics, ships it under deadline pressure, and the rest of us spend years working around the gap. The irony is that _not_ adding `Optional` would have been the more honest choice. At least then, developers would know they're on their own with `null`. Instead, Java gave them a false sense of safety — which, arguably, is worse.

## How about in Scala (and other comparatively better languages)?

Well the answer is if `null` is considered a value (may be for some legacy/bad reasons), then `Some(null)` is possible in Scala, unlike Java, and thereby holding on to the above law. PS: Avoid nulls as much as possible.

```scala
@ val map: Map[String, String] = Map("afsal" -> null)
map: Map[String, String] = Map("afsal" -> null)

@ Some("afsal").map(v => map(v)).map(_.toUpperCase)
java.lang.NullPointerException
  ammonite.$sess.cmd10$. $anonfun$res10$2(cmd10.sc:1)
  scala.Option.map(Option.scala:243)
  ammonite.$sess.cmd10$.<clinit>(cmd10.sc:1)

@ Some("afsal").map(v => map(v).toUpperCase)
java.lang.NullPointerException
  ammonite.$sess.cmd11$. $anonfun$res11$1(cmd11.sc:1)
  scala.Option.map(Option.scala:243)
  ammonite.$sess.cmd11$.<clinit>(cmd11.sc:1)
```

There is something more to this, than being "sadly" happy about that NullPointerException. The question "Can NullPointerException happen in Scala too"?

Answer is Yes, but hardly seen. The reason, conceptually is, Scala is that language where it forces you as much as it can to pull you out from doing the wrong thing. In other words, if you begin on the right track (Example: use `Option`), then you end up in the right track due to a strong compiler being your companion.

Show me code yeah?
The exact code copy paste of Java code doesn't compile in Scala.

```scala
val map: Map[String, String] = Map() // Just nothing

Some("afsal").map(v => map.get(v).toUpperCase)
// Compile failure, coz map.get(v) returns an Option, and it is!

// This leads a developer to do the following
Some("afsal").flatMap(v => map.get(v)).map(_.toUpperCase)
```

Due to a variety of similar behaviour of functions in Scala, the very possibility of `Map("afsal" -> null)` hardly occurs. If you are used to the "real"/"lawful" `map` and `flatMap` in Scala, then you hardly create a NullPointerException too. Just because the language is better, we sort of became a reliable developer too.

This is exactly that small edge that we always see amongst developers who are complaining about language semantics and sounding over-opinionated with FP languages. Most of these developers are just productively lazy as they want the compiler forcing them at an early stage to do the right thing at their workplace.

Now you can ask "what if I am that inexperienced developer with Scala language, and used `map(v)` instead of `map.get(v)`?". Well the answer, is you still don't get a NullPointerException — instead you get a NoSuchElementException, and you know what exactly happened!

End of the day, those stupid snippets above can be mapped to a bigger picture — such as folding over a stream of transactions based on a particular field called "account-balance" and not always the account balance exists in the stream and if your fold logic has a Java `Optional` and subsequent `map` usages, then you sort of see the implications.

## Why Python now from no-where?

For self satisfaction.

Python returns `None` if it doesn't know anything. It can even return `1` in `if` branch and `None` in `else` branch. How about that?

I know there are no types. Ok, then what is this `None` for? Is it "trying" to represent the absence of something?

To be fair, Python can be useful in many places and is undoubtedly one of the most popular languages, but let's don't squeeze it in for anything and everything and over-advocate it.

It is a language that is (deceivingly) simple (opposite of complex) to make it work, but hard (opposite of easy) to make it work _reliably_.

I was motivated to write this blog due to dozens of bugs I created when writing Java and Python due to the exact two reasons mentioned above. May be that I need more experience…

Cheers and let's try writing good software!
