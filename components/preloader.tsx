import { readFileSync } from "node:fs";
import { join } from "node:path";

// The branded preloader (once per browser session), from the same partials the
// homepage route injects. The boot snippet must run before first paint, so it
// goes first in <body>; the overlay follows.
const read = (f: string) => readFileSync(join(process.cwd(), "partials", f), "utf8");

export default function Preloader() {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: read("preloader-head.html") + read("preloader.html") }} />;
}
