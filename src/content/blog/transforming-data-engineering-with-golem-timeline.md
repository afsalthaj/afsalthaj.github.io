---
title: 'Transforming Data Engineering with Golem & Durable Timeline Analytics'
description: 'Why existing data engineering frameworks are built on a suboptimal foundation, and how durable computing changes everything.'
pubDate: 'Jun 20 2024'
category: 'the-lab'
---

For engineers exploring **data engineering**, **data science pipelines**, and **Spark-like distributed workloads**, this article explains a durable execution approach that improves observability and reliability.

## Prelude

For those who work in the data engineering space (or even in the software engineering space building scalable backends), almost all frameworks and system designs expose a few terms (or their synonyms) that are quite common.

- **Job**: Responsible for solving a problem (e.g., finding the total number of users logging in from a particular country).
- **Executor/Task**: A unit of a job that handles a section or all of the (possibly large) data. We will refer to them as workers soon.
- **Streaming Job**: Deals with a stream of events (e.g., credit card events in the financial domain, temporary aggregations to make the final aggregation less computationally intensive, online near real-time reporting, etc.).
- **Batch Job**: Instead of computing data as it comes, the data is stored in a cluster, and the job runs once to process all the data.
- **State**: Internal state needed as part of a streaming/batch job.
- **Cache**: To reduce reads from the underlying data store or disk every time the executor needs to access data in-memory during computation.

Today's frameworks often use a global cache, which is a mix of all data sets organized in certain ways (indexing, partitioning, etc.). This can quickly become a big data set, leading to significant challenges in maintenance and debugging during failures. This issue exists in every backend architecture striving for scalability, with one solution being the use of sharded databases, though the details aren't relevant here.

## The Fundamental Problem

In short, due to failure scenarios, we cannot assign a particular executor to a deterministic set of data, as executors (or consumers of streamed events) may keep failing, requiring other executors/consumers to handle their data sections.

This fundamental problem of an executor not being deterministic (with changing data responsibilities) leads to various issues that users and framework developers must solve using complicated system designs.

### A Suboptimal Foundation — Leads to Problems That Shouldn't Have Existed

Bespoke engineering around existing frameworks in maintaining state, cache and boosting performance of the entire system requires specific framework knowledge.

If you think about it, this is all due to the opaqueness of the `jobs` performed by these data engineering frameworks. All you get is a plethora of graphs showing the progress of random tasks running in various nodes, whose responsibilities with respect to an entire logic of computation is vague!

I've submitted a job to Spark, but I'm unsure about its internal workings. I'd like to understand what's happening and where, so I can potentially reuse some of the intermediate datasets this streaming job produces in my next streaming job without needing to engineer too extensively with the framework or the data.

These are not the only problems this blog is trying to address — please read through the entire solution, which further resolves issues related to stream joins, existing watermark solutions, potential memory pressure, out-of-memory errors, watermark-based evictions, TTL, and more!

> Developers have moved on from discussing problems around caching, state management, big-data and so on, but they haven't escaped from it yet.

### Solutions in Various Ways

- Spark Streaming, Delta Lake
- Amazon Timestream, Apache Flink and so on
- Other bespoke solutions

So the first step here is to form the right abstraction to solve really hard data engineering problems before we integrate it with a killer backend such as Golem.

## What Do We Need Exactly?

- We need a DSL backed by the right primitive, allowing composition, observability and optimisations
- We need an executor that's deterministic, and integrates well with the DSL
- An executor that's transparent to the developer, from a domain perspective
- Be able to come back and peek at these tasks/executors anytime

## What Is a Timeline?

I recommend reading the paper if possible. However, I can simplify the terms here. This section doesn't explain Golem-Timeline but only the idea of Timeline.

We plot 4 timelines based on incoming events:

1. **"Has the user ever started playing"**: The application found that this is at T1 when reading the events. It's a boolean plot that turns true after T1.
2. **"Has the user ever performed a seek"**: We observe this at T2. Similarly, it's a boolean plot that turns true after T2.
3. There's a third timeline identical to the second one, but intentionally set to false after a configurable 5 seconds. This adjustment reflects that users don't seek indefinitely.
4. The fourth timeline is quite intriguing. It's a derived timeline based on another timeline that plots all states (such as seek, buffer, play, pause, etc.) as string values over time. We then apply an "EqualTo" operation on this timeline with the string value "Buffer", which produces a plot indicating the time period during which the state was "Buffer".

For simplicity, our `Timeline` is just a collection of `time -> event-value` pairs. If that's the case, we can do a logical `And` between timelines. If we do a logical `And` of all these three timelines, we get:

> "The total time period of buffering while the user was seeking"

So how do we compute the total buffer time that's *not* part of the seek event? We simply flip the second timeline (using `not`) and then do a logical `and` of `x`, `y`, and `z`. Now we get the buffer time that's not because of the seek event!

## What Is Golem?

Taken from its website: Golem is an evolution of serverless computing that allows workers to be long-lived and stateful. Through a new paradigm called *durable computing*, workers deployed onto Golem can survive hardware failures, upgrades, and updates, offering a reliable foundation for building distributed, stateful applications.

This description straight away addresses many of the burning concerns discussed above.

### What Does This Mean for Timeline?

Now that you have seen an example of a timeline operation, such as "has the user ever started playing", or the "duration in which user was seeking" — internally `timeline` will be a group of workers listening to events or other workers performing the logic based on the DSL node and these workers are durable. The state of these workers are simple in-memory maps. This implies deploying durable-timeline-analytics in your company doesn't involve a plethora of infrastructure requirements.

