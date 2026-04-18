---
title: 'The AI Divide: When Everyone Can Solve Fast, Eliminators Win'
description: 'When motion is cheap, direction is scarce: shrink invalid state and needless machinery — not typing faster. Regulated, internal, startup, or “we barely use AI”: the multiply-vs-eliminate divide still runs through your stack, incentives, and who you keep.'
pubDate: 'Apr 2 2026'
category: 'the-lab'
---

<h2 class="h2-accent-warm">Before you read</h2>

You might find parts of this post familiar — even repetitive.

After every major technology revolution, layoffs have often followed. The people who remained — usually the last ones anyone would let go — were rarely chosen randomly. They were kept because they possessed fundamental qualities that are hard to ignore.

The current technology revolution — the **AI** wave — is **more aggressive** than the cycles we have lived through before. What keeps you valuable and employable is still the same fundamental qualities. Only the **pace** changes: because the revolution is **aggressive**, so the solution has to be **seen, expanded and applied aggressively** too. 

Many of us are already aware of fundamentals discussed here, but a mere awareness don't make us special anymore, but aggressive execution of them does.

This blog aims to be a reminder of those fundamentals, and a call to action to apply them aggressively. It is **not a roster of tools to master in 2026, nor a grab-bag of productivity tips**.

This isn’t **preaching** — just an observation drawn from years of thinking through these problems across a range of projects.

<h2 class="h2-accent-warm">With that out of the way</h2>

AI makes it easy to solve problems quickly, and almost anyone can play that game. The ones who get ahead **think first** — then **eliminate** problems instead of trying to fix everything.

Tools accelerate whatever habit you already have — including the habit of treating symptoms faster instead of removing causes. That is why raw speed stops impressing almost immediately: volume was never the hard part.

## Employability in today's AI world

First and foremost, no one can predict the future — and I’m certainly in no position to even pretend I can. One strategy could be optimism. You know, the same kind we all have when we confidently think, “Yeah, earthquakes? Not happening in my city.” It sounds illogical, but if it gives peace of mind, why not!

If we really need to talk about employability in the context of AI, here is what I think. Employability already tilts toward people **who think about what they are building — not only how fast they clear a board**.


**Fast** is a commodity now. In today's world, fortunately or unfortunately, the more `faster` you are, it may simply imply, you just used `more AI tokens`. There was a time when this was not the case. When you were faster in solving things, the appreciations flowed in. It didn't matter the quality index of what you produce, you were valued because you could rapidly understand complex systems written by others, implement new features quickly, and fix bugs in tangled, difficult codebases.
You kept repeating this pattern in your team, and the steady stream of praise became real fuel that kept your momentum going. You were the Rockstar of the team, and it felt damn good to be in that position.

However, that perspective has started fading fast. The difference in raw speed between you and others is no longer as dramatic as it once was. The gap has narrowed significantly — largely because AI has made “getting things done quickly” far more accessible to everyone.

Your existing reputation might still keep you looking like a rockstar for a while, especially if your team already knows you from before the AI wave. But it’s only a matter of time before perspectives shift.

So let’s ask ourselves honestly:
**Who is the person in the team you would actually fight to keep around?**

## The myth of “Coders lose, Engineers win”

You hear a lazy version of the story: developers get automated, but **system designers** stay safe because their work is “high level.” That map is weak. Models are already trained on architecture — patterns, trade-offs, scaling, production-style designs. With enough context, they can sketch boundaries and talk about failure modes. **No title is “safe”** just because it sounds strategic on a chart.

We often come up with these kind of statements now and then, just to make some noise in the room. If everything had been as black and white as these statements, the whole story of humanity’s survival would have been much easier.

Anyway, here is a better way to think about it.

**“Safe” has more to do with how you show up than what your title says.** Every person on a team **shapes the atmosphere** — how honest the debate is, how much people care about the outcome, and whether the work stays tied to the product and the company you are building. That is not abstract: it shows up in decisions, in code, and in who stays and who burns out.

