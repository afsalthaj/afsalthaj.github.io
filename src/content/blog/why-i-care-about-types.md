---
title: 'Why I Care About Types'
description: 'Types aren''t bureaucracy — they''re a conversation with your future self.'
pubDate: 'Mar 20 2026'
category: 'the-lab'
---

Every time someone tells me types slow them down, I think about all the production incidents that would have been caught at compile time.

## The compiler as a colleague

A good type system isn't a gatekeeper. It's a colleague who reviews your code before you even push it. It catches the things you forgot, the edge cases you didn't consider, the assumptions you didn't know you were making.

## Making impossible states impossible

The real power of types isn't catching `null`. It's making *impossible states impossible*. When your types are right, entire categories of bugs simply cannot exist.

```rust
enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { session: Session },
}
```

There's no state where you're "connected" without a session. No state where you're "connecting" without tracking the attempt. The type *is* the documentation.

## Types as thought tools

Before I write any implementation, I write the types. They force me to think about the domain. What are the states? What are the transitions? What's the algebra of this problem?

Types aren't bureaucracy. They're a conversation with your future self. And your future self will thank you.
