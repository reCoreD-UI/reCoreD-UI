{
  nixConfig = rec {
    experimental-features = [ "nix-command" "flakes" ];

    substituters = [
      # Replace official cache with a mirror located in China
      #
      # Feel free to remove this line if you are not in China
      "https://mirrors.ustc.edu.cn/nix-channels/store"
      "https://mirrors.ustc.edu.cn/nix-channels/store" # 中科大
      "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store" #清华
      "https://mirrors.bfsu.edu.cn/nix-channels/store" # 北外
      "https://mirror.sjtu.edu.cn/nix-channels/store" #交大
      #"https://cache.nixos.org"
    ];
    trusted-substituters = substituters;
    trusted-users = [
      "coder"
    ];
  };

  inputs = {
    naersk.url = "github:nix-community/naersk/master";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils, naersk }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        naersk-lib = pkgs.callPackage naersk { };
      in
      {
        defaultPackage = naersk-lib.buildPackage {
          src = ./.;
          buildInputs = with pkgs; [

          ];
        };

        devShell = with pkgs; mkShell {
          buildInputs = [
            go
            nodejs
            tokei
          ];
          GOPATH = "/home/coder/.cache/go";
        };

        nixosModule = { config, pkgs, lib, ... }: with lib;
          let
            cfg = config.services.recored-ui;
          in
          {
            options.services.hangitbot = {
              enable = mkEnableOption "reCoreD-UI service";

              token = mkOption {
                type = types.str;
                example = "12345678:AAAAAAAAAAAAAAAAAAAAAAAAATOKEN";
                description = lib.mdDoc "Telegram bot token";
              };

              tgUri = mkOption {
                type = types.str;
                default = "https://api.telegram.org";
                example = "https://api.telegram.org";
                description = lib.mdDoc "Custom telegram api URI";
              };

              groupBanned = mkOption {
                type = types.listOf types.int;
                default = [ ];
                description = lib.mdDoc "GroupID blacklisted";
              };

              extraOptions = mkOption {
                type = types.str;
                description = lib.mdDoc "Extra option for bot.";
                default = "";
              };
            };

            config =
              let
                args = "${cfg.extraOptions} ${if cfg?tgUri then "--api-uri ${escapeShellArg cfg.tgUri}" else ""} ${if cfg?groupBanned then concatStringsSep " " (lists.concatMap (group: ["-b ${group}"]) cfg.groupBanned) else ""}";
              in
              mkIf cfg.enable {
                systemd.services.hangitbot = {
                  wantedBy = [ "multi-uesr.target" ];
                  serviceconfig.ExecStart = "${pkgs.hangitbot}/bin/hangitbot ${args} ${escapeShellArg cfg.token}";
                };
              };
          };
      });
}
