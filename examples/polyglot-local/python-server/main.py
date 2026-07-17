import os
from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)
DSN = os.environ.get("DATABASE_URL", "postgres://127.0.0.1:5433/postgres?sslmode=disable")


def db():
    return psycopg2.connect(DSN)


with db() as conn, conn.cursor() as cur:
    cur.execute(
        "CREATE TABLE IF NOT EXISTS notes (id serial PRIMARY KEY, who text NOT NULL, body text NOT NULL)"
    )
    conn.commit()


@app.get("/")
def index():
    with db() as conn, conn.cursor() as cur:
        cur.execute("INSERT INTO notes (who, body) VALUES (%s, %s)", ("python", "hello from python"))
        conn.commit()
        cur.execute("SELECT count(*) FROM notes")
        n = cur.fetchone()[0]
    return jsonify(service="python", notes=n)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PY_PORT", "8082")))