<blockquote class="pull-quote-pop">
<p>The people who strengthen a team are usually the ones who <strong>set the tone by example</strong>: <strong>loyal</strong> to the mission and the product, <strong>committed to outcomes</strong> instead of individual performance, and finally <strong>create the right waves within the team</strong>.</p>
</blockquote>

<blockquote class="pull-quote-pop">
<p><strong>What makes you create the right wave?</strong> Your <strong>judgement</strong> — at every point: what you build, what you cut, what you refactor, and what you refuse to treat as normal. Your judgement directs the tools you use, and directs the people around you to converge to great outcomes.</p>
</blockquote>

That can come from **great developers** or **great system designers** (or leads, SREs, product-minded engineers — the list is long). **The role name is not the point.** The point is whether you **multiply problems or reduce them**.

**AI does not fill that gap for you — it widens whatever you already reinforce.** Habits of skipping the hard questions turn into volume.

## The Only Divide That Actually Matters

The useful split is not developer versus engineer.

**Some people use AI to create more problems** (more code, more layers, more tests to paper over a messy model). **Others use AI to remove problems** (clearer models, fewer invalid states, less machinery).

Same tools. Opposite outcomes.

That difference affects what you ship and how much ongoing work the system needs. Stack and title matter less than whether you tend to expand mess or reduce it.

**Elimination does not mean doing less engineering.** It means shrinking what the team has to reason about: invalid data you no longer allow at the boundary, services and queues you no longer need because contracts and flows are honest, work you decline because it does not clear a user-value bar. It does **not** mean skipping tests when the model is still fuzzy, skipping observability when people depend on uptime, or pretending operations are optional. Tests, metrics, and runbooks still matter. What ages poorly is using them as a **substitute** for a clear model — papering over ambiguity — instead of using them as **evidence** that a tight model actually holds in production.

**That split does not stay inside the repo.** It eventually shows up in who teams fight to keep when almost everyone can ship code with help from a model.

<blockquote class="pull-quote-pop">
<p><strong>Small bonus, half in jest:</strong> if you keep this frame in mind — clearer intent, tighter contracts, less “just make it work” — your <strong>prompts to coding assistants</strong> tend to get better too. Not the main point; take it or leave it.</p>
</blockquote>

## Why we call them “eliminators”

The label is easy to misread. **Eliminator does not mean “no to new functionality.”** It does not mean the engineer who blocks the roadmap because every idea sounds risky. Those postures exist; they are not what this essay is praising.

Here, **eliminators** are the people who know what they are doing well enough that their footprint is often **smaller**, not larger: fewer blind alleys, fewer moving parts, fewer first-pass “obvious” additions that the team regrets once the model tightens. They still say **yes** to real product work. What they avoid is **extra** — the liability of a new service, queue, abstraction, or even a **line** of code that does not pay for itself. They treat technical debt the way a serious team treats money: every draw has an interest rate, and compounding is not theoretical. Their work tends to have a **clear ROI**: less machinery carried for the same or better outcome.

First-level thinking is: we have a gap, so we add a thing. The eliminator habit is one step harder: we have a gap — can we remove the cause, tighten the contract, or fold this into what already exists so the system stays easier to reason about? When they add, the addition earns its rent. When they merge, the organisation’s mental load often goes **down**, not up, for the same user-visible win.

That is why the word is *eliminate*: they shrink what must be owned — invalid states, duplicate paths, clever machinery nobody will maintain — not because they refuse to build, but because they refuse to fund ghost towns.

## When the organisation punishes judgement

Your judgment at work is never only up to you. Many engineers **would** like to ask “do we really need this?” — but the job only cheers when tickets close, points move, and demos ship. Calendars stay full. Old mess rarely shows up on a scorecard. If you look “slow,” people read it as checked out, not careful. So good people learn to **move fast**, even when they know better. You also inherit mess and deadlines you did not create.

