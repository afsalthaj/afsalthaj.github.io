---
title: 'Docker and Managing Integration Tests — A Better Approach'
description: 'No more bash orchestration and separate compose files. Everything Docker becomes a first-class citizen in your SBT project.'
pubDate: 'Dec 2 2018'
category: 'the-lab'
---

Its good to talk about summary in an intro:

As a summary of requirements, there shouldn't be any more separate docker related orchestrations. Everything that you do with docker are first class citizens in the project that can run along with other test cases in your project. We can see bits and pieces of code everywhere trying to achieve this, but here we strive for the best possible way of doing it.

Let's list down our requirements first.

### Requirement 1

For certain test cases we need to run a docker-compose as the first step, which in turn depends on creating a few images, plus a few other custom steps.

### Requirement 2

Separately being able to run tests that rely on docker under the hood, while running `sbt test` should ideally avoid these slow running tests.

Although sbt `it` can solve this to some extent, we need a better name-spacing management. Integration tests are in general refer to a wider context, while we prefer specific management of docker tests.

### Requirement 3

One thing I need to have is, being able to spin up the docker-compose explicitly but avoid running test cases at times. This might sound silly because isn't it what docker-compose all about? Yes, it is, but since we are aiming for more, we shouldn't discard this simple feature, because it allows me to do some verifications of the containers or its filesystem manually. If compose-up is tightly coupled to the functional test cases beyond an extent, this is fairly impossible. This requirement discards `DockerComposeUp` within test cases. If you are looking to compose-up within test cases, then this link is going to be extremely useful:
https://github.com/testcontainers/testcontainers-scala

### Requirement 4

As part of these requirements, we also prefer having the docker-compose.yml generated from sbt without polluting git history. In short, just about everything related to docker should come only through SBT. We need only 1 complexity, not more!

I am motivated to consider this as a requirement because I have had tough times managing the dockerFiles and compose yamls as separate hardcoded files. This will also avoid the complexities of overloaded context being passed to docker daemons and thereby accidentally slowing down the image creations. I initially solved this using a shell-script like a good pragmatic developer, but not anymore!

### My philosophy on Integration Tests

Well, to be honest, apart from the simple requirements above, there are some philosophical reasons leading to some of my design choices. To make it sound more practical, I am copy pasting my own comments in the code base that I am working on. I urge you to read through them :)

1. The "real" environment for "real" testing shouldn't be mutated anywhere else other than the application itself. This leads to better testing of the lifecycle of an application.
2. Multiple integration tests sharing the same environment is a tragic situation. Stop reusing. Don't be lazy.
3. If you want to run concurrency tests, run multiple instances of the same application within the same test case, with obviously a test environment completely new and not being used/mutated anywhere else.
4. To trouble shoot test environment, you should be able to spin up just the test environment in isolation. A build task could be a perfect solution to do this. You are building an environment that your app is supposed to work on.
5. If your integration test fails, it means you don't know about the real test environment. So come back to build configs to know more about it, and change your test cases.


I would like to add a controversial note along with the philosophical reasons to not put docker as part of the spec.

Docker integration tests are completely indeterministic. We can't disagree with the fact, we are always in a "fingers-crossed" situation when our boss tries to run our integration test in his machine._ **_At the mercy of God_**_!
This happens due to a variety of reasons.
- We might have done port mappings in docker-compose files
- There is a host machine dependency for your docker environment. An example is putting a README of what to change in /etc/hosts on running integration tests, may be to run from an IDE.

There is a whole bunch of issues similar to the above bullet points, but I am stopping it here. Running docker test from outside of the containers from a different network, through port mappings is not really what is happening in a real environment most of the time. Example; Your kafka stream job is part of the same docker-compose file as that of broker, zookeeper, and kafka which you might be deploying through kubes or rancher, and the stream job will successfully talk to the topic and get the data. The same operation of reading the topic may fail in your integration test because you are reading it from outside of the kafka world. Trying to fix it through port mappings is cheating, and in fact it's a waste of time. This will also involve dependency mismatch — the kafka client that you used in integration test will be different from the image versions. I am going to post a different blog solving these type of problems. But I would definitely want you to get the gist of what I am trying to say in this side note.
Nevertheless, all the solutions that I am going to propose in future, will require the same set up which I am going to explain in this blog. It will unfortunately become too big, if I try to solve all of these issues as part of the same blog. So, thanks in advance for your patience. I also recommend trying this pattern which will uncover lot many things that you could now do with your test set up especially in the CI-CD side of things. Again I am going off the topic a bit here. Let's get into the business.

