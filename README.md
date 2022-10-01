# Visual Studio Code workspace garbage collector

Every time you create a workspace or simply open a folder, [Visual Studio Code](https://code.visualstudio.com) creates a workspace storage item associated with it for the purpose of keeping some workspace-specific settings and data. (In Code a folder is really treated like a temporary workspace.) Workspace storage can be found at:

```console
$vscodedata/user-data/User/workspaceStorage
```

(The value of `$vscodedata` depends on your system and Code portable mode.)

For some bizarre reason, Code doesn’t employ any mechanism to clean up this storage, even though most of workspace data stored in there might refer to stuff that is long gone. With time this storage would inevitably grow and become filled with lots of junk.

Ideally, Code should provide some kind of graphical interface in form of a spreadsheet that would allow careful inspection and manual removal of unneeded workspace storage. For now, this little command-line Node.js script will do the job by removing workspace entries that no longer exist on your system.

The utility can run in batch or interactive mode (requiring confirmation for each entry marked for deletion). it is also possible to set up a list of exceptions separately for each data folder to whitelist certain entries and prevent their accidental deletion. On top of this, you can clean up multiple workspace storages in one go, e.g. in case of multiple Code installations.

*Note that __vscode-workspace-gc__ never removes any code or project files themselves. It only deletes VS Code settings associated with non-existent projects.*

## How to Use

Clean up a single workspace storage (by default, interactive mode is assumed):

```console
node cleanup-workspaces.js $HOME/Applications/code-portable-data
```

Clean up one workspace storage in batch mode (quiet mode) and another in interactive mode (with prompts to confirm deletion):

```console
node cleanup-workspaces.js -b $HOME/Applications/code-portable-data -i $HOME/Applications/code-insiders-portable-data
```

Clean up everything in batch mode:

```console
node cleanup-workspaces.js -b $HOME/Applications/code-portable-data $HOME/Applications/code-insiders-portable-data
```

### Making exceptions

An example of `cleanup-workspaces.json` config:

```json
[
  "^/var/media/usbstick/",
  "assignment.*?/workspace.code-workspace$",
  "/my_wonderful_mess$",
  "secret_masterpiece"
]
```

To prevent:

  * deleting workspace storage data for any project located on a `usbstick` removable USB drive;
  * deleting data for a workspace project containing “assignment” in its path;
  * deleting data for a folder named “my_wonderful_mess”;
  * deleting anything containing “secret_masterpiece” in its path.

This file must me placed into each `User` folder where you want it to be applied, e.g.:

```console
$HOME/Applications/code-portable-data/user-data/User/cleanup-workspaces.json
```

All pattern matching is performed case-insensitively.

## ⭐ Support

If you find [vscode-workspace-gc](https://github.com/ubihazard/vscode-workspace-gc) useful, you can [buy me a ☕](https://www.buymeacoffee.com/ubihazard "Donate")!
