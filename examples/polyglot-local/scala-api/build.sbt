ThisBuild / scalaVersion := "2.13.16"
ThisBuild / version      := "0.1.0"

lazy val root = (project in file("."))
  .settings(
    name := "polyglot-scala-api",
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio"      % "2.1.16",
      "dev.zio" %% "zio-http" % "3.1.0",
      "dev.zio" %% "zio-json" % "0.7.39"
    )
  )
