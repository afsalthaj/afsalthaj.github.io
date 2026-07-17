{
  description = "Polyglot local stack — sbt/ZIO HTTP + Go + Python + PostgreSQL (no Docker)";

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
            pkgs.go_1_23
            pkgs.postgresql_16
            (pkgs.python3.withPackages (ps: [
              ps.flask
              ps.psycopg2
            ]))
            pkgs.curl
            pkgs.jq
          ];

          shellHook = ''
            echo "=== polyglot-local toolchain ==="
            echo "java:      $(java -version 2>&1 | head -1)"
            echo "sbt:       $(sbt --version 2>/dev/null | tail -1 || sbt -version 2>&1 | tail -1)"
            echo "go:        $(go version)"
            echo "python:    $(python --version)"
            echo "postgres:  $(postgres --version)"
            echo ""
            echo "Start everything (no Docker):  ./run-all-servers.sh"
          '';
        };
      });
    };
}
