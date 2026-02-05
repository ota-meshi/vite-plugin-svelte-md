import { spawnSync } from "node:child_process";
import { test, vi } from "vitest";
import { render } from "svelte/server";

test.for(["vite5", "vite6", "vite7", "vite8"])(
  "%s",
  async (dir, { expect }) => {
    spawnSync("npx", ["vite", "build"], {
      cwd: `tests/e2e/${dir}/`,
      stdio: "inherit",
      shell: true,
      env: { PATH: process.env.PATH },
    });

    const actual = await vi.importActual<any>(`./${dir}/dist/index.js`);

    const { head, body } = render(actual.default);
    expect({
      frontmatter: actual.frontmatter,
      // Remove hydration markers
      head: head.replaceAll(/<!--.*?-->/g, ""),
      body: body.replaceAll(/<!--.*?-->/g, ""),
    }).toMatchSnapshot();
  },
);
