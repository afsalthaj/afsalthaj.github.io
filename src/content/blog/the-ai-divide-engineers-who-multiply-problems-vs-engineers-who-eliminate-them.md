---
title: 'The AI Divide: When Everyone Can Solve Fast, Eliminators Win'
description: 'AI makes it easy to solve problems quickly, and almost anyone can play that game. The people who pull ahead step back, think harder, and eliminate problems instead of trying to solve everything.'
pubDate: 'Apr 2 2026'
category: 'the-lab'
---

AI makes it easy to solve problems quickly, and almost anyone can play that game. The people who pull ahead step back, think harder, and eliminate problems instead of trying to solve everything.

## <span class="accent-faster">Code Is Now Cheap</span>. <span class="accent-dangerous">Mistakes Are Not</span>.

AI makes writing code fast and cheap. It does **not** make bad decisions cheap.

Wrong abstractions, wrong boundaries, and wrong data models still cost the same in outages, rewrites, and operational pain. You can now ship more bad decisions per week, so the damage can compound faster than before.

## The myth of “Coders lose, engineers win”

You hear a lazy version of the story: developers get automated, but **system designers** stay safe because their work is “high level.” That map is weak. Models are already trained on architecture — patterns, trade-offs, scaling, production-style designs. With enough context, they can sketch boundaries and talk about failure modes. **No title is “safe”** just because it sounds strategic on a chart.

Here is a better way to think about it.

**“Safe” has more to do with how you show up than what your title says.** Every person on a team **shapes the atmosphere** — how honest the debate is, how much people care about the outcome, and whether the work stays tied to the product and the company you are building. That is not abstract: it shows up in decisions, in code, and in who stays and who burns out.

<blockquote class="pull-quote-pop">
<p>The people who strengthen a team are usually the ones who <strong>set the tone by example</strong>: <strong>loyal</strong> to the mission and the product, <strong>committed to outcomes</strong> instead of individual performance, and finally <strong>create the right waves within the team</strong>.</p>
</blockquote>

<blockquote class="pull-quote-pop">
<p><strong>What makes you create the right wave?</strong> Your <strong>judgement</strong> — at every point: what you build, what you cut, what you refactor, and what you refuse to treat as normal. Your judgement directs the tools you use, and directs the people around you to converge to great outcomes.</p>
</blockquote>

That can come from **great developers** or **great system designers** (or leads, SREs, product-minded engineers — the list is long). **The role name is not the point.** The point is whether you **multiply problems or reduce them**, and whether people and systems leave your orbit a little **sharper** or a little more **tangled**.

**AI does not fill that gap for you — it widens whatever you already reinforce.** Strong habits of judgment turn into leverage; habits of skipping the hard questions turn into volume. The section below names that split in plain terms.

## The Only Divide That Actually Matters

The useful split is not developer versus engineer.

**Some people use AI to create more problems** (more code, more layers, more tests to paper over a messy model). **Others use AI to remove problems** (clearer models, fewer invalid states, less machinery).

Same tools. Opposite outcomes.

That difference affects what you ship and how much ongoing work the system needs. Stack and title matter less than whether you tend to expand mess or reduce it.

## Employability in today's AI world

The employability of an engineer now depends heavily on how much they think about what they are building.
Think of someone on your team whose only goal is to complete a task in JIRA — someone who isn’t really invested in the overall outcome of the system.
Wouldn’t you already start wondering if you could just use coding assistants instead of relying on them?
Now think of someone else — someone deeply involved. Given a task, they ask the right questions, write thoughtful documentation, and actively try to make things simpler for both the next engineer and the end user — even while adding a complex feature to the system.
This person will likely take more time than the first. Yet, in very short time, the team realizes how valuable these genuinely slow ones are. They become indispensable — and are often the last person anyone would consider letting go.

## Three Pillars of Judgement 
Judgement about what to build, what to cut, and what to refactor is at the core of engineering. This idea isn’t new — it’s articulated clearly in Designing Data-Intensive Applications (Chapter 1), through three qualities of good systems:

* Operability — Can the system be kept running without constant heroics?
* Simplicity — Can a new engineer understand it without decoding tribal knowledge?
* Evolvability — Can it adapt gracefully to future change?

These are not abstract ideals. They are everyday decisions. And importantly — this judgement is not someone else’s job. It’s not “architecture”, not “tech leads”, not “senior engineers”. It’s everyone’s responsibility.

Yes, these sound really very obvious. But they are not. They are often ignored in the rush to ship, and that’s where the divide is. We live in a world that celebrates what gets built and shipped — because those are easy to measure.
But sooner, the world stops celebrating your speed. If you managed to raise 5 PRs in a day, the world knows its possible because of AI and isn't a big deal. So how can you make others
feel what you are doing is a big deal end of the day?

Let me repeat this: In an era where assistants and tools can help anyone produce code faster, your value is no longer just in building — it’s in judgement.

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

A builder sees: “We improved the pipeline by 5 minutes.” A good judger asks: “Does 5 minutes actually matter?”. And more importantly:

* Has the system been working fine for years?
* What new complexity are we introducing?
* What is the long-term cost of maintaining this?
* Are we solving a real problem — or creating a new one?

<blockquote class="pull-quote-pop">
<p><strong>Sometimes, the best decision is: Do nothing.Keep it simple. </strong></p>
</blockquote>


## Safe Coders Win. Test Generators lose.

Here’s the uncomfortable question: Who really cares about type safety and compile-time guarantees anymore? In the age of AI, the answer is — you should care even more.


