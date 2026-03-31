---
title: 'How Golem Stands Out in the World of AI Agents'
description: 'Why most AI agent frameworks blur the line between agentic behavior and stateful workflow management — and how Golem keeps it clean.'
pubDate: 'Oct 15 2025'
category: 'the-lab'
---

## 🔹 AI Agent

An AI agent is a system powered by an LLM (or other AI models) that can:

- Get an input from the user (e.g. "book me a flight")
- Decide what to do next: Example — the next best thing to do at this stage is to call a weather API
- Act by calling tools, APIs, or other systems
- To a reasonable extent, keep the memory of what's going on, so that it knows the context
- Adapt to changes automatically (to a great extent)

It's not feasible to explain every fundamental of an agentic system in this blog. So for those who are new to this, it's good to have a reasonable idea about various concepts lying around an agentic system such as LLM models, tools etc before you deep dive into the core subject of this blog on how Golem supersedes many of the existing agentic frameworks.

## 🔹 Polluting the Idea of AI Agents with Classic System Design Problems

This may be a bit opinionated, but you're welcome to consider my other thoughts shared publicly before reflecting on the points below.

Wherever I search for AI agents, the answer is not just AI agents, but AI agents *along with something else*. I call it "polluting the idea of AI agents" — as if somebody is deliberately pulling the whole thing back to square one.

The main questions are as follows:

- When I use this framework, did you expose a DSL such that you (your runtime) know how I interacted with an LLM model (GPT4 as an example) in a certain way?
- Which part of your example is really an AI agent? Is everything an AI agent? Where is that boundary between agents and non-agents within your system?
- Why does my code look different compared to what I would have normally written while still using the reasoning and decision-making power of AI to design the workflow? End of the day, everything is still code.

## 🔹 Current AI Agent Frameworks

Before I clarify the problem with better examples in code, let's be aware of the existing frameworks:

- LangGraph/LangChain/Open SWE
- Microsoft Agent Framework
- AutoGen
- Semantic Kernel
- Dapr Agents
- SuperAGI

These are listed here for the sake of completion. In this blog, I used LangGraph as only a reference to explain the fundamental reason as to why Golem stands out in the world of agentic, and why it is important for developers to have an eye on the entire ecosystem of Golem.

### An Example of Invoking LLM

Here is a code snippet that makes use of an LLM model with necessary tools bound to the LLM model.

```python
llm = ChatOpenAI(model="gpt-4o-mini", api_key="sk-...", temperature=0)

# where search_web and get_weather are functions decorated with @tools
tools = [search_web, get_weather]
query = "What is the weather in NYC?"
response = llm.invoke(query)
print(response.content)
```

Under the hood, LLM decides which tools to invoke and responds with a tool response, and the local orchestration of LangGraph ensures to call that tool function to get a possible non-user-friendly response, which it passes to LLM again to get a reasonably human-friendly summary.

### An Example of a Custom-Built Agent

LangGraph uses nodes (to represent functions) and graph edges (to define the workflow blueprint):

```python
from langgraph.graph import StateGraph, END

class CounterState(dict):
    count: int
    name: str

def increment_node(state: CounterState):
    new_value = state.get("count", 0) + 1
    return {"count": new_value}

graph = StateGraph(CounterState)
graph.add_node("increment", increment_node)
graph.add_edge("increment", END)

counter_agent = graph.compile()
state = {"count": 0, "name": "myCounter"}
result = counter_agent.invoke(state, {"action": "increment"})
print(result)  # {"count": 1, "name": "myCounter"}
```

## 🔹 That's Where the Agentic Aspect Starts to Get Diluted

While there is an LLM call in the process — the key part of the example above lies in its **custom state management**. This mechanism only comes into play when we use **nodes** and **graph edges**.

This is exactly where the line between **true agentic behavior** and **standard stateful workflow management** begins to blur.

## 🔹 A Counter Agent in Golem

Welcome to [Golem](https://www.golem.cloud)! Let's get straight to the hands-on:

```typescript
import { BaseAgent, agent } from '@golemcloud/golem-ts-sdk';

@agent()
class CounterAgent extends BaseAgent {
    private value: number = 0;

    async increment(): Promise<number> {
        this.value += 1;
        return this.value;
    }
}
```

### Boundary Between Agent and Non-Agent Is Clear

To make `Counter` a non-agent, all you need to do is remove the `@agent` decorator. It becomes a *tool* which your other agents can internally use.

***Had this been a simple tool instead, the state of the counter is still reliable in Golem with zero effort from the developer.***

```typescript
class Counter {
    private value: number = 0;

    async increment(): Promise<number> {
        this.value += 1;
        return this.value;
    }
}
```

On the flip side, think about making your `CounterAgent` which you wrote using LangGraph to be non-agentic and convert it to a tool. This would result in almost a full rewrite.

This is the proof that an [agent-native runtime](https://www.golem.cloud) allows better orthogonality in your design.

## 🔹 Agent to Agent and Scalability by Default

```typescript
@agent()
class AssistantAgent extends BaseAgent {
  constructor(readonly username: string) {
    super()
  }

  async query(input: string): Promise<string> {
    const remoteWeatherAgent = WeatherAgent.get(this.username);
    const weather = await remoteWeatherAgent.getWeather("NYC")
    return `Hello ${this.username}, you asked about "${input}". Here's the weather info: ${weather}`;
  }
}