---

## Let's start the set up now

The main concepts involved:

1. **Dockerish** stuffs
2. Sbt **Tasks**
3. Sbt **Scope**
4. Sbt **Tags** for scala test cases (with respect to Specs2 and ScalaCheck).

Don't worry, we will go step by step.

### Step 1

Add the required plugins in plugins.sbt

```scala
addSbtPlugin("com.tapad" % "sbt-docker-compose" % "1.0.34")
addSbtPlugin("se.marcuslonnberg" % "sbt-docker" % "1.5.0")
```

### Step 2

**Let's define a context that runs only docker related tests:**

**Ok, now we intend to run only those tests that depends on `Docker` in this context.** To avoid running other tests in this context, we use `tags`.

```scala
Tests.Argument(
  TestFrameworks.Specs2, "include", "DockerComposeTag"
)
```

This is a snippet that I used in build.sbt that says, let me include only those tests with the tag "DockerComposeTag". You can name the tag as you wish. Don't worry too much on this now. We will get to know more on tags later.

Note: This works with any test frameworks: ScalaCheck, ScalaTest, Specs, Specs2, JUnit.

In the example above, the argument required for Spec2 is `include` (or `exclude`) to include (or exclude) only those tests with the tag `DockerComposeTag`, and that in ScalaTest is `n` (or `l`) to include (or exclude) tests with the `DockerComposeTag`.


```scala
lazy val myProject = 
  (project in file("myProject"))
  .enablePlugins(DockerPlugin, DockerComposePlugin)
  .config(DockerTest)
  .settings(inConfig(DockerTest)(Defaults.testTasks): _*)
  .settings(testOptions in DockerTest := Seq(
     Tests.Argument(TestFrameworks.Specs2, "include", "DockerComposeTag"))
  )

```

**This ensures that `sbt docker-int:test` will run only those tests that are tagged with "DockerComposeTag".**

We will see how to tag a test case later on. Before that we need to ensure we are not running these long running tests when we call simple `sbt test`. To do that, we add 1 more level of setting as given below.

```scala
lazy val myProject = 
  (project in file("myProject"))
  .enablePlugins(DockerPlugin, DockerComposePlugin)
  .config(DockerTest)
  .settings(inConfig(DockerTest)(Defaults.testTasks): _*)
  .settings(testOptions in DockerTest := Seq(
     Tests.Argument(TestFrameworks.Specs2, "include","DockerComposeTag"))
  )
  // We exclude in other tests
  .settings(testOptions in Test := Seq(
    Tests.Argument(TestFrameworks.Specs2, "exclude", "DockerComposeTag"))
  )

```

**This ensures that `sbt test` avoids long running tests. For those who are wondering, "oh well I could use `it:test` coming inbuilt as part of sbt without much of a drama", I am not a fan of separate `it` folder in my tests, and not being able to reuse the test support functionalities that my other unit tests make use of.**

### Step 3

Now the next step is to create images, create docker-compose.yml, and `dockerComposeUp` before we run the `DockerTest`. We can achieve this using the addition of another setting to the above build configuration.

```scala
lazy val myProject = 
  (project in file("myProject"))
  .enablePlugins(DockerPlugin, DockerComposePlugin)
  .config(DockerTest)
  .settings(inConfig(DockerTest)(Defaults.testTasks): _*)
  .settings(testOptions in DockerTest := Seq(Tests.Argument(TestFrameworks.Specs2, "include",
    "DockerComposeTag")))
  // We exclude in other tests
  .settings(testOptions in Test := Seq(
    Tests.Argument(TestFrameworks.Specs2, "exclude", "DockerComposeTag"))
  )
  // Add the settings into the project before it is being used.
  .settings(DockerUtil.settings)
  .settings((test in DockerTest) := {
     DockerUtil.dockerComposeDown.dependsOn(test in DockerTest).dependsOn(DockerUtil.dockerComposeUp).value
  })
```

### Step 4

Let us see the sample `DockerUtil.scala` that is responsible for `docker-compose up` before any `DockerTest` is run.