There’s already a growing belief:

<blockquote class="pull-quote-pop">
<p>“If an LLM generates code in a safer language like Rust instead of Python, and it compiles, it’s probably correct.”</p>
</blockquote>

There’s some truth to that. A program that compiles has already cleared a meaningful bar. But choosing the right language is only half the story. How you model your system still matters — and AI won’t do that thinking for you.
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

We correctly treat scalability, reliability, correctness, data, and performance as major concerns. But we often assume that only big architectural decisions shape them. That’s not true. Small modeling choices matter just as much — how types are defined, how state is represented, and what is enforced at compile time versus left to runtime checks.

In an AI-driven world, many developers can generate “good” code. The ones who stand out are those who consistently generate the right code. That doesn’t happen by accident; it comes from carefully reviewing what AI produces and making sure these fundamentals are preserved.

At the end of the day, the final reviewer is you. If you feel there’s nothing left for you to review in AI-generated code, you’re not ahead — you’re already falling behind.


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

This is the same move as earlier with tests. You can drown in <strong>thousands of cases</strong> to cover a fuzzy model, or you can <strong>tighten the model</strong> so those cases never appear. At the system level, you can drown in <strong>validators, queues, retries, and dashboards</strong> — or you can <strong>tighten contracts, cut cyclic dependencies, and simplify data flow</strong> so several of those pieces are simply unnecessary.

A direct alternative: tighten contracts, make operations idempotent where it matters, simplify data shapes (for example append-only logs instead of shared mutable state) so fewer failure modes exist. **Adding services is easy. Removing the need for them is the harder and more valuable work.**

## AI Makes Good Engineers <span class="accent-faster">Faster</span>. And Bad Ones <span class="accent-dangerous">Dangerous</span>.

AI does not know if it is increasing or reducing complexity. It will generate more tests, services, layers, and code on request.

**You** decide whether that output helps or piles on work. If you cannot tell the difference, you will get both.

**Domain types** (e.g. `UserId` instead of a raw `string`) reduce confusion for people and for tools. They document intent.

**Type parameterisation** goes further: it encodes **rules and relationships** in the type system, so some mistakes show up as **compile-time errors** instead of runtime bugs.

Both help. They solve different problems. Together they reduce the need for defensive code everywhere.

<h2 class="section-callout-pop">Code Is Cheap. Consequences Are Not.</h2>

AI reduced the effort to **produce** code. It did not reduce the cost of poor scaling, weak models, unreliable behaviour, or heavy operations.

If you move faster without better judgment, you can create those problems **faster** too.

<h2 class="h2-accent-warm">A tip to right judgement — start with the end-user</h2>

We already discussed the three pillars of judgement: operability, simplicity, and evolvability. But in reality, given a problem, what should be my direction to judgement? Where do I start? End of the day, you are building something for a user. Somebody is going to end up using what you are building. May be end-user customers, or other developers within your team, or a downstream team. It doesn't matter.

**Judgement begings from thinking from a user’s perspective.** And finally this journey goes all the way the internals of the system to further ensure its operability, simplicity and extensibility. 

**More feature implementation is not always right.** Before it lands, ask: **Is this feature needed for users? How valuable is it? Does it push the product forward?** Velocity is not the same as usefulness. Teams that measure success only by output volume still drown in maintenance, support, and rework — they just get there faster now. **A pile of small features is the final nail in the coffin for a product** — not one dramatic failure, but slow death by clutter, drift, and debt.

<span class="accent-lead-red">Deciding what to build — and what to challenge — is invaluable.</span> A developer who can look at a backlog or a spec and ask, from a user’s point of view, “do people actually need this?”, “what are we trading away?”, and “can we achieve the outcome with less?” is not something you install from a model. That judgment shapes cost, clarity, and trust. It is **irreplaceable**.

<span class="accent-lead-red">Simplicity at the outer level should carry through to inner details.</span> A simple screen backed by a tangled system still fails in practice: behaviour becomes hard to reason about, edge cases explode, and every change hurts. Engineers who insist on **simple models and simple surfaces together** — and who refuse to hide complexity behind UI polish — are similarly hard to replace.

<span class="accent-lead-red">Over complicating for an unseen future....</span> Layers of indirection, speculative generalisation, and “perfect” abstractions slow delivery and drain budgets. AI may help you refactor or untangle that mess later, but you already paid for the slow path: time, money, and opportunity. Correctness matters; **needless** complexity in its name does not.

<span class="accent-lead-red">Lost in refactoring.</span> Caring about good code does **not** mean feeding an endless urge to reshape the same code again and again. You can always explain a refactor to others with a “why” — but you still owe yourself an honest version: **Is this refactor actually needed? What concrete outcome does it buy** (risk down, speed up, clearer model) **versus churn?** AI makes rewrites cheap to *start*; it does not make perpetual refactoring free. Knowing when to stop, when “good enough” is right, and when the team should ship value instead of polishing internals is **developer judgment** — and that is not replaceable.

<blockquote class="pull-quote-pop">
<p>Developers who <strong>routinely judge the work from a user perspective</strong>, and who combine that with scepticism about scope, <strong>discipline around refactoring</strong>, and a bias toward clarity, are the ones who make AI a multiplier instead of an accelerant for waste.</p>
</blockquote>

## Final Thought

The quality of atmosphere we make in a team in all dimensions decides employability. The atmosphere you make in the AI world is not through the velocity of what you produce. It is the quality of your judgement on what to produce, and how to produce.