**This story shows up a lot** (not one company — a pattern people tell in different places): in planning, someone says the new work will **double up** an old path and make production harder to reason about. The worry becomes a “follow-up ticket.” The feature still goes out for the big demo. A few weeks later, the same few people are on call at odd hours while the two paths drift. At review time, nobody writes up the change that would have **removed** half the integration. What gets praised is what **adds** more boxes to the slide. **You get what you measure.**

Saying that is not an excuse. It is where a plan starts. When you push back, spell out the risk in plain language: more outages, harder fixes, more pages. Write the trade-off down. Ask to drop one roadmap item when the win is **less** to own. **Leaders** matter here: leave a little room to delete work, cheer when someone merges **less** code, and look at outcomes — not only how busy the team looked. If that never happens, judgement stays a lonely habit. The org trains everyone to ship fast, then asks why the pile of work never gets smaller.

## Three Pillars of Judgement

Judgement about what to build, what to cut, and what to refactor is at the core of engineering. This idea isn’t new — it’s articulated clearly in Designing Data-Intensive Applications (Chapter 1), through three qualities of good systems:

* Operability — Can the system be kept running without constant heroics?
* Simplicity — Can a new engineer understand it without decoding tribal knowledge?
* Evolvability — Can it adapt gracefully to future change?

These are not abstract ideals. They are everyday decisions — and this judgement is not someone else’s job alone. When the scoreboard mostly lights up for **shipped** work, you still need words for “good” that are not synonyms for **more**; Kleppmann’s three are that vocabulary.

**They only sound obvious until nobody gets credit for a deletion.** Then you learn whether “quality” was a mood or a measure.

### A concrete example: CI/CD pipelines
Almost every team has seen this. A pipeline starts simple. Then we optimize it:

* parallel steps
* caching layers
* conditional triggers
* environment tweaks

Each change makes sense in isolation. Each saves a bit of time. But over time, the pipeline becomes:

* harder to understand
* more fragile
* dependent on hidden assumptions

New engineers don’t understand it. Failures become harder to debug. Someone ends up “owning” it unofficially, fixing it every few weeks. That’s not optimization. That’s accumulated complexity.

A builder sees: “We improved the pipeline by 5 minutes.” Someone with good judgement asks: “Does 5 minutes actually matter?” And more importantly:

* Has the system been working fine for years?
* What new complexity are we introducing?
* What is the long-term cost of maintaining this?
* Are we solving a real problem — or creating a new one?

<blockquote class="pull-quote-pop">
<p><strong>Sometimes, the best decision is: do nothing. Keep it simple.</strong></p>
</blockquote>

**CI is one place the pattern appears.** The same fork — paper over mess versus tighten the model — shows up directly in the code you merge.

## <span class="accent-faster">Code Is Now Cheap</span>. <span class="accent-dangerous">Mistakes Are Not</span>.

Bad abstractions and wrong boundaries still cost outages and rewrites — only now you can ship **more** of them per week, so the bill arrives sooner.

Here’s the uncomfortable question: Who really cares about type safety and compile-time guarantees anymore? In the age of AI, the answer is — you should care even more.

There’s already a growing belief:

<blockquote class="pull-quote-pop">
<p>“If an LLM generates code in a safer language like Rust instead of Python, and it compiles, it’s probably correct.”</p>
</blockquote>

There’s some truth to that. A program that compiles has already cleared a meaningful bar. But choosing the right language is only half the story. In Rust, `unsafe` blocks, wrong invariants, and misunderstood requirements still ship in compiled code. How you model your system still matters — and AI won’t do that thinking for you.
Even today, an LLM will happily generate something like: `HashMap[String, String]` when it could have generated `HashMap[Id, NonEmptyString]`. The difference isn’t syntax. It’s thinking.

Take a piece of logic filled with edge cases.

