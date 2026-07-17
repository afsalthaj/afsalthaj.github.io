import zio._
import zio.http._
import zio.json._

object PolyglotMain extends ZIOAppDefault {

  final case class Out(service: String, go: String, python: String)
  object Out {
    implicit val encoder: JsonEncoder[Out] = DeriveJsonEncoder.gen[Out]
  }

  private def get(url: String): ZIO[Client, Throwable, String] =
    ZIO.scoped {
      Client.batched(Request.get(url)).flatMap(_.body.asString)
    }

  private val routes =
    Routes(
      Method.GET / Root -> handler { (_: Request) =>
        (for {
          go <- get("http://127.0.0.1:8081/")
          py <- get("http://127.0.0.1:8082/")
        } yield Response.json(Out("zio-http", go, py).toJson))
          .catchAll(e => ZIO.succeed(Response.text(e.getMessage).status(Status.BadGateway)))
      }
    )

  override def run =
    Server.serve(routes).provide(Server.defaultWithPort(8080), Client.default)
}
