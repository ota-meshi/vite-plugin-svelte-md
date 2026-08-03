import { defineAddon } from "sv";
import {
  dedent,
  svelteConfig,
  transforms,
  color,
  createPrinter,
  resolveCommandArray,
  resolveLibPrefix,
} from "@sveltejs/sv-utils";
import pkg from "../../package.json" with { type: "json" };

export default defineAddon({
  id: "vite-plugin-svelte-md",
  options: {},

  run: ({ sv, cwd, file, isKit, language, directory, dependencyVersion }) => {
    const lib = resolveLibPrefix(dependencyVersion("@sveltejs/kit"));
    const [kit, ts] = createPrinter(isKit, language === "ts");
    sv.devDependency("vite-plugin-svelte-md", `^${pkg.version}`);

    sv.file(
      file.viteConfig,
      transforms.script(({ ast, js }) => {
        js.imports.addDefault(ast, {
          from: "vite-plugin-svelte-md",
          as: "mdPlugin",
        });
        js.vite.addPlugin(ast, {
          code: `mdPlugin(${kit(`{ wrapperComponent: "${lib}/markdown/Wrapper.svelte" }`)})`,
          mode: "prepend",
        });
      }),
    );

    svelteConfig.edit({ sv, cwd }, ({ js, property }) => {
      const fallback = js.array.create();
      js.array.append(fallback, ".svelte");
      const extensions = property("extensions", { fallback });
      js.array.append(extensions, ".md");
    });

    if (isKit) {
      sv.file(
        `${directory.lib}/markdown/Wrapper.svelte`,
        () => dedent`
          <script${ts(' lang="ts"')}>
            ${ts('import type { Snippet } from "svelte"')};

            const { frontmatter, children }${ts(`: {
              frontmatter: { title: string };
              children: Snippet;
            }`)} = $props();
          </script>

          <article>
            <h1>{frontmatter.title}</h1>
            {@render children()}
          </article>

          <style>
            article {
              max-width: 40rem;
              margin: 0 auto;
              padding: 1rem;
            }
          </style>
        `,
      );

      sv.file(
        `${directory.kitRoutes}/demo/markdown/+page.md`,
        () => dedent`
          ---
          title: Markdown Page
          ---

          Thank you for using \`vite-plugin-svelte-md\`!

          You can now import \`.md\` files and use them as Svelte components in your SvelteKit project, and you can also create \`+page.md\` files directly.

          [Read the documentation](https://github.com/ota-meshi/vite-plugin-svelte-md)
        `,
      );
    }
  },

  nextSteps: ({ isKit, packageManager }) =>
    [
      `Run ${color.command(resolveCommandArray(packageManager, "run", ["dev"]))} and consult ${color.website("http://localhost:5173/demo/markdown")} to see the result`,
      `Read the documentation at ${color.website("https://github.com/ota-meshi/vite-plugin-svelte-md")}`,
    ].slice(isKit ? 0 : 1),
});
