import { spawn, type ChildProcess, type SpawnOptions } from "node:child_process";

import { SignInError } from "./copilot-signin-flow";

export function copilotSignInCommand(cliPath: string, platform = process.platform): string {
  const quoted = platform === "win32"
    ? `& '${cliPath.replace(/'/g, "''")}'`
    : `'${cliPath.replace(/'/g, `'\\''`)}'`;
  return `${quoted} login --web-flow`;
}

/**
 * Own the actual CLI process, not a detached terminal launcher. Browser OAuth works
 * without a console; shell interpolation and a lingering cmd /k are unnecessary.
 */
export function runCopilotLogin(
  cliPath: string,
  signal: AbortSignal,
  spawnProcess: (file: string, args: string[], options: SpawnOptions) => ChildProcess = spawn,
): Promise<void> {
  signal.throwIfAborted();
  return new Promise<void>((resolve, reject) => {
    const child = spawnProcess(cliPath, ["login", "--web-flow"], {
      windowsHide: true,
      // No stdin means no automatic consent to plaintext credential storage.
      stdio: "ignore",
    });
    const abort = () => {
      child.kill("SIGKILL");
    };
    signal.addEventListener("abort", abort, { once: true });
    let launchFailed = false;
    child.once("error", () => {
      launchFailed = true;
      // Spawn failures also emit close; wait for it before releasing the sign-in lock.
    });
    child.once("close", (code) => {
      signal.removeEventListener("abort", abort);
      if (signal.aborted) reject(signal.reason);
      else if (launchFailed) reject(new SignInError("Could not start the bundled Copilot CLI. Reinstall the app or use the command below."));
      else if (code === 0) resolve();
      else reject(new SignInError("Copilot login did not complete. Try again, or run the command below in a terminal to see the CLI's instructions."));
    });
    if (signal.aborted) abort();
  });
}