@agent()
class WeatherAgent extends BaseAgent {
  constructor(private readonly username: string) {
    super();
  }

  async getWeather(input: string): Promise<string> {
    return "It's sunny and 25C"
  }
}
```

Given you considered `AssistantAgent` and `WeatherAgent` to be agents using the `@agent` decorator, Golem automatically runs them as separate tasks (or processes) which may or may not run in a single node. With `WeatherAgent.get` you summoned a client which allows you to talk to a remote weather agent. This is possible with zero intervention into infrastructure!

With zero development effort, every user (defined by username above) will have their own weather agent and assistant agent running. They can independently scale up or down with zero memory usage when they are idle. Had there been a state in any of these agents, that is also kept intact.

## 🔹 Why Golem Is Devoid of Other Problems in Your Agent?

Golem is an ecosystem with a ***runtime*** natively talking about agents while solving hard problems of system design automatically, and not just a ***library or SDK***. The fundamental lies in leveraging static analysis of the code you write to deliver **automated reliability**. This is not done by most of the other frameworks, where you as a developer need to let the local backend know about every step you jump through in your code.

On the other hand, in Golem, this static observation of the code is fed into its **runtime and the rest is handled by it. It has all the information of what you wrote. Example: It knows where exactly an IO happens to call another agent.** This is the reason it is devoid of explicit state management or persistence or scaling.

Thus, it allows developers to just focus on business logic!

## 🔹 Encoding Workflow in a Graph vs Simple TypeScript Instructions

In LangGraph, you encode what you need in a graph as nodes and edges. Every function will become a node, with transitions being encoded as edges.

Back in Golem, this is a normal set of instructions that you usually write in TypeScript. Call first agent, and then call the next, and then call the third one, and stop if needed or loop through. There is no special thing to exercise to get it going.

## 🔹 And Why LangGraph Code Feels More Complicated?

**It's a *library***, not a ***runtime as such***. If the runtime is devoid of the important details of the code by default, you need to help it out with complex APIs even to do a simple function call, with a mixed bag of plugins that could solve various classic system design problems.

In other words, it relies on the aspect of somehow informing the backend about everything that you do: the agent's state, its decisions and transitions. That's why you saw me write a `StateGraph`, a `node`, `edges`, and `END`.

**Explicit state passing**. In Golem, you just write `this.value += 1`, and the runtime makes `value` durable. In LangGraph, you pass around a `state` dictionary that you mutate step by step as part of a graph.

**Reliability is "bring your own"**. By default, if you restart the process, your counter resets to `0`. You must add a persistence layer (checkpoints, databases) if you want durability.

In short it's still a **framework, not infrastructure**. This is not an issue of LangGraph by itself. In fact, I consider LangGraph to be a matured, well-focused framework and does its job very well for what it is designed to. Good documentation along with well-defined APIs are two strong points of LangGraph.

## 🔹 Golem Still Claims SDK Independence?

For those who were already familiar with Golem's durability, you might be familiar with the claim of Golem being SDK independent. In other words, "you write code normally as you do, and let Golem take care of the rest".

The above examples clearly show how much SDK-independent Golem is compared to a framework that strongly depends on its library functions to get things going. SDKs do exist to make things easier for developers and not exactly for Golem's solution to durability and exactly-once semantics to work.

More recently, Golem has made a natural leap into the **agentic space**, with its **runtime natively understanding the semantics of agents** — with a strong focus on **developer experience (DX)**.

## 🔹 Agent Frameworks Are Batteries Included for AI. How About Golem?

```typescript
import * as llm from 'golem:llm/llm@1.0.0';
import * as webSearch from 'golem:web-search/web-search@1.0.0';

@prompt("What topic do you want to research?")
async research(topic: string): Promise<string> {
    const searchResult = searchWebForTopic(topic)
    let llmResult = llm.send([
        {
            tag: "message",
            val: {
                role: "assistant",
                name: "research-agent",
                content: [{
                    tag: "text",
                    val: `I'm writing a report on the topic "${topic}",
                    Your job is to be a research-assistant and provide me
                    an initial overview on the topic so I can dive into
                    it in more detail...`
                }]
            }
        }
    ])
    return llmResult
}
```

Golem provides first-class AI integrations through its component model — LLM, web search, and more — all accessible as standard imports without any framework lock-in.
