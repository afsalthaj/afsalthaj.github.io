---
title: 'Square is a Monad Join of a Function'
description: 'How do you implement square (or double) using Monads? Use the monad instance of a function and then join.'
pubDate: 'Oct 18 2020'
category: 'the-lab'
---

**How do you implement square (or double) using Monads?**

Quite simple: Use the monad instance of a function and then `join` on a function that returns a function.

How on earth does that work?

You know the signature of Monad join.

```haskell
join :: Monad f => f (f a) -> f a
join ffa = ffa >>= id
```

Consider `data Optional a = Full a | Empty` has a monad instance. This implies:

```haskell
>> join (Full (Full 1))
 Full 1
```

In this case, `f` is `Optional`, and `ffa` is `Full (Full 1)`

When you replace `Optional` to be a function `f: t -> a`, then `ffa` is `f: t -> ( t -> a )`.

As an example:

```haskell
>> ffa = \x -> (\y -> x * y)
>> ffa 2 3
 6
```

`ffa = \x -> (\y -> x * y))` is same as `ffa = (*)`

Thinking along the same lines, calling `join` on `ffa` to return `fa` means converting `t-> (t -> a)` to `t -> a`

Let's do that:

```haskell
>> :type (join (*))
 (join ffa) :: Num a => a -> a
```

`join (*)` returns a function `Int -> Int` effectively.

```haskell
>> join (*) 10
 100
```

This implies:

```haskell
>> square = join (*)
>> double = join (+)
```

Yea, that was more of a fun. But you can sort of guess that monad instance of a function `(->) t` involves passing the same argument twice to a binary function. I will explain this blog with some `Scala` later, although I found it a little less intuitive considering I cannot write `join(*)` or `(*).join` after the required imports from cats/scalaz. But it will still be a good exercise.
