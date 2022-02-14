# Example of Visual Studio Code startup script
# for macOS / *nix with automatic workspace cleanup

node cleanup-workspaces.js -b $HOME/.vscode
code & disown
