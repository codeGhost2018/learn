/**
 * Child-only visual tools.
 *
 * Modern pi-subagents loads the SVG provider directly from svg-maker's
 * `subagentOnlyExtensions`; listing names in `tools` only allowlists them.
 * Keep this discovered project entry point inert so the main session does not
 * acquire authoring tools or depend on the retired interactive-subagents hook.
 * The legacy Mermaid PNG provider remains available for explicit loading;
 * mermaid-maker itself returns Mermaid source and needs no renderer.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"

export default function visualTools(_pi: ExtensionAPI): void {}
