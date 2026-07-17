#!/usr/bin/env bash
# Start Postgres + Go + Python + ZIO HTTP. No Docker. Schema lives in the APIs.
set -euo pipefail
cd "$(dirname "$0")"

export PGDATA="$PWD/.pgdata"
export PGHOST=127.0.0.1
export PGPORT=5433
export PGUSER="${USER:-polyglot}"
export DATABASE_URL="postgres://${PGUSER}@${PGHOST}:${PGPORT}/postgres?sslmode=disable"

mkdir -p .pgsocket
[[ -d $PGDATA ]] || initdb -D "$PGDATA" --auth-local=trust --auth-host=trust --username="$PGUSER" >/dev/null
pg_ctl -D "$PGDATA" status >/dev/null 2>&1 || \
  pg_ctl -D "$PGDATA" -l .pglog -o "-p $PGPORT -k $PWD/.pgsocket" start >/dev/null

cleanup() {
  kill 0 2>/dev/null || true
  pg_ctl -D "$PGDATA" stop -m fast >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

(cd go-server && go run .) &
(cd python-server && python main.py) &
(cd scala-api && sbt -batch "runMain PolyglotMain") &

echo "up — curl http://127.0.0.1:8080/"
wait
