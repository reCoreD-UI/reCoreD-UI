{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        name = "recored-ui";
        version = "v1.0.0";
      in
      {
        defaultPackage = with pkgs; let
          web = buildNpmPackage {
            inherit version;
            pname = name;
            src = "${self}/web";
            npmDepsHash = "sha256-e4AYJa0PXhuBRytH4860v6t3DEcQ5awR24HeXRD5pew=";
          };
          app = buildGoModule {
            pname = name;
            inherit version;

            src = self;

            ldflags = [
              "-s"
              "-w"
            ];

            configurePhase = ''
              cp -r ${web}/lib/node_modules/web/dist server
              export HOME=/tmp/build
            '';

            installPhase = ''
              mkdir -p $out/bin
              cp recored-ui $out/bin
            '';

            doCheck = false;
            deleteVendor = true;
            proxyVendor = true;
          };
        in
        stdenv.mkDerivation {
          name = "${name}-${version}";
          src = self;
          installPhase = ''
            mkdir -p $out/bin
            cp ${app}/bin/recored-ui $out/bin
          '';
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
                serviceconfig.ExecStart = "${defaultPackage}/bin/recored-ui server";
              };
            };
          };
      });
}
