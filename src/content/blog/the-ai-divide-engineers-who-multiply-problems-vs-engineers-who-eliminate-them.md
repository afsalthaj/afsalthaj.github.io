---
title: 'The AI Divide: When Everyone Can Solve Fast, Eliminators Win'
description: 'When motion is cheap, direction is scarce: shrink invalid state and needless machinery — not typing faster. Regulated, internal, startup, or “we barely use AI”: the multiply-vs-eliminate divide still runs through your stack, incentives, and who you keep.'
pubDate: 'Apr 2 2026'
category: 'the-lab'
---

AI makes it easy to solve problems quickly, and almost anyone can play that game. The people who pull ahead step back, think harder, and eliminate problems instead of trying to solve everything.

When the cost of **motion** drops, the scarce thing becomes **direction**: what should exist in the system at all. Tools accelerate whatever habit you already have — including the habit of treating symptoms faster instead of removing causes. That is why raw speed stops impressing almost immediately: volume was never the hard part. The hard part was always the **right delta** — less invalid state, less machinery, less scope that fails a user-value bar — and that delta is still earned, not generated.

## <span class="accent-faster">Code Is Now Cheap</span>. <span class="accent-dangerous">Mistakes Are Not</span>.

Bad abstractions and wrong boundaries still cost outages and rewrites — only now you can ship **more** of them per week, so the bill arrives sooner.

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

**AI does not fill that gap for you — it widens whatever you already reinforce.** Strong habits of judgement turn into leverage; habits of skipping the hard questions turn into volume. The section below names that split in plain terms.

## The Only Divide That Actually Matters

The useful split is not developer versus engineer.

**Some people use AI to create more problems** (more code, more layers, more tests to paper over a messy model). **Others use AI to remove problems** (clearer models, fewer invalid states, less machinery).

Same tools. Opposite outcomes.

That difference affects what you ship and how much ongoing work the system needs. Stack and title matter less than whether you tend to expand mess or reduce it.

**Elimination does not mean doing less engineering.** It means shrinking what the team has to reason about: invalid data you no longer allow at the boundary, services and queues you no longer need because contracts and flows are honest, work you decline because it does not clear a user-value bar. It does **not** mean skipping tests when the model is still fuzzy, skipping observability when people depend on uptime, or pretending operations are optional. Tests, metrics, and runbooks still matter. What ages poorly is using them as a **substitute** for a clear model — papering over ambiguity — instead of using them as **evidence** that a tight model actually holds in production.

**That split does not stay inside the repo.** It eventually shows up in who teams fight to keep when almost everyone can ship code with help from a model.

## Employability in today's AI world

Employability already tilts toward people who think about **what** they are building — not only how fast they clear a board.
Think of someone on your team whose only goal is to complete a task in JIRA — someone who isn’t really invested in the overall outcome of the system.
Wouldn’t you already start wondering if you could just use coding assistants instead of relying on them?
Now think of someone else — someone deeply involved. Given a task, they ask the right questions, write thoughtful documentation, and actively try to make things simpler for both the next engineer and the end user — even while adding a complex feature to the system.
This person will likely take more time than the first. Yet, in very short time, the team realizes how valuable these genuinely slow ones are. They become indispensable — and are often the last person anyone would consider letting go.

**None of that unfolds in a neutral workplace.** Incentives get a vote too.

## When the organisation punishes judgement

Your judgement at work is never only up to you. Many engineers **would** like to ask “do we really need this?” — but the job only cheers when tickets close, points move, and demos ship. Calendars stay full. Old mess rarely shows up on a scorecard. If you look “slow,” people read it as checked out, not careful. So good people learn to **move fast**, even when they know better. You also inherit mess and deadlines you did not create.

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

## Safe Systems Win. Tests Alone Cannot Fix a Wrong Model.

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

## AI Makes Good Engineers <span class="accent-faster">Faster</span>. And Bad Ones <span class="accent-dangerous">Dangerous</span>.

AI still does not know whether it is increasing or reducing complexity — no more at the service level than at the type level. It will generate more tests, services, layers, and code on request.

**You** decide whether that output helps or piles on work. If you cannot tell the difference, you will get both.

**Domain types** (e.g. `UserId` instead of a raw `string`) reduce confusion for people and for tools. They document intent.

**Type parameterisation** goes further: it encodes **rules and relationships** in the type system, so some mistakes show up as **compile-time errors** instead of runtime bugs.

Both help. They solve different problems. Together they reduce the need for defensive code everywhere.

<h2 class="section-callout-pop">Code Is Cheap. Consequences Are Not.</h2>

AI reduced the effort to **produce** code. It did not reduce the cost of poor scaling, weak models, unreliable behaviour, or heavy operations.

If you move faster without better judgement, you can create those problems **faster** too.

<h2 class="h2-accent-warm">A tip for getting judgement right — start with the end-user</h2>

Operability, simplicity, and evolvability are the guardrails — they stay abstract until you anchor them to **someone who will feel the failure**. Start with whoever uses what you build: end customers, the next team, or a downstream service; the label does not change the bar. **Run the same lens inward** so those three stay real in code and operations, not slide filler.