### Approach 1 — Test your way out 

Accept the complexity. Lean on AI to generate a massive test suite.

* Coverage looks impressive
* Edge cases are “handled”
* CI gets slower
* Tests start flaking
* Maintenance cost quietly grows

### Approach 2 — Model your way out

Ask a different question: Why do these edge cases exist in the first place? Then redesign:

* Use stronger types
* Encode invariants
* Introduce better abstractions

Now something interesting happens: many “edge cases” simply disappear — because the invalid states can no longer be represented.

Both approaches are fast with AI. That’s not the differentiator anymore. The real difference is what you leave behind:

* A system that demands continuous validation
* Or a system that is correct by construction

**The merge button is still yours.** If you believe there is nothing left to review in generated code, you are not ahead — you have already stopped doing the job that pays.

**At service boundaries the same fork returns** — add machinery or fix the contract — only now it is boxes and arrows on a whiteboard when production hurts.

## How Complexity Disguises Itself as Progress

When something breaks, it is easy to add components: validation services, queues, dead-letter queues, more monitoring. AI makes wiring all of that up faster.

Each addition can feel like progress. Often it is **complexity you now have to own**, without fixing the underlying contract or data model.

<div class="system-compare" role="group" aria-label="Comparison of busy versus lean system diagrams">
<figure class="system-diagram system-diagram--busy">
<span class="system-diagram__badge">More machinery</span>
<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g stroke="#3d3d62" stroke-width="1.25" fill="none" opacity="0.95">
<line x1="200" y1="118" x2="65" y2="52"/><line x1="200" y1="118" x2="335" y2="52"/><line x1="200" y1="118" x2="38" y2="118"/><line x1="200" y1="118" x2="362" y2="118"/><line x1="200" y1="118" x2="200" y2="188"/>
<line x1="65" y1="52" x2="335" y2="52"/><line x1="65" y1="52" x2="38" y2="118"/><line x1="335" y1="52" x2="362" y2="118"/><line x1="38" y1="118" x2="200" y2="188"/><line x1="362" y1="118" x2="200" y2="188"/><line x1="65" y1="52" x2="200" y2="188"/><line x1="335" y1="52" x2="200" y2="188"/>
</g>
<path d="M 65 170 L 200 210 L 335 170 L 200 130 Z" fill="none" stroke="#ff2975" stroke-width="1.6" stroke-dasharray="6 4" opacity="0.9"/>
<rect x="30" y="36" width="70" height="32" rx="6" fill="#12121a" stroke="#00fff9" stroke-width="1"/><text x="65" y="56" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="system-ui,sans-serif">Validate</text>
<rect x="300" y="36" width="70" height="32" rx="6" fill="#12121a" stroke="#00fff9" stroke-width="1"/><text x="335" y="56" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="system-ui,sans-serif">Retry</text>
<rect x="160" y="102" width="80" height="34" rx="6" fill="#1a1a2e" stroke="#00fff9" stroke-width="1.2"/><text x="200" y="123" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="system-ui,sans-serif">Core</text>
<rect x="8" y="102" width="60" height="32" rx="6" fill="#12121a" stroke="#2a2a4a" stroke-width="1"/><text x="38" y="122" text-anchor="middle" fill="#a8a8c8" font-size="10" font-family="system-ui,sans-serif">DLQ</text>
<rect x="332" y="102" width="60" height="32" rx="6" fill="#12121a" stroke="#2a2a4a" stroke-width="1"/><text x="362" y="122" text-anchor="middle" fill="#a8a8c8" font-size="10" font-family="system-ui,sans-serif">Mon</text>
<rect x="150" y="188" width="100" height="32" rx="6" fill="#12121a" stroke="#2a2a4a" stroke-width="1"/><text x="200" y="208" text-anchor="middle" fill="#a8a8c8" font-size="10" font-family="system-ui,sans-serif">Worker</text>
</svg>
<p class="system-diagram__cap">Many services, many arrows, easy to end up with <strong>cyclic dependencies</strong> (magenta loop) — every box is something to deploy, monitor, and reason about.</p>
</figure>

