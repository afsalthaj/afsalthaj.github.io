---
title: 'Everything You Must Know About AI Agents: Hype vs. Reality'
description: 'A comprehensive guide to AI agentic systems — covering design patterns, MCP, hybrid frameworks, and why solid engineering still matters.'
pubDate: 'Oct 22 2025'
category: 'the-lab'
---

If you searched for **AI agents**, **agent architectures**, or **durable execution** patterns for reliable AI systems, this guide walks through design trade-offs and practical engineering choices.

This blog covers just about everything that you need to be aware of AI agentic systems, both conceptually and technically. Whether you are an engineer stepping into this space, or someone who has been building agentic systems for a while, there is something here for you.

## Good to Know Before You Know!

Before we jump into AI agents, let's acknowledge the elephant in the room: **system design fundamentals haven't gone away**.

Distributed computing, the CAP theorem, state persistence, fault tolerance, idempotency, retry semantics — these aren't relics of a pre-AI world. They are the foundation on which any reliable agentic system must be built.

Why does this matter? Because the boundary between agentic patterns and classical system design is often blurred. Many so-called "AI agent frameworks" are really just workflow engines with an LLM call somewhere in the middle. If you strip away the LLM, you're left with state machines, message queues, and orchestration logic — problems we've been solving for decades.

Understanding this boundary is important. It helps you decide what genuinely needs an agent and what is better served by a well-designed service with a single LLM call. Not everything needs to be an agent.

## Beyond Hype: Understanding AI Agents Without Losing Sight of Engineering

There are two biases worth being aware of when navigating this space:

**Confirmation bias** — the tendency to see agents everywhere once you've decided they're the future. Every problem starts looking like it needs an autonomous loop, a planner, a multi-agent swarm. You stop asking whether a simple function call would suffice.

**Novelty bias** — the tendency to dismiss agents entirely because they're hyped. You refuse to engage with the tooling, the patterns, the genuine progress in reasoning capabilities, because the marketing around it is noisy.

The truth, as usual, sits in the middle. Agents are a real and useful pattern. They are also not the answer to everything. The engineers who will build the most reliable systems are the ones who can tell the difference.

## What Is an Agentic System?

An agentic system uses LLMs to solve problems in a **goal-directed**, **controlled**, and **reliable** manner. The key word here is *system* — not just a prompt, not just a model, but an end-to-end architecture that takes a goal and delivers a result.

Consider a simple example: a **hiker agent** that helps plan outdoor trips.

1. **Extract entities** from the user's request — location, date range, activity type.
2. **Fetch factual data** via tool calls like `get_weather(location, date_range)` or `get_trail_conditions(location)`.
3. **Generate human-friendly guidance** by feeding the structured data back through the LLM.

```
User: "I'm planning a hike in the Blue Mountains next weekend."

Agent:
  → Extract: location="Blue Mountains", date_range="next Saturday–Sunday"
  → Tool call: get_weather("Blue Mountains", "2025-10-25..2025-10-26")
  → Tool call: get_trail_conditions("Blue Mountains")
  → LLM: Combine results into a friendly, actionable summary
```

The agent is not merely a conduit to an LLM. **It is an orchestrator.** It decides what to extract, which tools to call, how to combine results, and when to ask for clarification. The LLM is a component — a powerful one — but the agent is the system around it.

## AI Agents from a Senior Software Engineer's Perspective

Here's something that doesn't get said enough: the boundary between agents and regular orchestrating code is still unclear.

When I write a service that takes user input, calls an API, processes the response, and returns a result — is that an agent? If I add an LLM call in the middle to decide which API to call, does it suddenly become one?

The honest answer is: it depends on who you ask. And that ambiguity matters, because it affects how you architect systems.

From an engineering perspective, what makes something genuinely "agentic" is the degree to which the **LLM drives the control flow**. If the LLM is just generating text at the end, you have a pipeline with an LLM step. If the LLM is deciding what to do next, selecting tools, evaluating results, and looping — that's agentic behavior.

The distinction matters because agentic systems are inherently less predictable. They need guardrails, timeouts, cost controls, and observability in ways that deterministic workflows do not.

## Hybrid Frameworks: Golem and the Non-Intrusive Approach

Most AI agent frameworks today are **intrusive**. They ask you to restructure your code around their abstractions — state graphs, node registries, edge definitions, custom serialization formats. The framework becomes the architecture.

