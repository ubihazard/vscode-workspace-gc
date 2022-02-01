# Visual Studio Code workspace garbage collector

Every time you create a workspace or simply open a folder, Visual Studio Code creates a workspace storage item associated with it for the purpose of keeping some workspace-specific settings and data (in Code a folder is really treated like a temporary workspace). This folder can be found at:

```sh
$vscodedata/user-data/User/workspaceStorage
```

(The value of `$vscodedata` depends on your system and Code portable mode.)

For some bizarre reason, Code doesn’t employ any mechanism to clean up this storage, even though most of workspace data stored in there might refer to stuff that is no longer even exist on your system. With time this storage would inevitably grow and become filled with lots of junk.

This little command line Node.js app cleans up your Visual Studio Code workspace storage by removing workspace entries that are no longer found on your system.

The program can run in batch or interactive mode (requiring confirmation for each entry marked for deletion). it is also possible to set up a list of exceptions separately for each data folder to whitelist certain entries and prevent their deletion. On top of this, there’s ability to clean up multiple workspace storages in one go, e.g. in case of multiple Code installations.

## How to Use

Cleanup a single workspace storage (by default, interactive mode is assumed):

```sh
node cleanup-workspaces.js $HOME/Applications/code-portable-data
```

Cleanup one workspace storage in batch mode (without prompt for changes) and another in interactive mode (with prompts to confirm deletion):

```sh
node cleanup-workspaces.js -b $HOME/Applications/code-portable-data -i $HOME/Applications/code-insiders-portable-data
```

Cleanup everything in batch mode:

```sh
node cleanup-workspaces.js -b $HOME/Applications/code-portable-data $HOME/Applications/code-insiders-portable-data
```

### Making exceptions

An example of `cleanup-workspaces.cfg` config:

```json
[
  "^/var/media/usbstick/",
  "assignment.*?/workspace.code-workspace$",
  "/my_wonderful_mess$",
  "secret"
]
```

To prevent:

  * deleting workspace storage data for any project located on a `usbstick` removable USB stick;
  * deleting data for a workspace project containing “assignment” in its path;
  * deleting data for a folder named “my_wonderful_mess”;
  * deleting anything containing “secret” in its path.

This file must me placed into each `workspaceStorage` folder where you want it to be applied:

```sh
$HOME/Applications/code-portable-data/user-data/User/workspaceStorage/cleanup-workspaces.cfg
```

All pattern matching is performed case-insensitively.

## Support

If you find [vscode-workspace-gc](https://github.com/ubihazard/vscode-workspace-gc) useful, you can [buy me a ☕](https://www.buymeacoffee.com/ubihazard "Show support")!