<figure class="system-diagram system-diagram--lean">
<span class="system-diagram__badge">Less machinery</span>
<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><marker id="arr-c" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#00fff9"/></marker></defs>
<line x1="95" y1="120" x2="155" y2="120" stroke="#00fff9" stroke-width="1.5" marker-end="url(#arr-c)"/>
<line x1="265" y1="120" x2="325" y2="120" stroke="#00fff9" stroke-width="1.5" marker-end="url(#arr-c)"/>
<line x1="330" y1="135" x2="330" y2="165" stroke="#3d3d62" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="330" y1="165" x2="200" y2="165" stroke="#3d3d62" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="200" y1="165" x2="200" y2="138" stroke="#3d3d62" stroke-width="1" stroke-dasharray="4 3"/>
<rect x="25" y="104" width="70" height="34" rx="6" fill="#12121a" stroke="#00fff9" stroke-width="1"/><text x="60" y="125" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="system-ui,sans-serif">API</text>
<rect x="165" y="102" width="100" height="38" rx="6" fill="#1a1a2e" stroke="#00fff9" stroke-width="1.2"/><text x="215" y="124" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="system-ui,sans-serif">Core</text>
<rect x="330" y="104" width="70" height="34" rx="6" fill="#12121a" stroke="#00fff9" stroke-width="1"/><text x="365" y="125" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="system-ui,sans-serif">Store</text>
<text x="215" y="198" text-anchor="middle" fill="#7a7a9e" font-size="9" font-family="system-ui,sans-serif">Dashed: simple read-back / query path</text>
</svg>
<p class="system-diagram__cap">Same job: requests in, durable state out. Fewer boxes, a clear direction of flow, and <strong>no dependency cycle</strong> between services.</p>
</figure>
</div>

**Concrete next moves** (same idea as fewer boxes above): tighten contracts, make operations idempotent where it matters, simplify data shapes (for example append-only logs instead of shared mutable state). **Adding services is easy. Removing the need for them is the harder and more valuable work.**

<h2 class="h2-accent-warm">A tip for getting judgement right — start with the end-user</h2>

Operability, simplicity, and evolvability are the guardrails — but they simply stay abstract until you anchor them to **someone who will feel the failure**. Who is that someone? Well, the users. The users can be end-user of your product, or just the next team, or a downstream service. The validation begins here and it almost always re-enforces the three pillars inwards.

We add a service, and we judge ourselves that it is a necessity for some reason. But if this avoidable service produce more latency or increased response time, then it goes all the way to the user. So many times, a validation of our judgment is just about wearing the hat of an average user.

Here are some tips that I created for myself:

<span class="accent-lead-red">Deciding what to build — and what to challenge — is invaluable.</span> More feature implementation is not always right. Even if I am not the product owner, I do ask myself: **Is this feature needed for users? How valuable is it? Does it push the product forward?** Velocity is not the same as usefulness. In my recent experience of working in Golem, we had a great visionary, and most of the time, the answer was "yes, the feature is needed to push the product forward". But this was a rare scenario.

<span class="accent-lead-red">Simplicity at the outer level should carry through to inner details.</span> A simple screen backed by a tangled system still fails in practice: behavior becomes hard to reason about, edge cases explode, and every change hurts. Engineers who insist on **simple models and simple surfaces together** — and who refuse to hide complexity behind UI polish — are similarly hard to replace.

<span class="accent-lead-red">Over complicating for an unseen future.</span> Here is an exaggerated version of it: What if the whole amazon region is exploded in a nuclear attack ? The response to such a question should be `what if anything` (obviously inspired). You get the point. Stop over complicating by listing caveats. Caveats from engineers may sound relevant (no-one is stupid here), but it takes one more level of thinking whether it is a forgettable caveat or not. Asking too many questions and addressing all of them will make us the slowest in the market. Yes, layers of indirection for some future cause is something I saw almost everywhere. But I think, I never realized it on the spot.