**More feature implementation is not always right.** Before it lands, ask: **Is this feature needed for users? How valuable is it? Does it push the product forward?** Velocity is not the same as usefulness. Teams that measure success only by output volume still drown in maintenance, support, and rework — they just get there faster now. **A pile of small features is the final nail in the coffin for a product** — not one dramatic failure, but slow death by clutter, drift, and debt.

<span class="accent-lead-red">Deciding what to build — and what to challenge — is invaluable.</span> A developer who can look at a backlog or a spec and ask, from a user’s point of view, “do people actually need this?”, “what are we trading away?”, and “can we achieve the outcome with less?” is not something you install from a model. That judgement shapes cost, clarity, and trust. It is **irreplaceable**.

<span class="accent-lead-red">Simplicity at the outer level should carry through to inner details.</span> A simple screen backed by a tangled system still fails in practice: behaviour becomes hard to reason about, edge cases explode, and every change hurts. Engineers who insist on **simple models and simple surfaces together** — and who refuse to hide complexity behind UI polish — are similarly hard to replace.

<span class="accent-lead-red">Over complicating for an unseen future....</span> Layers of indirection, speculative generalisation, and “perfect” abstractions slow delivery and drain budgets. AI may help you refactor or untangle that mess later, but you already paid for the slow path: time, money, and opportunity. Correctness matters; **needless** complexity in its name does not.

<span class="accent-lead-red">Lost in refactoring.</span> Caring about good code does **not** mean feeding an endless urge to reshape the same code again and again. You can always explain a refactor to others with a “why” — but you still owe yourself an honest version: **Is this refactor actually needed? What concrete outcome does it buy** (risk down, speed up, clearer model) **versus churn?** AI makes rewrites cheap to *start*; it does not make perpetual refactoring free. Knowing when to stop, when “good enough” is right, and when the team should ship value instead of polishing internals is **developer judgement** — and that is not replaceable.

## If you think this is “not about us” — it still is

There is still **no carve-out** where **motion beats direction**, where **piled-on work** stops costing, or where tools stop **amplifying habits**. The costume changes; the trade-off does not. If a line below sounds like your team, you are still in scope.

**Regulated, safety-critical, or “we cannot move fast and break things”.** You have *more* reason to **tighten models and shrink surface area** — not to hide a fuzzy model behind more generated tests and services that auditors still have to trace. Fewer states to prove beats more machinery to explain.

**Internal tools, platform, infra, or devtools.** Someone always “uses” the output: the next team, on-call, or every service that called your API. **Operability and clarity are the product** when the consumer is another builder — and a leaky abstraction there often hurts worse than a bad screen, because the blast radius is the whole graph that trusted you.

**Startup — “we have to ship or die”.** Shipping is not the same as **accumulating**. Taking debt on purpose can be right; taking debt **without naming it and without a cut line** is how you become the rewrite someone else sells. Velocity without elimination is still how small teams drown fastest.

**Big enterprise — “we have process for that”.** Process rarely deletes ambiguity; it often **routes** it. More sign-offs do not replace **one fewer invalid state**. If anything, the cost of a messy model shows up as **more meetings, more CABs, more runbooks** — the busy diagram in business casual.

**“We barely use AI.”** You still paste from Stack Overflow, accept large diffs you skim, merge dependency bumps you did not read, and live with configs nobody owns. The muscle this post is about is **review and refusal**, not the brand name on the autocomplete. When assistants do land in your workflow, the habit is already set.

**“Our culture already values quality.”** If review never celebrates **removals** and scope cuts the way it celebrates launches, or if metrics only ever move when something new ships, you do not yet have the culture you think you have — you have a slogan.

**Research, spikes, “we are just exploring”.** Exploration is legitimate. The failure mode is **shipping the spike** — or never choosing what dies — so exploration quietly becomes **production debt**. Judgement includes saying: this experiment ends **here**, and here is what we delete when we learn.

**Agency, consulting, “we only build what clients pay for”.** Your repo and your reputation still carry the pile. “The client asked for it” is the same abdication as “the ticket was in JIRA” if nobody names the **long-term cost** on the people who maintain it.

**“We are special — our domain is inherently complex.”** Some domains are hard. **Inherent complexity** is not the same as **self-inflicted complexity**. The post targets the second: duplicate paths, vague types, machinery that exists because nobody had the political air to fix the contract. Hard problems still benefit from **fewer lies in the model**.

If none of those labels fit, you still have **contracts, data, on-call, and a calendar**. Unless you have **no** production system and **no** colleagues, the divide — multiply versus eliminate — is live in your work. The only real opt-out is to stop pretending the loophole was ever there.

## Final Thought

Tools come and go; **the signature that survives** is still whether you left behind **less world to debug** — fewer lies in the data model, fewer parallel paths nobody owns, fewer meetings held together by heroics. That work is not performative slowness. It is what autocomplete cannot own end to end: **making a bad diagram less likely before the pager fires** — and making the fallout survivable for people who were not in the room when the box was drawn.