```scala
// Take a look at the snippet. This is just a sample. You might have more/less steps as part of docker compose up
object DockerUtil {
  lazy val makeDockerFile = taskKey[Seq[ImageName]]("Make a docker image for the app.")
  lazy val makeDockerComposeFile = taskKey[File]("Make docker compose file for the project in resource managed location.")
  lazy val dockerComposeUp = taskKey[File]("docker-compose up for the project")

  def relativeDockerComposePath(resPath: File) = resPath / "docker" / "bin" / "docker-compose.yml"

  def settings = Seq(
    makeDockerFile := {
      val artifact: File = (assembly in  Compile).value
      val artifactTargetPath = s"/app/${artifact.name}"

      val dockerfile = new Dockerfile {
        from("openjdk:10-jre-slim")
        add(artifact, artifactTargetPath)
        cmd("java", "-jar", artifactTargetPath)
      }
      
      val dockerImageNames = Seq(
        ImageName(s"afsalthaj/myProject:latest"),
        ImageName(s"afsalthaj/myProject:${version.value}")
      )

      DockerBuild(
        dockerfile,
        DefaultDockerfileProcessor,
        streamImages,
        BuildOptions(),
        (target in docker).value,
        sys.env.get("DOCKER").filter(_.nonEmpty).getOrElse("docker"),
        Keys.streams.value.log
      )

      dockerImageNames
    },

    makeDockerComposeFile := {
      val resourcePath = (resourceManaged in Compile).value

      val imageName: ImageName = makeDockerFile.value(0)

      val targetFile = relativeDockerComposePath(resourcePath)

      // A sample content
      val content =
        s"""
           |version: '2'
           |services:
           |  zookeeper:
           |    image: confluentinc/cp-zookeeper:5.0.0
           |    hostname: zookeeper
           |    ports:
           |      - '32181:32181'
           | ......
           
           |  kafka:
           |    image: confluentinc/cp-enterprise-kafka:5.0.0
           |    hostname: kafka
           |  .......
           |
           |  schema-registry:
           |    image: confluentinc/cp-schema-registry:5.0.0
           |
           |  ....   
           |  custom-application:
           |    image: ${imageName}
           |    hostname: my-project-app
           |    depends_on:
           |      - kafka
           |      - schema-registry
           |      - kafka-create-topics
           |    ports:
           |      - '7070:7070'
   
        """.stripMargin

      IO.write(targetFile, content)
      targetFile
    },

    dockerComposeUp := {
      val file = makeDockerComposeFile.value
        DockerComposePlugin.dockerComposeStopInstance("pwxDockerInstance", composePath.getAbsolutePath)
        DockerComposePlugin.dockerComposeRemoveContainers("pwxDockerInstance", composePath.getAbsolutePath)
      file
    },
  )
}
```

### Step 5

Now the final step is to write tests that are tagged with `DockerComposeTag`.


```scala
import org.specs2.data.Tag
import org.specs2.matcher.MatchResult
import org.specs2.scalacheck.ScalaCheckFunction1
import org.specs2.specification.core.SpecStructure
import org.specs2.{ ScalaCheck, Specification }


class IntegrationTest extends Specification with ScalaCheck { self =>

  // The test requires external environment. In this case
  object DockerComposeTag extends Tag("DockerComposeTag")

  def is: SpecStructure =
    s2"""Runs an actual kafka cluster, stream engine, and pushes the data continuously $test ${tag(DockerComposeTag)}"""

  private def test: ScalaCheckFunction1[String, MatchResult[String]] =
    prop { g: String =>
      // Call kafka related things. Probably set minTestsOk=10, or a lower number. Property based on an actual environment
      // does seem to have an impedence mismatch.But for that reason, we don't need to hardcode sample data for instance. 
      // Upto you to decide on this. You can just rely on specs2 and not ScalaCheck when you do this test, if you need.
      g must_=== g
    }
}
```

---

## Result

`sbt docker-int:test` will run `docker-compose up` as the first step, and runs **_only_** `IntegrationTest`.

`sbt test` will run all tests except `IntegrationTest` and there won't be any `docker-compose up` or any sort of operations related to docker.

If you don't want to run tests but just compose-up, do `sbt dockerComposeUp`, and that will provide you with the environment the integration tests are supposed to run.

This is super helpful in troubleshooting the integration tests.
And once done, `sbt dockerComposeDown`. Yes, it is one of the strong requirements that I had forcing me to put docker deployments as part of `sbt` and not composing it up within functional tests.

No more bash orchestration and separate compose files, or dockerFiles in the project.

### Fantastic CI

```bash
sbt dockerComposeDown dockerComposeUp docker-int:test dockerComposeDown
```

I did a dockerComposeDown as the first step, because who knows if any CI agent has already got these containers running.

Thanks, and have fun!

--- 

Note: This blog was originally published on [Medium](https://medium.com/@afsal-taj06/docker-compose-management-using-sbt-and-property-based-tests-bb8ae7df2759), where it received some thoughtful responses.
