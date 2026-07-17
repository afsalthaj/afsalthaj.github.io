---
title: 'Nix Internals — What’s Happening Under the Hood'
description: 'A concrete walkthrough of the Nix store, profiles, generations, and garbage collection — the MySQL symlink story, updated for modern Nix and flakes.'
pubDate: 'Jul 17 2026'
category: 'the-lab'
---

This is the follow-up to [Nix Is Simpler With AI — The Bare Minimum You Shouldn't Skip](/blog/ai-made-nix-simple-the-bare-minimum/).

That post is about getting value quickly: list dependencies, generate a flake, run `nix develop`. This one is about what Nix is actually doing under the hood — useful once you are living with it.

I first wrote this mental model in 2020: [Use nix today onwards](https://afsalthaj.github.io/myblog/posts/2020-09-14-use-nix.html). You do **not** need to open that post. The walkthrough below repeats the important parts here, with commands updated for today’s Nix. The old post is only a historical pointer.

A bit opinionated, yet still true: if you were doing `brew install mysql`, that mutates a shared environment on your machine. If you install with Nix, you are not mutating “the” environment in the same way — you are adding immutable store paths and pointing a profile at them.

## Walkthrough: install MySQL the Nix way

Assume you do not have MySQL on the machine yet.

### Older CLI (`nix-env`)

Search, then install a specific version:

```bash
nix-env -qa 'mysql.*'
```

You get something in the spirit of:

```
mysql-5.7.27
mysql-8.0.17
mysql-connector-java-5.1.46
...
```

Then:

```bash
nix-env -iA nixpkgs.mysql80
# or, depending on your setup / channel naming:
# nix-env -i mysql-8.0.17
```

### Newer CLI (`nix profile`)

Same idea, different surface:

```bash
nix search nixpkgs mysql
nix profile install nixpkgs#mysql80
```

Either way, the important part is not which CLI you typed. It is where the bits actually landed.

## The store: nothing lands in `/usr/local`

Once installed, the package lives in the **Nix store**, under a path like:

```
/nix/store/<cryptographic-hash>-mysql-8.0.17/
```

Not at root. Not as a mutating overwrite of “whatever MySQL used to be.” The hash is the build identity: sources, dependencies, build recipe. Change an input → different hash → different path. Two MySQL versions can coexist because they are different store paths.

Inspect it:

```bash
ls -l /nix/store/*mysql*
```

You will see things like (hashes will differ on your machine):

```
/nix/store/lqigbpdcw281sy0k6nsi16kmj6972zrh-mysql-8.0.17/
  bin/
  lib/
  include/
  share/
```

And often related `.drv` files (the build recipes Nix recorded). The real binaries are under that store directory’s `bin/`.

So the “immutable” version of running MySQL is literally:

```bash
/nix/store/lqigbpdcw281sy0k6nsi16kmj6972zrh-mysql-8.0.17/bin/mysql
```

That works. It is also tedious. Nix’s trick is: give you that immutability **and** let you type `mysql`.

## Why typing `mysql` works: profiles are symlink trees

When you install Nix, your shell is set up so `~/.nix-profile/bin` is on `PATH` (historically via `/nix/etc/profile.d/nix.sh`; modern installs do the equivalent).

Look at the profile:

```bash
ls -l ~/.nix-profile
```

On many systems this is itself a symlink, for example:

```
~/.nix-profile -> /nix/var/nix/profiles/per-user/<you>/profile
```

(Modern installs may use XDG paths under `~/.local/state/nix/...` instead. Same idea: a user profile link.)

Inside the profile’s `bin/`:

```bash
ls -l ~/.nix-profile/bin | rg mysql
```

you see symlinks into the store:

```
mysql     -> /nix/store/lqig...-mysql-8.0.17/bin/mysql
mysqlslap -> /nix/store/lqig...-mysql-8.0.17/bin/mysqlslap
mysqlshow -> /nix/store/lqig...-mysql-8.0.17/bin/mysqlshow
...
```

So:

1. You type `mysql`
2. The shell finds `~/.nix-profile/bin/mysql` on `PATH`
3. That is a symlink into `/nix/store/<hash>-mysql-.../bin/mysql`

Convenience without copying binaries into a mutable shared prefix.

## Uninstall does not delete the store path

Remove MySQL from the profile:

```bash
# older
nix-env -e mysql

# newer
nix profile remove mysql   # exact name from `nix profile list`
```

After that, `mysql` may disappear from your `PATH`. The store directory under `/nix/store/<hash>-mysql-...` is usually **still there**.

That is the start of immutable package management:

- The profile no longer points at MySQL → your interactive shell “lost” it
- The bytes in the store remain until nothing needs them

Anything still referencing that store path (another generation, another profile, a running build, a GC root) keeps it alive. We will come back to deleting for real with garbage collection.

## Follow the symlink chain all the way down

`~/.nix-profile` is not the end of the story. Profiles are **versioned**.

Look at the per-user profile directory (path may vary slightly by install):

```bash
ls -l /nix/var/nix/profiles/per-user/$USER
```

You will see a pattern like:

```
profile-1-link -> /nix/store/...-user-environment
profile-2-link -> /nix/store/...-user-environment
...
profile-7-link -> /nix/store/...-user-environment
profile-8-link -> /nix/store/...-user-environment
profile        -> profile-8-link
```

And:

```
~/.nix-profile -> .../profile -> profile-8-link -> /nix/store/<hash>-user-environment
```

That `user-environment` store path is a directory of symlinks (including `bin/`) to the packages that generation considers installed.

Every `nix-env` / `nix profile` change creates a **new** user-environment in the store and a new `profile-N-link`, then swings the `profile` pointer to it. Old generations stay around on purpose — so you can roll back.

In other words:

| Link | Meaning |
| --- | --- |
| `~/.nix-profile` | “My current user profile” |
| `profile` | Points at the current generation |
| `profile-8-link` | Generation 8 |
| `/nix/store/...-user-environment` | The actual symlink forest for that generation |
| `/nix/store/...-mysql-...` | The real package contents |

Different users get different profiles, so one person’s installs do not rewrite another person’s environment.

## Generations: rollback is a pointer swing

List generations:

```bash
# older
nix-env --list-generations

# newer
nix profile history
```

Example output shape:

```
   1   2020-09-04 17:45:33
   ...
   7   2020-09-14 17:06:05
   8   2020-09-14 17:22:46   (current)
```

Roll back one step:

```bash
# older
nix-env --rollback

# newer
nix profile rollback
```

Now `profile` points at `profile-7-link` instead of `profile-8-link`. Your previous environment is back — not because Nix restored a tarball of hope, but because generation 7’s user-environment still exists in the store.

Jump to a specific generation:

```bash
nix-env --switch-generation 8
# or with nix profile: nix profile rollback --to <generation>
```

You can also switch profiles entirely (less common day-to-day):

```bash
nix-env --switch-profile /nix/var/nix/profiles/my-profile
```

That works cleanly because `PATH` goes through `~/.nix-profile`, and `~/.nix-profile` is just a pointer.

## Disk space: garbage collection

If uninstall and upgrade only create new generations with new symlink forests, nothing ever disappears from `/nix/store` until you say so.

The **garbage collector** removes store paths that are not reachable from any GC root. Profile generations **are** roots. That is why rollback works — and why disk usage grows until you delete old generations.

Important detail from the Nix docs, still true: for GC to be effective, you should also delete (some) old generations. Otherwise those generations keep their packages alive forever.

```bash
# delete old generations of profiles, then collect
nix-collect-garbage -d

# collect unreachable store paths (without the -d generation wipe)
nix-store --gc

# older explicit form
nix-env --delete-generations old
```

If you only remove MySQL from the *current* profile but keep twenty old generations that still include it, the MySQL store path stays. Expected. Not a bug.

## Channels vs flakes

### Channels (the 2020-era default)

A **channel** is a subscribed URL of Nix expressions + a manifest. Example:

```bash
cat ~/.nix-channels
# https://nixos.org/channels/nixpkgs-unstable nixpkgs

nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs
nix-channel --update
```

`nix-env -qa` / installs often resolve packages through that channel view. Updating a channel and upgrading packages creates new profile generations whose symlinks point at newer store paths.

Channels still exist. They are no longer the best default for **project** tooling.

### Flakes (the 2026 default for projects)

A flake pins inputs explicitly and locks them:

```nix
inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
```

`flake.lock` freezes the exact revision. Your project stops depending on “whatever channel happened to be on this laptop last Tuesday.”

That is why the previous post pushes `flake.nix` + `nix develop` for real work: the dependency list travels with the repo.

## Where `nix develop` fits in this picture

`nix-env` / `nix profile` install into a **standing user profile** — the symlink chain above, stuck on your `PATH` until you change generations.

`nix develop` is usually **project-scoped and temporary**.

When you enter a flake’s `devShell`, Nix builds (or reuses) a derivation and puts those packages on the environment for **that shell session**. Leave the shell → those tools leave that session’s `PATH`.

Under the hood it is still `/nix/store/<hash>-...` paths. The difference is the wiring:

| Mechanism | Lifetime | Typical use |
| --- | --- | --- |
| User profile (`nix profile` / `nix-env`) | Sticky on your account | Personal always-on tools |
| `nix develop` | This shell / this project | Project toolchains (JDK, sbt, Go, Postgres client tools, …) |

That is how the hello-world, legacy, and polyglot examples in the previous post coexist: different flakes, different store closures, no fight over a single global MySQL/Java/Go.

## A compact map

| Piece | Role |
| --- | --- |
| `/nix/store/<hash>-name` | Immutable build result (the real MySQL, JDK, …) |
| `user-environment` | One generation’s symlink forest into the store |
| `profile-N-link` | Named generation pointer |
| `~/.nix-profile` | Convenience link to your current profile/generation |
| Channel | Older moving view of nixpkgs |
| Flake + lock | Explicit, pinned project inputs |
| `nix develop` | Temporary project environment from a flake |
| GC | Deletes store paths with no remaining roots |

## Why this matters once AI writes the flake

AI can generate `flake.nix`. That gets you productive.

The internals are what keep you calm when something looks weird:

- “I uninstalled MySQL, why is it still under `/nix/store`?” — because uninstall removed profile symlinks, not necessarily the store path; generations are GC roots.
- “Why does `mysql` work without the full store path?” — `PATH` → `~/.nix-profile/bin` → symlink into the store.
- “Why did rollback work?” — you swung `profile` back to an older `profile-N-link` whose user-environment still exists.
- “Why do two projects disagree on Java?” — different flakes, different store closures; that is the feature.

Immutability here is not a slogan. It is a filesystem of hashed paths, a thin layer of profile symlinks for convenience, and garbage collection for when nothing points at the old stuff anymore.

Hands-on first, if you have not done it yet: [Nix Is Simpler With AI — The Bare Minimum You Shouldn't Skip](/blog/ai-made-nix-simple-the-bare-minimum/).
