import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { test } from "node:test"
import { fileURLToPath, pathToFileURL } from "node:url"

// npm scripts set npm_config_prefix to the local package; ignore that override.
const npmEnv = { ...process.env }
delete npmEnv.npm_config_prefix
// Use Pi's real loader and host-provided imports without installing another Pi.
const piRoot = process.env.PI_PACKAGE_DIR ?? join(
  execFileSync("npm", ["root", "-g"], { encoding: "utf8", env: npmEnv }).trim(),
  "@earendil-works/pi-coding-agent",
)
const { loadExtensions } = await import(pathToFileURL(join(piRoot, "dist/core/extensions/loader.js")))
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const provider = join(root, "tools/svg_tools.ts")
const source = (color = "#2563eb") => `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="white"/><circle cx="80" cy="50" r="25" fill="${color}"/></svg>`

async function child(t) {
  const cwd = mkdtempSync(join(tmpdir(), "svg-tools-test-"))
  const loaded = await loadExtensions([provider], cwd)
  assert.deepEqual(loaded.errors, [])
  assert.equal(loaded.extensions.length, 1)
  const extension = loaded.extensions[0]
  const staging = new Set()
  t.after(() => {
    rmSync(cwd, { recursive: true, force: true })
    for (const directory of staging) rmSync(directory, { recursive: true, force: true })
  })
  return {
    cwd,
    extension,
    async call(name, params = {}) {
      const tool = extension.tools.get(name)?.definition
      assert.ok(tool, `${name} must be registered`)
      const result = await tool.execute("smoke-test", params, new AbortController().signal, undefined, { cwd })
      if (name === "write_svg") staging.add(dirname(result.details.path))
      return result
    },
  }
}

function assertPng(result) {
  assert.equal(result.details.ok, true)
  const image = result.content.find(item => item.type === "image")
  assert.equal(image?.mimeType, "image/png")
  const buffer = Buffer.from(image.data, "base64")
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
  assert.equal(buffer.readUInt32BE(16), 320)
  assert.equal(buffer.readUInt32BE(20), 200)
  assert.ok(result.content.some(item => item.type === "text" && item.text.includes(result.details.path)))
  return buffer
}

test("child provider registers all tools; discovered project entry exposes none", async t => {
  const instance = await child(t)
  assert.deepEqual([...instance.extension.tools.keys()], ["write_svg", "edit_svg", "render_svg"])
  const main = await loadExtensions([join(root, "index.ts")], instance.cwd)
  assert.deepEqual(main.errors, [])
  assert.equal(main.extensions[0].tools.size, 0)
})

test("write, exact edit, real preview and publish in the child cwd", async t => {
  const instance = await child(t)
  const written = await instance.call("write_svg", { source: source() })
  assert.ok(written.content.some(item => item.type === "text" && item.text.includes(written.details.path)))
  const first = assertPng(await instance.call("render_svg"))
  await instance.call("edit_svg", { old_text: "#2563eb", new_text: "#e11d48" })
  const edited = assertPng(await instance.call("render_svg"))
  assert.notDeepEqual(first, edited)
  const published = await instance.call("render_svg", { save_as: "SVG Smoke Test" })
  assertPng(published)
  assert.equal(dirname(published.details.path), join(instance.cwd, "viz"))
  assert.match(published.details.filename, /^viz-svg-smoke-test-.*\.png$/)
  assert.deepEqual(readFileSync(published.details.path), edited)
  const rewritten = await instance.call("write_svg", { source: source("#16a34a") })
  assert.equal(rewritten.details.path, written.details.path)
})

test("two SDK sessions in one process cannot overwrite each other's source", async t => {
  const a = await child(t)
  const b = await child(t)
  const first = await a.call("write_svg", { source: source() })
  const second = await b.call("write_svg", { source: source("#e11d48") })
  assert.notEqual(first.details.path, second.details.path)
  await a.call("edit_svg", { old_text: "#2563eb", new_text: "#16a34a" })
  assert.equal(readFileSync(second.details.path, "utf8"), source("#e11d48"))
  assertPng(await a.call("render_svg"))
  assertPng(await b.call("render_svg"))
  for (const handler of a.extension.handlers.get("session_start") ?? []) await handler()
  await assert.rejects(a.call("render_svg"), /no source yet/)
  assertPng(await b.call("render_svg"))
})

test("missing source, ambiguous edits and malformed SVG fail explicitly", async t => {
  const instance = await child(t)
  await assert.rejects(instance.call("render_svg"), /no source yet/)
  await assert.rejects(instance.call("edit_svg", { old_text: "a", new_text: "b" }), /no source yet/)
  await assert.rejects(instance.call("write_svg", { source: " " }), /non-empty/)
  const written = await instance.call("write_svg", { source: source() })
  await assert.rejects(instance.call("edit_svg", { old_text: "NOT PRESENT", new_text: "a" }), /not found/)
  await assert.rejects(instance.call("edit_svg", { old_text: "160", new_text: "200" }), /appears 2 times/)
  assert.equal(readFileSync(written.details.path, "utf8"), source())
  await instance.call("write_svg", { source: "<svg broken" })
  const failure = await instance.call("render_svg")
  assert.equal(failure.isError, true)
  assert.equal(failure.details.ok, false)
  assert.equal(failure.details.path, "")
  assert.equal(failure.content.some(item => item.type === "image"), false)
})
