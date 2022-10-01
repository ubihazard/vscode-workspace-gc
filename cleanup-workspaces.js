/* Remove lost or unused Visual Studio Code workspaces
// License: MIT
//
// https://buymeacoff.ee/ubihazard */

const debug = false;
const version = "1.0";

const fs = require ("fs");
const fsPath = require ("path");
const shell = require ('child_process');
const readline = require ("readline");
const rl = readline.createInterface ({
  input: process.stdin,
  output: process.stdout
});
rl.on ("close", () => process.exit (0));
const cwd = process.cwd();
const args = process.argv;
const script = args[1];
args.splice (0, 2);

function trace (msg) {
  if (debug) console.log (msg);
}

function prompt (query) {
  return new Promise (resolve => rl.question (query, resolve));
}

function slashes (path) {
  if (process.platform == "win32") return path.replace (/\//g, '\\');
  return path;
}

function slashesReverse (path) {
  if (process.platform == "win32") return path.replace (/\\/g, '/');
  return path;
}

function isDirectory (path) {
  return fs.statSync (path).isDirectory();
}

function removeWorkspace (storagePath, wspacePath) {
  trace (wspacePath);
  const opts = {cwd: fsPath.resolve ('.'), shell: true};
  if (process.platform == "win32") {
    shell.spawnSync ("rmdir", ["/s", "/q", wspacePath], opts);
  } else {
    shell.spawnSync ("rm", ["-r", "-f", wspacePath], opts);
  }
}

async function asyncForEach (arr, clb) {
  for (let idx = 0; idx < arr.length; ++idx) {
    await clb (arr[idx], idx, arr);
  }
}

let batchMode = false;
trace (cwd);

(async () => {
await asyncForEach (args, async arg => {
  if (arg == "-h") {
    const scriptName = fsPath.basename (script);
    console.log (
`Remove lost or unused Visual Studio Code workspaces
Version: ${version}

Usage: ${scriptName} [-b] [-i] <VSCode data folder> ...

-b: turn batch mode ON for the following data folder.

-i: turn batch mode OFF for the same.

Visual Studio Code data folder is a folder containing
user data (where workspace storage is) and installed extensions.

There may be multiple VSCode data folders specified
with separate batch mode flags attached to them.

https://buymeacoff.ee/ubihazard`);
    return;
  }

  /* Restore intiial working directory.
  // This is required in case if `arg` is a relative path
  // to VSCode data folder. */
  process.chdir (cwd);

  if (arg == "-b") {
    batchMode = true;
    return;
  }

  if (arg == "-i") {
    batchMode = false;
    return;
  }

  const storagePath = arg + slashes ("/user-data/User/workspaceStorage");
  trace (storagePath);

  if (fs.existsSync (storagePath)) {
    try {
      process.chdir (storagePath);
    } catch (err) {
      console.error (`Workspace storage not acessible: ${storagePath}`);
      return;
    }
  } else {
    console.error (`Workspace storage not found: ${storagePath}`);
    return;
  }

  /* Each VSCode workspace storage folder can be configured
  // with individual exceptions. Exceptions are in a form
  // of array of string path prefixes.
  //
  // If workspace target path matches any prefix it is guaranteed
  // to not be removed, - even if its target no longer exists. */
  const configPath = slashes ("../cleanup-workspaces.json");
  const exceptions = (() => {
    if (!fs.existsSync (configPath)) return [];
    try {
      const arr = JSON.parse (fs.readFileSync (configPath));
      /* Make regular expressions */
      arr.forEach ((xcept, idx) => {
        arr[idx] = new RegExp (xcept.toLocaleLowerCase());
      });
      return arr;
    } catch (err) {
      return undefined;
    }
  })();

  if (exceptions === undefined) {
    console.error (`Invalid workspace cleanup config: ${storagePath}/${configPath}`);
    return;
  }

  try {
    const wspaces = fs.readdirSync (".");

    await asyncForEach (wspaces, async wspace => {
      const wspacePath = slashes (`./${wspace}`);
      if (!isDirectory (wspacePath)) return;

      const wspaceConfig = slashes (`./${wspace}/workspace.json`);
      if (!fs.existsSync (wspaceConfig)) return;
      const settings = JSON.parse (fs.readFileSync (wspaceConfig));

      let targetPath = (() => {
        if (settings.folder) return settings.folder;
        if (settings.workspace) return settings.workspace;
        return "";
      })();

      if (targetPath == "") return;
      targetPath = slashes (decodeURIComponent (targetPath)
      .replace ("file:///", ""));

      if (!fs.existsSync (targetPath)) {
        /* Remove associated workspace storage folder
        // if its target no longer exists */
        let canRemove = true;
        exceptions.every (xcept => {
          /* We need to convert all file system path slases to '/'
          // for regex testing purposes, even on Windows */
          if (xcept.test (slashesReverse (targetPath).toLocaleLowerCase())) {
            canRemove = false;
            return false;
          }
          return true;
        });

        if (canRemove) {
          if (!batchMode) {
            try {
              const doRemove = await prompt (`Remove ${targetPath} [y/n]?\n> `);
              canRemove = doRemove == "y";
            } catch (err) {
              console.error ("Unable to prompt", err);
              process.exit (1);
            }
          }

          if (canRemove) {
            console.log (`Removing: ${wspace}`);
            removeWorkspace (storagePath, wspacePath);
          } else {
            console.log (`Skipping: ${wspace}`);
          }
        }
      }
    });
  } catch (err) {
    console.error (err);
  }
});

rl.close();
})();
