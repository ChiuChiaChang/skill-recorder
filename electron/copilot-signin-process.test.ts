import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

import { copilotSignInCommand, runCopilotLogin } from "./copilot-signin-process";

test("login runs the bundled executable without a shell, terminal, or writable stdin", async () => {
  await runCopilotLogin("C:\\Program Files\\Recorder & More\\copilot.exe", new AbortController().signal,
    (file, args, options) => {
      assert.equal(file, "C:\\Program Files\\Recorder & More\\copilot.exe");
      assert.deepEqual(args, ["login", "--web-flow"]);
      assert.equal(options.windowsHide, true);
      assert.equal(options.shell, undefined);
      assert.equal(options.detached, undefined);
      assert.equal(options.stdio, "ignore");
      return spawn(process.execPath, ["-e", "process.exit(0)"], options);
    });
});

test("manual commands quote spaces and apostrophes for PowerShell and POSIX shells", () => {
  assert.equal(copilotSignInCommand("C:\\User's files\\copilot.exe", "win32"),
    "& 'C:\\User''s files\\copilot.exe' login --web-flow");
  assert.equal(copilotSignInCommand("/User's files/copilot", "darwin"),
    "'/User'\\''s files/copilot' login --web-flow");
});

test("nonzero exit surfaces a safe error and never emits buffered CLI output", async () => {
  await assert.rejects(
    runCopilotLogin("copilot", new AbortController().signal, (_file, _args, options) =>
      spawn(process.execPath, ["-e", "console.error('private output'); process.exit(1)"], options)),
    /Copilot login did not complete/,
  );
});

test("missing executable is a visible failure", async () => {
  await assert.rejects(runCopilotLogin("nonexistent-skill-recorder-test-cli", new AbortController().signal),
    /Could not start the bundled Copilot CLI/);
});

test("cancellation waits for the app-owned child to close", async () => {
  const controller = new AbortController();
  let closed = false;
  const result = runCopilotLogin("copilot", controller.signal, (_file, _args, options) => {
    const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], options);
    child.once("close", () => { closed = true; });
    child.once("spawn", () => controller.abort());
    return child;
  });
  await assert.rejects(result, { name: "AbortError" });
  assert.equal(closed, true);
});

test("an already canceled attempt does not start a process", () => {
  const controller = new AbortController();
  controller.abort();
  assert.throws(() => runCopilotLogin("copilot", controller.signal, () => {
    assert.fail("must not spawn");
  }), { name: "AbortError" });
});