<span class="accent-lead-red">Lost in refactoring.</span> Caring about good code does **not** mean feeding an endless urge to reshape the same code again and again. You can always explain a refactor to others with a “why” — but you still owe yourself an honest version: **Is this refactor actually needed? What concrete outcome does it buy** (risk down, speed up, clearer model) **versus churn?** AI makes rewrites cheap to *start*; it does not make perpetual refactoring free. Knowing when to stop, when “good enough” is right, and when the team should ship value instead of polishing internals is **developer judgement** — and that is not replaceable.

## If you think this is “not about us” — it still is

There is no real exceptions. Motion never beats direction, piled-on work always costs, and tools always amplify your existing habits. The context changes, but the trade-off stays the same. If any of the lines below sound like your team, this still applies to you.

**Regulated, safety-critical, or “we cannot move fast and break things”.**  
You actually have *more* reason to tighten your models and shrink surface area. Hiding a fuzzy model behind more generated tests and services just makes life harder for auditors who still have to trace everything. Fewer states to prove is almost always better than more machinery to explain.

**Internal tools, platform, infra, or devtools.**  
Someone always uses what you build — the next team, on-call, or every service that depends on your API. In this case, operability and clarity *are* the product. A leaky abstraction here hurts more because the blast radius reaches the whole system that trusted you.

**Startup — “we have to ship or die”.**  
Shipping is not the same as accumulating. Taking on debt deliberately can make sense, but taking debt without naming it or planning when to pay it back is how small teams quietly drown. Velocity without elimination catches up fast.

**Big enterprise — “we have process for that”.**  
Process rarely removes ambiguity — it usually just routes around it. More sign-offs don’t replace having one fewer invalid state. The real cost of a messy model usually shows up as more meetings, more CABs, and longer runbooks.

**“We barely use AI.”**  
You still paste from Stack Overflow, accept large diffs without deep review, merge dependency bumps you didn’t fully read, and live with configs nobody really owns. The muscle this post talks about is review and refusal, not the name of the autocomplete tool. When AI does arrive, the habit is already set.

**“Our culture already values quality.”**  
If your reviews celebrate new launches far more than removals and scope cuts, or if metrics only move when something new ships, then the culture may not be quite what you think it is.

**Research, spikes, “we are just exploring”.**  
Exploration is valid. The trap is shipping the spike as production — or never deciding what should die. Real judgement includes knowing when an experiment ends and what to delete once you’ve learned from it.

**Agency, consulting, “we only build what clients pay for”.**  
Your repo and your team’s reputation still carry whatever you leave behind. “The client asked for it” or “the ticket was in JIRA” doesn’t remove the long-term cost on the people who have to maintain it.

**“We are special — our domain is inherently complex.”**  
Some domains *are* genuinely hard. But inherent complexity is different from self-inflicted complexity. This post is aimed at the second kind: duplicate paths, vague types, and extra machinery that exists only because no one pushed to simplify the contract. Even hard problems benefit from fewer lies in the model.

If none of those labels fit, you still have contracts, data, on-call rotations, and colleagues. As long as you have a production system and other people depending on your work, the divide between multiplying problems and eliminating them is still very much alive in your day-to-day.

## Final Thought

Tools come and go. What truly endures is whether you left the system with less world to debug — fewer lies in the data model, fewer parallel paths nobody owns, and fewer situations held together only by heroics.
The real elimination is rarely the direct goal. It emerges as a natural outcome of exercising good judgment — consistently making the right choices. When you prioritize sound judgment, the eliminator effect follows almost by itself.

We don’t usually give these people a fancy title, but I’ve come to call them eliminators. In the age of AI, they quietly reduce the burden on the team — and they keep winning.