// Run: node scripts/sync-demo.cjs ../inko
// Copies visual primitives and translations from the native app; no runtime dependency.
const fs = require("node:fs");
const path = require("node:path");
const source = path.resolve(process.argv[2] || "../inko");
const ts = require(path.join(source, "node_modules/typescript"));
const out = path.resolve(__dirname, "../demo");
function compile(file) {
	return ts.transpileModule(fs.readFileSync(path.join(source, file), "utf8"), {
		compilerOptions: {
			target: ts.ScriptTarget.ES2020,
			module: ts.ModuleKind.ES2020,
		},
	}).outputText;
}
fs.writeFileSync(
	path.join(out, "heart-path.js"),
	"// Copied from Inko src/utils/heartPath.ts. Regenerate with scripts/sync-demo.cjs.\n" +
		compile("src/utils/heartPath.ts"),
);
let data =
	"// Generated from the native app. Regenerate with scripts/sync-demo.cjs.\n";
for (const lang of ["en", "sv", "es", "pt"])
	data += compile(`src/i18n/${lang}.ts`);
const constants = fs.readFileSync(
	path.join(source, "src/lib/constants.ts"),
	"utf8",
);
const emojis = constants.match(
	/export const PREMIUM_EMOJI_LIST = ([\s\S]*?) as const;/,
)[1];
data += `export const emojis = ${emojis};\nexport const translations = {en, sv, es, pt};\n`;
fs.writeFileSync(path.join(out, "app-data.js"), data);
fs.copyFileSync(
	path.join(
		source,
		"node_modules/@expo-google-fonts/patrick-hand/400Regular/PatrickHand_400Regular.ttf",
	),
	path.join(out, "assets/patrick-hand.ttf"),
);
fs.copyFileSync(
	path.join(
		source,
		"node_modules/@expo-google-fonts/patrick-hand/LICENSE_FONT",
	),
	path.join(out, "assets/FONT-LICENSE.txt"),
);
(async () => {
	const sharp = require(path.join(source, "node_modules/sharp"));
	for (const size of [180, 192, 512])
		await sharp(path.join(source, "assets/icon.png"))
			.resize(size, size)
			.png()
			.toFile(path.join(out, `assets/icon-${size}.png`));
})();