Hybrid frameworks like [Golem](https://www.golem.cloud) take a different approach. Golem is a **runtime**, not a library. It provides durability, state persistence, and exactly-once semantics *without* requiring you to encode your logic into a framework-specific DSL. You write normal code — TypeScript, Rust, Python — and the runtime handles the hard parts.

The advantage is **orthogonality**. Your agentic logic (the part that talks to LLMs, decides what to do next, calls tools) stays cleanly separated from your infrastructure concerns (state persistence, scaling, fault tolerance). You can make something an agent or not an agent without rewriting the whole thing.

This matters because in practice, the line between "agent" and "tool" shifts as you iterate. A component that starts as an agent might become a tool for another agent. A tool might graduate to an agent. If your framework forces a hard boundary between the two, every change is a rewrite.

## Agent Design Patterns

These are the core patterns you'll encounter when designing agentic systems. Each has its place, and the best systems combine several of them.

### Prompt Chaining

The simplest agentic pattern. You break a complex task into a sequence of LLM calls, where the output of one becomes the input to the next.

```
Step 1: LLM extracts key entities from user input
Step 2: LLM generates a search query from those entities
Step 3: LLM summarizes the search results into a final answer
```

Each step is deterministic in its *structure* — you know what happens next. The LLM provides the *content* at each step. This is the least "agentic" pattern, but it's reliable, predictable, and often sufficient.

### Routing

Routing is where AI starts to influence control flow. Instead of a fixed sequence, the system decides which path to take based on the input.

The routing decision itself can be made in several ways:

- **Keyword or rule-based**: Classical, deterministic. Fast and cheap.
- **Embeddings and similarity**: Compare the input embedding against a set of route embeddings. Good for fuzzy matching.
- **ML classification models**: A lightweight classifier that maps inputs to routes. More robust than keywords, cheaper than an LLM call.
- **LLM-based routing**: Ask the LLM itself to decide. Most flexible, most expensive.

The choice depends on your latency budget, cost tolerance, and how nuanced the routing needs to be. In practice, many systems use a tiered approach — try cheap routing first, fall back to LLM routing for ambiguous cases.

### Tool Orchestration

This is the pattern most people think of when they hear "AI agent." The LLM dynamically decides which external capabilities to invoke — APIs, databases, code interpreters, search engines — based on the current context and goal.

```python
tools = [search_web, get_weather, book_flight, send_email]
llm_with_tools = llm.bind_tools(tools)

# The LLM decides which tool(s) to call
response = llm_with_tools.invoke("Book me a flight to NYC and check the weather there")
```

The key challenge is **reliability**. The LLM might choose the wrong tool, pass incorrect parameters, or hallucinate a tool that doesn't exist. Good tool orchestration requires clear tool descriptions, input validation, and graceful error handling.

### Reflection

A reflection pattern introduces a feedback loop. After the agent produces an output, an **evaluator** (which may be another LLM call, a rule-based checker, or a separate agent) assesses the quality and provides feedback. The agent then refines its output.

```
Agent → Draft response
Evaluator → "The response doesn't address the user's constraint about budget"
Agent → Revised response incorporating budget constraint
Evaluator → "Looks good"
→ Return final response
```

This is powerful for tasks where first-pass quality is unreliable — code generation, report writing, complex reasoning. The cost is latency and token usage, since you're making multiple LLM calls per request.

### Parallelization

When an agent needs to gather information from multiple independent sources, it can dispatch those calls in parallel rather than sequentially.

A note for Python developers: if you're using frameworks like LangGraph, be aware of the GIL (Global Interpreter Lock). True parallelism for CPU-bound work requires multiprocessing, not just `asyncio`. For IO-bound work (which most agent tool calls are), `asyncio` works fine — but understand the distinction.

### Planning

In a planning pattern, the agent dynamically generates its own sequence of steps before executing them. Rather than following a fixed workflow, it reasons about the goal and produces a plan.

```
User: "Help me prepare for a job interview at a fintech company"

Agent plan:
  1. Research the company's products and recent news
  2. Identify common fintech interview topics
  3. Generate practice questions tailored to the company
  4. Provide study resources for weak areas
```

This pattern is common in robotics and navigation — where the environment is dynamic and the path to the goal can't be hardcoded. In software agents, it's useful for open-ended tasks where the steps genuinely depend on intermediate results.

The risk is over-planning. An agent that spends 10 LLM calls planning a task that could have been solved in 2 direct calls is wasting time and money.

### Multi-Agent Patterns

When a single agent isn't enough, you compose multiple agents. There are several topologies:

**Network** — Agents communicate peer-to-peer. Any agent can call any other agent. Flexible but hard to reason about. Debugging is difficult.

**Supervisor** — A central supervisor agent delegates tasks to worker agents and aggregates results. Clear hierarchy, easier to debug, but the supervisor becomes a bottleneck.

**Nuanced Supervisor** — The supervisor doesn't just delegate — it also decides *how* to delegate. It might break a task into subtasks, assign them to different workers with different prompts, and synthesize the results with awareness of each worker's strengths and weaknesses.

**Hierarchical** — Multiple layers of supervisors. A top-level supervisor delegates to mid-level supervisors, who delegate to workers. This mirrors organizational structure and works for very complex, multi-domain tasks. The cost is complexity and latency.

### Learning and Adaptation

The most advanced pattern. The agent doesn't just execute — it *improves* over time.

- **Self-learning**: The agent evaluates its own outputs and adjusts its behavior. This might mean updating its own prompts, refining its tool selection heuristics, or building a memory of past successes and failures.
- **Supervised learning**: Human feedback is used to fine-tune the agent's behavior. The agent learns from corrections.
- **Few-shot learning**: The agent is given a small number of examples and generalizes from them. This is the simplest form of adaptation and is already widely used in prompt engineering.
- **Online learning**: The agent continuously learns from new data as it arrives, without needing to be retrained from scratch.

Projects like **AlphaEvolve** and **OpenEvolve** push this further — using evolutionary strategies to discover better agent configurations, prompts, and tool compositions. This is still cutting-edge, but it points to a future where agents don't just follow patterns — they discover them.

## MCP: Model Context Protocol

MCP has been getting a lot of attention, and some of it is dismissive — "it's just another HTTP protocol." That undersells what it actually is.

### Not an Overrated HTTP Protocol

MCP is a **standardized interface** between AI models and the tools, data sources, and services they interact with. Think of it less as a protocol and more as a **contract** — a shared language that lets any model talk to any tool without custom integration code.

Before MCP, every tool integration was bespoke. You'd write custom code to connect your agent to a weather API, a different set of code for a database, another for a file system. MCP standardizes this so that a tool written once can be used by any MCP-compatible agent.

### Client-Server Architecture

MCP follows a client-server model:

- **MCP Client**: Lives inside the agent (or the agent's host). It discovers available tools, understands their schemas, and invokes them on behalf of the LLM.
- **MCP Server**: Exposes capabilities — tools, data, prompts — in a standardized format. A single MCP server might expose a handful of related tools (e.g., a "GitHub server" that exposes `create_issue`, `list_prs`, `get_file_contents`).

The separation is clean: the agent doesn't need to know how a tool is implemented. It only needs to know the tool's name, description, and input schema — all provided by the MCP server.

### Function Calls vs. MCP Tool Calls

This distinction trips people up. **Function calls** (as defined by OpenAI and others) are a mechanism where the LLM outputs structured JSON indicating it wants to call a function. The actual execution happens on the client side — your code catches the function call, executes it, and feeds the result back.

**MCP tool calls** build on this but add a layer of standardization and discovery. The tools are described by an MCP server, discovered dynamically at runtime, and invoked through a standard protocol. The LLM doesn't need to be trained on specific tools — it discovers them through MCP.

In practice, MCP tool calls often *use* the function calling mechanism under the hood. The difference is in how tools are discovered, described, and managed — not in how the LLM requests them.

### Beyond Tools: Prompts and Resources

MCP isn't just about tools. It also standardizes:

- **Prompts**: Reusable prompt templates that MCP servers can expose. Instead of hardcoding prompts in your agent, you can fetch them from an MCP server — enabling prompt versioning, A/B testing, and sharing across agents.
- **Resources**: Data sources that the agent can read from — files, database records, API responses. Resources are exposed with URIs and can be lazily loaded, paginated, and cached.

This makes MCP a **context protocol** in the truest sense — it's not just about calling tools, but about giving the model the full context it needs to do its job.

## Summary

Getting excited about AI agents is natural, but we must not forget the foundational principles of robust software engineering.

Agents are a pattern, not a paradigm shift. The LLM is a component, not the architecture. State management, fault tolerance, observability, cost control — these don't stop mattering because you added an AI model to your stack.

The engineers who build the best agentic systems will be the ones who understand both sides: the new capabilities that LLMs unlock *and* the timeless principles that make software reliable. Don't let the hype make you forget what you already know.
