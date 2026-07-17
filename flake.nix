{
  description = "Dev shell for afsalthaj.github.io (Astro blog)";

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
            pkgs.nodejs_22
          ];

          shellHook = ''
            echo "Node $(node -v) / npm $(npm -v)"
            echo "Next: npm install && npm run dev"
          '';
        };
      });
    };
}
