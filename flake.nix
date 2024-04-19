{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages = rec {
          recored-ui = with pkgs; stdenv.mkDerivation rec {
            name = "recored-ui";
            src = self;
            buildInputs = [
              go
              nodejs
            ];
            buildPhase = ''
              cd web && npm i && npm run build && cd ..
              go get . && go generate ./... && go build . -o recored-ui -ldflags "-s -w"
            '';
            installPhase = ''
              mkdir -p $out/bin
              cp recored-ui $out/bin
            '';
          };
          default = recored-ui;
        };

        devShell = with pkgs; mkShell {
          buildInputs = [
            go
            nodejs
            dig
            tokei
          ];
          GOPATH = "/home/coder/.cache/go";
          RECORED_MYSQL_DSN = "recoredui:A123456a-@tcp(mysql.dev:3306)/recoredui?charset=utf8mb4";
        };

        nixosModule = { config, pkgs, lib, ... }: with lib;
          let
            cfg = config.services.recored-ui;
          in
          {
            options.services.hangitbot = {
              enable = mkEnableOption "reCoreD-UI service";

              mysql-dsn = mkOption {
                type = types.str;
                example = "recoredui:A123456a-@tcp(mysql.dev:3306)/recoredui?charset=utf8mb4";
                description = lib.mdDoc "mysql connection DSN";
              };

              extraOptions = mkOption {
                type = types.str;
                description = lib.mdDoc "Extra options";
                default = "";
              };
            };

            config = mkIf cfg.enable {
              systemd.services.recored-ui = {
                wantedBy = [ "multi-uesr.target" ];
                environment = {
                  RECORED_MYSQL_DSN = cfg.mysql-dsn;
                };
                serviceconfig.ExecStart = "${pkgs.recored-ui}/bin/recored-ui server";
              };
            };
          };
      });
}