But the main point here is, this worker or group of workers live there forever and you can poke them to get the current status of, say, seek events! The responsibility of each of these workers doesn't change. Also developing timeline using Golem didn't require learning any other framework or language. Just plain Rust application to a significant extent!

Golem Timeline in fact can tell you which part of the computation is taken care of by which part of the executor (the worker), again, forever!

## Internals of Golem Timeline

One of the modules in Golem Timeline is the timeline, which serves as a library reused by other modules. One of its critical components is the representation of the timeline DSL itself.

```rust
pub enum TimeLineOp {
    EqualTo(WorkerDetail, Box<TimeLineOp>, GolemEventValue),
    Or(WorkerDetail, Box<TimeLineOp>, Box<TimeLineOp>),
    Not(WorkerDetail, Box<TimeLineOp>),
    TlHasExisted(WorkerDetail, GolemEventPredicate<GolemEventValue>),
    TlLatestEventToState(WorkerDetail, EventColumnName),
    TlDurationWhere(WorkerDetail, Box<TimeLineOp>),
}
```

Here you can see every node is annotated with the `WorkerDetail` (the worker in which this node is going to be running). `GolemEventValue` is nothing but the actual event, which should have an EventId and a Value which is an enum of `String`, `Float`, etc.

### Leaf and Derived Nodes

We then classified the Timeline nodes as either Leaf or Derived. Each node in the timeline DSL has specific semantics. For example, `TLHasExisted` consumes events directly to plot a timeline that answers "has the user ever started playing, and if so, when?". On the other hand, a node like `TlDurationWhere` consumes the output from another worker, where the output is typically a timeline of states.

**Event Processor (event-processor module)**

All leaf nodes are implemented into a WebAssembly component, and we call it event-processor!

- They are called event processor because their input is an event timeline
- The output is timeline of states
- These leaf node functions within 1 component module can run as one worker, or multiple workers — that's configurable

**Timeline Processor (timeline-processor module)**

We write another component called timeline-processor that implements the rest of the derived nodes:

- Every function in this component takes another timeline as input
- They take the input from either another instance of timeline processor or event-processor
- These nodes may work as a single worker or multiple workers

Any state backing these functions are simple Rust data structures. There is no need to learn nuances of another framework. We were writing a simple Rust program and building a WASM component to work with Golem.

**Core Module — The Orchestrator**

We have a third component called core (the core engine) that parses the DSL that's coming from the driver. The core orchestrator assigns the work to various other workers and builds a real execution plan.

It is another WASM component, that's deployed with Golem. So you don't need to worry whether this orchestrator fails or not :)

**Driver Module**

This is simply another WebAssembly component, that's the starting point of the entire workflow.

### The Final Workflow

This is the current state of the execution plan when you instantiate a durable-timeline-analytics job. Here you can see the worker information from which you can access the final result, as well as the leaf worker to which you will need to send the events to.

1. Kick off event feeder — a simple Pulsar consumer sending the events to event processors
2. The job keeps running. The event processors continuously stream
3. Invoke `get_timeline_result` in `result_worker`, returning the timeline value
4. Every worker has the same function that can be called at anytime, implying there is a consistent way to get the current status of every worker

## True Application-Level Observability

At the core, the declarative DSL allows us to inspect what's going on, and with Golem we also know which worker is taking care of which part of the computation too — forever! It is not a random bar diagram of a plethora of tasks and executors with its progress.

## Computation Reuse

In real-world scenarios, computation of a complex query involves running queries for primitives. For example, here is an example from the video distribution domain, where `CompletionRate` is derived from the primitives `Total Number of Playback Attempts Count` and `Total Number of Completed Playbacks`.

Once you start running a durable-timeline-analytics job to compute the above metrics, each worker will be responsible for computing certain parts of this computation. Golem-Timeline naturally may tackle this problem more like a map-reduce job, where we will have some final reducer workers that pull results from other intermediate workers and aggregate the results.

Let's say as part of the above computation, there is a reducer worker (`rw1`) that aggregates partial sums of playback attempts, and another (`rw2`) for completed playbacks, and a third (`rw3`) that divides these values.

The key point here is that when you run a completely separate job (by writing the DSL and deploying to the platform), which only calculates `total_playback_attempts_count`, your timeline infrastructure doesn't need to start a new job to form the results. Why? Because the platform already knows that `rw1` worker already has this result and the timeline framework skips this job and simply pipes out the data from `rw1`. Alternatively, the user can directly hit `rw1` and get the results.

## Stream-First Approach

Importantly, the results from `rw1` are not only accessible within the internals of the Timeline framework but also via an HTTP endpoint that developers can access to view these sub-computation results. This accessibility represents a significant advantage! The platform overhead is greatly reduced because any separate jobs developers spin up, especially for debugging purposes, do not require additional physical resources.

## Compliance Concerns

Firstly, any data that the business is concerned about can be stored in a persistent store. Golem-Timeline is not stopping you from doing it. Most probably this data is the final outcome of an entire job and not any intermediate data that exists while the job is running.

## Overhead of Employing Golem-Timeline

Using durable-timeline-analytics doesn't necessitate a complete overhaul of existing company platforms. Many companies heavily rely on Kafka/Pulsar/Kinesis to stream events into their platforms. With Golem Timeline, you're not altering this data flow. Deploying a Golem Timeline job simply means it's another job in your platform, akin to any other job if deployed on-premise. Over time, a suite of timeline jobs can gradually replace redundant tasks if necessary.

## Should the User Learn Rust?

As of now, yes, users should learn Rust to use the timeline DSL. However, all that's required is a basic understanding of Rust syntax. In the future, we plan to provide APIs in other languages of your choice.
