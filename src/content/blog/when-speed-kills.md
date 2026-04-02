---
title: 'Efficient Development Is a Myth. Or Is It?'
description: 'When Speed Kills your Product, Reputation and Team Morale.'
pubDate: 'Apr 12 2020'
category: 'the-lab'
---

This is more of a reflection based on my experience across multiple projects and products that I have been part of as a consultant.

## The illusion of efficiency

There is a common assumption in software development that faster development means better efficiency. It sounds reasonable, and in the middle of delivery it even feels correct — tickets are moving, pull requests are getting merged, and there is visible progress every day. But speed of development is not efficiency. It is only movement, and movement in the <span class="accent-red">wrong</span> direction compounds faster than anything else.

## <span class="accent-red">Finish-Fast</span> syndrome

I coined that term myself, but I am sure it is not new.  <span class="accent-red">Urge to finish fast</span> is a developer's <span class="accent-red">worst enemy</span>. It is the one thing that can turn a good developer into a bad one, and it is the one thing that can turn a good project into a failed one.

We all have this syndrome in some or other way. We want to finish things quickly. Either we might be <span class="accent-red">competing with your colleagues</span> in terms of delivery, or <span class="accent-red">being insecure about your own job</span> thinking what others might feel if you took longer for a task, or simply being under pressure <span class="accent-red">to meet deadlines</span>.
In all cases, the instinct is the same — push harder, deliver more. But that instinct is exactly where things start going wrong.

## The chain reaction nobody plans for

Most teams unknowingly optimise for higher-level completeness while ignoring foundational correctness. If we break it down into levels — L1 being basic functionality, L2 intermediate behaviour, and L3 more complex flows — what often happens is that L3 gets implemented and demonstrated, L2 mostly behaves as expected, but L1 is not reliably correct across all scenarios.

The focus is on getting things working, not necessarily getting them working correctly from all angles. It shows up during UAT, usually in the form of “basic things are not working”. It's even worse, when your team mate finds a bug in basic functionality. We are not talking about edge cases yet, but just the basic stuff!

At that point, fixing L1 is no longer a small change. L1 carries assumptions that L2 and L3 are built upon. So when L1 is corrected, it breaks parts of L2. Fixing L2 then cascades into L3.

Meanwhile, UAT is waiting, deadlines remain unchanged, and pressure increases. In many cases, the pressure is not even from leadership initially, but from UAT, because delays on development directly reduce their testing window.

## So why are we really speeding?

If the reason is <span class="accent-red">too many features</span>, question them.

If the reason is <span class="accent-red">scope of features</span>, re-evaluate and reduce them.

If the reason is <span class="accent-red">critical bug fix</span>, learn the art of hot fix then do post-mortem.

<blockquote class="pull-quote-pop">
<p>If you don't do any of these, then of course your only solution is to speed up development. Look how much you had to ignore to get to this conclusion!</p>
</blockquote>

## Should the Fastest Developer Be  <span class="accent-red">Celebrated</span> or Watched with  <span class="accent-red">Caution</span> ?

It is team lead's responsibility to not under-estimate the slowness and not over estimate the fastness.

My answer to whether a fast developer should be celebrated or not is - <span class="accent-red">Celebrate, but be Cautious</span>. This is a very nuanced topic. 

<blockquote class="pull-quote-pop">
<p>The developer who quietly writes reliable, low-defect code often goes unnoticed, while those who create problems and resolve them quickly are celebrated — seen as indispensable to the team.</p>
</blockquote>

In fact, this inspired me to write this blog, and I hope it resonates with many of you.

## So is speed good for startups and bad for big companies?

If you want me to give a simple answer, I would say "right speed" is good for both, and "wrong speed" is bad for both. Let me demystify what I mean by "right speed" and "wrong speed".

<blockquote class="pull-quote-pop">
<p>Speed may <span class="accent-red">kill</span> startup itself - Yes, I said it!</p>
</blockquote>

The danger of uncontrolled speed is actually more pronounced in startups than in big firms. Yes, it is counterintuitive. In a startup environment, if there is no control over your speed, it often ends up skipping necessary thought processes that are crucial for the product's success.

Speed allows developers to bypass questions such as: **How simple is it for users to use the most basic feature of the product?**, **Is this feature really necessary?**,  
**Should our product depend on this other firm which is dying?** etc. All black-hats are less preferred in start-ups in the excitement of getting some toy use-case working.

On the other side of the fence, controlled speed often has the trait of **cautiousness** and **cautiousness** gives any product more edge. If not cautious, you end up with a product that is not really usable, and that is the worst thing for a startup.

<blockquote class="pull-quote-pop">
<p>You built something faster but complex for users. Instead slow down on how to make things simple for users and take 1 more day just thinking!</p>
</blockquote>

What about **planning**? Can a great planning solve all these issues?  Well the problem is, if you are planning for speed, you are not really planning for the right things. In fact, most often we end up breaking the "First impression is the last impression" rule, and we are not going to get a second chance.  Do you really think an experimental user would come back, if the first thing they see is an extreme complexity? 90% of users will not come back, and the remaining 10% will be your friends and family. That is not a good start for a startup.

<blockquote class="pull-quote-pop">
<p>Speed may <span class="accent-red">kill</span> your reputation in big firms</p>
</blockquote>

Now, in a larger environment (a successful startup or big firms), the reputation of a developer becomes more important than speed. Why? Because things here are immediately validated — within the team (UAT, for instance), and more importantly, by users.

At the same time, you still need to deliver on time. But you are not expected to move faster than necessary. If you have a good team lead, they will help define the right deadlines.

What this means is, it’s not speed that matters here. What matters is doing things correctly within the given time. Sometimes it may feel slower, but in reality, it is not.

It is the right speed that allows you to deliver something reliable — something others can build on top of.

If you are known for delivering reliable work, others will trust it and build on top of it. If you are known for delivering things quickly but with instability, others will be cautious about using your work — and that slows down the entire team.

## End of the day..

Speed, by itself, does not win. In many cases, it reduces the probability of success for ourselves and our company, because it increases the likelihood of foundational issues being overlooked.

If you demystify everything what's said above into one sentece, that would be: **Speed is just the visible symptom!**