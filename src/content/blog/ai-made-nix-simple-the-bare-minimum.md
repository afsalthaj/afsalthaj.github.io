---
title: 'Nix Is Simpler With AI — The Bare Minimum You Shouldn''t Skip'
description: 'Hate Nix or new to it? AI collapsed the barrier. flake.nix + nix develop — bare minimum, hard to ignore.'
pubDate: 'Jul 17 2026'
category: 'the-lab'
---

**Nix is simpler with AI.**

If you hate Nix, or if you are new to Nix — either way, this is for you. The old objection was real: alien syntax, loud errors, a side quest you never asked for. That barrier is mostly gone. You list what the project needs. AI writes `flake.nix`. You run `nix develop` and work.

Focus on what Nix **provides**:

- a declared, immutable, project-scoped toolchain
- no more lying README with a long install checklist
- Go 1.22 next to Go 1.23, Python 3.11 next to 3.12, Terraform 1.5 next to 1.9 — without `pyenv` / `nvm` / `tfenv` / `jenv` theatre
- kubectl, helm, cloud CLIs, JDK, Node — whatever the repo needs — without mutating your whole machine

This post walks toward a project with **many** dependencies (Go, Python, Scala, Postgres, …). It does **not** ask you to install any of that by hand.

## Stop writing a long README on how to set up the project locally

Once the team has Nix, setup is this:

```bash
cd my-project
nix develop          # or: nix develop -c zsh
```

Done. Dusted. Refuse Nix if you want — keep the version managers. Up to you.

## Install Nix quickly (macOS)

```bash
curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install | sh
```

Enable flakes if needed (`~/.config/nix/nix.conf`):

```
experimental-features = nix-command flakes
```

Other platforms: [https://nixos.org/download/](https://nixos.org/download/).

## A hello-world you can try today

Tiny Scala/sbt project + Nix toolchain.

`build.sbt`:

```scala
ThisBuild / scalaVersion := "2.13.16"
ThisBuild / version      := "0.1.0"

lazy val root = (project in file("."))
  .settings(
    name := "hello-nix",
    libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.19" % Test
  )
```

`src/main/scala/Hello.scala`:

```scala
object Hello {
  def main(args: Array[String]): Unit =
    println("hello from a Nix-managed JDK + sbt")
}
```

`flake.nix` (or ask AI to generate it):

```nix
{
  description = "Hello Nix — sbt + JDK dev shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs = { self, nixpkgs }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" "aarch64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f (
        import nixpkgs { inherit system; }
      ));
    in {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.jdk21
            pkgs.sbt
          ];
        };
      });
    };
}
```

```bash
nix flake lock
nix develop
java -version
sbt run
```

The JDK and sbt on your `PATH` come from this flake — not whatever random versions were already on the laptop.

## A separate legacy project: older versions on purpose

Same idea, older pin (`hello-nix-legacy`):

```nix
{
  description = "Legacy hello — older JDK + sbt via an older nixpkgs";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";

  outputs = { self, nixpkgs }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" "aarch64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f (
        import nixpkgs { inherit system; }
      ));
    in {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.jdk17
            pkgs.sbt
          ];
        };
      });
    };
}
```

```bash
cd hello-nix && nix develop          # JDK 21 world
cd hello-nix-legacy && nix develop   # JDK 17 world
```

Different directories. Different versions. No global fight.

## Ask AI for the next flake

You just saw `flake.nix`. Growing is not “learn Nix philosophy first.”

**What does this project depend on?** List it. Hand the list to AI. Review. Commit.

Go, Python, Terraform, kubectl, Docker, sbt, Node, cloud CLIs — whatever. That is the whole authoring loop.

## A more convincing project: polyglot local

When one repo needs several languages and a real database, the pitch stops being abstract.

Example in this repo: [`examples/polyglot-local`](https://github.com/afsalthaj/afsalthaj.github.io/tree/main/examples/polyglot-local).

One flake: JDK 21 + sbt (ZIO HTTP), Go 1.23, Python 3.12 + Flask, PostgreSQL 16.

```bash
cd examples/polyglot-local
nix develop          # or: nix develop -c zsh
./run-all-servers.sh
curl -s http://127.0.0.1:8080/
```

`run-all-servers.sh` only starts processes. The Go and Python APIs create the table, insert, and read. Scala aggregates both.

Ctrl+C and you are safe: no global “I installed Go/Python/Postgres forever” mutation. Leave `nix develop`, and that toolchain leaves your shell.

This is not “Nix instead of Docker.” Use Docker with Nix when you want. Ship to k8s when you want. Nix declares the toolchain; Docker/k8s run and schedule. Pick both when both help.

## Keep your zsh

```bash
nix develop -c zsh
```

Or in `~/.zshrc`:

```bash
nix() {
  if [[ $1 == "develop" ]]; then
    shift
    command nix develop -c zsh "$@"
  else
    command nix "$@"
  fi
}
```

## A short honest note at the end

I said AI made Nix simple so the hate camp would listen. Fair bait.

Honestly: I never thought Nix was the villain. I loved it in 2020 ([old post](https://afsalthaj.github.io/myblog/posts/2020-09-14-use-nix.html)), I love it now, and I will keep loving it. I love FP — Scala, Java, or Go, the philosophy sticks. For me, immutability and declared inputs do not stop at the function boundary — they belong in system design and local setup too. Knowing FP and still writing Java always worked for me.

AI lowers the door for everyone else. The values were already right.

Internals (store, profiles, generations, GC): [Nix Internals — What’s Happening Under the Hood](/blog/nix-internals-under-the-hood/).

### This website is Nix too

```bash
git clone https://github.com/afsalthaj/afsalthaj.github.io.git
cd afsalthaj.github.io
nix develop          # or: nix develop -c zsh
npm install
npm run dev
```
