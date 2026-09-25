import { translations, emojis } from "./app-data.js";
import { generateHeartPulsePath, generateBlipLinePath } from "./heart-path.js";

const KEY = "inko-creator-demo-v1";
const languages = {
	en: "English",
	sv: "Svenska",
	es: "Español",
	pt: "Português",
};
const copy = {
	en: {
		emojiLabel: "Check-in emojis",
		streakLabel: "Streak (days)",
		tools: "Creator tools",
		name: "Name",
		placeholder: "e.g. Mom",
		note: "Add fictional people for your recording. Choose up to three check-in emojis and a streak of 1–10 days.",
		check: "Check in",
		clear: "Clear check-in",
		reset: "Reset check-ins",
		resetHint:
			"Keep your people and streaks, and clear today’s check-ins for another take.",
		remove: "Remove",
		install: "Install for recording",
		installTitle: "Record Inko on your phone",
		installIntro:
			"Add this demo to your Home Screen, then open it from the Inko icon before recording.",
		ios: "iPhone: open this link in Safari, tap Share → Add to Home Screen. If shown, keep “Open as Web App” enabled, then tap Add.",
		android:
			"Android: open this link in Chrome, open the ⋮ menu, then choose Install app or Add to Home screen.",
		local:
			"Your setup is saved on this device. If your installed app opens empty, add your people there before filming.",
		start: "Start recording mode",
		edit: "Edit person",
		save: "Save",
		checkAll: "Check everyone in",
		close: "Close",
		invalid: "Enter a name.",
		storage:
			"Your browser could not save this setup. Keep this page open while recording.",
	},
	sv: {
		emojiLabel: "Incheckningsemojier",
		streakLabel: "Svit (dagar)",
		tools: "Skaparverktyg",
		name: "Namn",
		placeholder: "t.ex. Mamma",
		note: "Lägg till fiktiva personer för din inspelning. Välj upp till tre emojier och en svit på 1–10 dagar.",
		check: "Checka in",
		clear: "Ta bort incheckning",
		reset: "Återställ incheckningar",
		resetHint:
			"Behåll personerna och sviterna, men ta bort dagens incheckningar för en ny tagning.",
		remove: "Ta bort",
		install: "Installera för inspelning",
		installTitle: "Spela in Inko på mobilen",
		installIntro:
			"Lägg till demon på hemskärmen och öppna den via Inko-ikonen före inspelningen.",
		ios: "iPhone: öppna länken i Safari, tryck på Dela → Lägg till på hemskärmen. Låt ”Öppna som webbapp” vara aktiverat om det visas och tryck på Lägg till.",
		android:
			"Android: öppna länken i Chrome, öppna ⋮-menyn och välj Installera app eller Lägg till på startskärmen.",
		local:
			"Din uppsättning sparas på den här enheten. Om den installerade appen är tom, lägg till personerna där innan du filmar.",
		start: "Starta inspelningsläge",
		edit: "Redigera person",
		save: "Spara",
		checkAll: "Checka in alla",
		close: "Stäng",
		invalid: "Ange ett namn.",
		storage:
			"Webbläsaren kunde inte spara. Håll sidan öppen under inspelningen.",
	},
	es: {
		emojiLabel: "Emojis del registro",
		streakLabel: "Racha (días)",
		tools: "Herramientas de creación",
		name: "Nombre",
		placeholder: "p. ej. Mamá",
		note: "Añade personas ficticias para tu grabación. Elige hasta tres emojis y una racha de 1 a 10 días.",
		check: "Registrar",
		clear: "Borrar registro",
		reset: "Reiniciar registros",
		resetHint:
			"Conserva las personas y sus rachas y borra los registros de hoy para otra toma.",
		remove: "Eliminar",
		install: "Instalar para grabar",
		installTitle: "Graba Inko en tu móvil",
		installIntro:
			"Añade esta demo a la pantalla de inicio y ábrela desde el icono de Inko antes de grabar.",
		ios: "iPhone: abre el enlace en Safari, pulsa Compartir → Añadir a pantalla de inicio. Si aparece, activa “Abrir como app web” y pulsa Añadir.",
		android:
			"Android: abre el enlace en Chrome, abre el menú ⋮ y elige Instalar aplicación o Añadir a pantalla de inicio.",
		local:
			"Tu configuración se guarda en este dispositivo. Si la app instalada está vacía, añade las personas allí antes de grabar.",
		start: "Iniciar modo de grabación",
		edit: "Editar persona",
		save: "Guardar",
		checkAll: "Registrar a todos",
		close: "Cerrar",
		invalid: "Introduce un nombre.",
		storage:
			"El navegador no pudo guardar. Mantén esta página abierta mientras grabas.",
	},
	pt: {
		emojiLabel: "Emojis do check-in",
		streakLabel: "Sequência (dias)",
		tools: "Ferramentas de criação",
		name: "Nome",
		placeholder: "ex.: Mãe",
		note: "Adicione pessoas fictícias para sua gravação. Escolha até três emojis e uma sequência de 1 a 10 dias.",
		check: "Fazer check-in",
		clear: "Limpar check-in",
		reset: "Reiniciar check-ins",
		resetHint:
			"Mantenha as pessoas e sequências e limpe os check-ins de hoje para outra gravação.",
		remove: "Remover",
		install: "Instalar para gravar",
		installTitle: "Grave o Inko no celular",
		installIntro:
			"Adicione esta demonstração à tela inicial e abra pelo ícone do Inko antes de gravar.",
		ios: "iPhone: abra o link no Safari, toque em Compartilhar → Adicionar à Tela de Início. Se aparecer, ative “Abrir como App Web” e toque em Adicionar.",
		android:
			"Android: abra o link no Chrome, abra o menu ⋮ e escolha Instalar app ou Adicionar à tela inicial.",
		local:
			"Sua configuração fica salva neste dispositivo. Se o app instalado estiver vazio, adicione as pessoas nele antes de gravar.",
		start: "Iniciar modo de gravação",
		edit: "Editar pessoa",
		save: "Salvar",
		checkAll: "Fazer check-in de todos",
		close: "Fechar",
		invalid: "Digite um nome.",
		storage:
			"O navegador não conseguiu salvar. Mantenha esta página aberta durante a gravação.",
	},
};
const streak = () => 1 + Math.floor(Math.random() * 10);
const defaultState = () => ({
	language: languages[navigator.language?.slice(0, 2)]
		? navigator.language.slice(0, 2)
		: "en",
	people: [],
	own: [],
	ownStreak: streak(),
	introduced: false,
});
function load() {
	const fallback = defaultState();
	try {
		const value = JSON.parse(localStorage.getItem(KEY));
		if (!value || !languages[value.language] || !Array.isArray(value.people))
			return fallback;
		const validEmojis = (value) =>
			Array.isArray(value) &&
			value.length <= 3 &&
			value.every((e) => emojis.includes(e));
		return {
			...fallback,
			language: value.language,
			introduced: value.introduced === true,
			own: validEmojis(value.own) ? value.own : [],
			ownStreak:
				Number.isInteger(value.ownStreak) &&
				value.ownStreak >= 1 &&
				value.ownStreak <= 10
					? value.ownStreak
					: streak(),
			people: value.people
				.filter(
					(p) =>
						p &&
						typeof p.id === "string" &&
						typeof p.name === "string" &&
						p.name.trim() &&
						p.name.length <= 60 &&
						Number.isInteger(p.streak) &&
						p.streak >= 1 &&
						p.streak <= 10 &&
						validEmojis(p.emoji) &&
						(p.at === null || Number.isFinite(p.at)),
				)
				.map((p) => ({
					...p,
					checkEmoji:
						validEmojis(p.checkEmoji) && p.checkEmoji.length
							? p.checkEmoji
							: p.emoji.length
								? [...p.emoji]
								: ["😊"],
				})),
		};
	} catch {
		return fallback;
	}
}
let state = load();
let storageFailed = false;
const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
const sheet = document.querySelector("#sheet");
const escape = (value) =>
	String(value).replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
const t = (key, params = {}) =>
	(translations[state.language][key] || translations.en[key] || key).replace(
		/{{(\w+)}}/g,
		(_, k) => params[k] ?? "",
	);
const c = (key) => copy[state.language][key];
function save() {
	try {
		localStorage.setItem(KEY, JSON.stringify(state));
		storageFailed = false;
	} catch {
		storageFailed = true;
	}
}
const action = (id, text, cls = "outline") =>
	`<button type="button" class="${cls}" data-action="${id}">${escape(text)}</button>`;
const peopleIcon =
	'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 11c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z M4 21v-1c0-3.3 3.6-6 8-6s8 2.7 8 6v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function svg(path, width, height, color, stroke = 1, cls = "") {
	return `<svg class="${cls}" viewBox="0 0 ${width} ${height}" aria-hidden="true"><path d="${path}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function time(at) {
	const minutes = Math.max(0, Math.floor((Date.now() - at) / 60000));
	return minutes < 1
		? t("time.justNow")
		: minutes < 60
			? t("time.minutesAgo", { count: minutes })
			: t("time.hoursAgo", { count: Math.floor(minutes / 60) });
}
function header(title) {
	return `<div class="page-header"><h1>${escape(title)}</h1><button class="icon" data-action="home" aria-label="${escape(c("close"))}">✕</button></div>`;
}
function currentPage() {
	return location.hash === "#people"
		? "people"
		: location.hash === "#settings"
			? "settings"
			: "home";
}
function navigate(page) {
	if (modal.open) modal.close();
	const hash = page === "home" ? "" : "#" + page;
	if (location.hash === hash) render();
	else location.hash = hash;
}
function contactFields(prefix, days = 1) {
	return `<div class="contact-fields"><label class="label" for="${prefix}-streak">${c("streakLabel")}</label><input class="field" id="${prefix}-streak" type="number" inputmode="numeric" min="1" max="10" step="1" value="${days}" required><details class="contact-emojis"><summary>${c("emojiLabel")} <span class="emoji-preview"></span></summary><p class="subtitle">${t("emoji.subtitle")}</p><div class="emoji-grid">${emojis.map((e) => `<button type="button" class="emoji-option" data-emoji="${e}" aria-label="${e}" aria-pressed="false">${e}</button>`).join("")}</div></details></div>`;
}
function bindContactFields(form, initial) {
	let selected = [...initial];
	const paint = () => {
		form.querySelector(".emoji-preview").textContent = selected.join(" ");
		form.querySelectorAll("[data-emoji]").forEach((b) => {
			const index = selected.indexOf(b.dataset.emoji);
			b.setAttribute("aria-pressed", String(index !== -1));
			b.innerHTML =
				b.dataset.emoji +
				(index !== -1 ? `<span class="badge">${index + 1}</span>` : "");
		});
	};
	form.querySelectorAll("[data-emoji]").forEach((b) =>
		b.addEventListener("click", () => {
			const emoji = b.dataset.emoji;
			// Keep at least one emoji so every contact can be checked in again.
			selected = selected.includes(emoji)
				? selected.length > 1
					? selected.filter((e) => e !== emoji)
					: selected
				: selected.length < 3
					? [...selected, emoji]
					: selected;
			paint();
		}),
	);
	paint();
	return () => [...selected];
}
function render() {
	document.documentElement.lang = state.language;
	if (currentPage() === "settings") {
		app.innerHTML = `<section class="page">${header(t("settings.title"))}<span class="label">${t("settings.language")}</span><button class="language" data-action="language"><span>${languages[state.language]}</span><span class="muted">${t("settings.change")}</span></button></section>`;
		return;
	}
	if (currentPage() === "people") {
		app.innerHTML = `<section class="page">${header(t("contacts.title"))}<form id="add-person"><label class="label" for="person-name">${c("name")}</label><input id="person-name" class="field" name="name" maxlength="60" placeholder="${c("placeholder")}" required autocomplete="off">${contactFields("person")}<button class="primary" type="submit">${t("addPerson.add")}</button></form><p class="creator-note">${c("note")}</p>${storageFailed ? `<p class="error">${c("storage")}</p>` : ""}<div>${state.people.map((p) => `<div class="manage"><span>${escape(p.name)}</span><button data-person="${escape(p.id)}" aria-label="${escape(c("edit") + ": " + p.name)}">${c("edit")}</button></div>`).join("")}</div><details class="tools"><summary>${c("tools")}</summary>${action("check-all", c("checkAll"))}${action("reset", c("reset"))}<p class="creator-note">${c("resetHint")}</p><div class="install-only">${action("install", c("install"))}</div></details>${action("home", c("start"), "primary")}</section>`;
		const selection = bindContactFields(document.querySelector("#add-person"), [
			"😊",
		]);
		document
			.querySelector("#add-person")
			.addEventListener("submit", (event) => {
				event.preventDefault();
				const input = document.querySelector("#person-name");
				const name = input.value.trim();
				if (!name) {
					input.setCustomValidity(c("invalid"));
					input.reportValidity();
					return;
				}
				state.people.push({
					id: crypto.randomUUID(),
					name,
					emoji: selection(),
					checkEmoji: selection(),
					streak: Number(document.querySelector("#person-streak").value),
					at: Date.now(),
				});
				save();
				render();
				document.querySelector("#person-name").focus();
			});
		document
			.querySelector("#person-name")
			.addEventListener("input", (event) => event.target.setCustomValidity(""));
		return;
	}
	const width = app.clientWidth;
	const done = state.own.length > 0;
	const complete =
		done &&
		state.people.length > 0 &&
		state.people.every((p) => p.emoji.length);
	app.innerHTML = `<div class="home-scroll"><header class="header"><h1>${t("circle.title")}</h1><div class="header-icons"><button class="icon" data-action="people" aria-label="${t("contacts.title")}">${peopleIcon}</button><button class="icon" data-action="settings" aria-label="${t("settings.title")}">⚙</button></div></header>${complete ? `<div class="celebration">✓ ${t("circle.complete")}</div>` : ""}<div>${state.people.length ? state.people.map((p) => `<div><button class="person" data-person="${escape(p.id)}" aria-label="${escape(p.name)}"><span class="alias">${escape(p.name.length > 15 ? p.name.slice(0, 15) + ".." : p.name)}</span><span class="person-emoji">${p.emoji.join("")}</span><span class="person-meta">${p.streak >= 2 ? `<span>${p.streak} <span class="fire">🔥</span></span>` : ""}<span class="time">${p.emoji.length && p.at ? time(p.at) : ""}</span></span></button>${svg(generateBlipLinePath(width, 14).d, width, 14, "#22c55e", 1, "divider")}</div>`).join("") : `<div class="empty">${t("circle.empty")}<p>${t("circle.emptyHint")}</p>${action("people", t("circle.emptyAction"))}</div>`}</div></div><div class="bottom"><button class="heart" data-action="emoji" aria-label="${escape(done ? t("checkin.done") + " " + t("checkin.tapToChange") : t("checkin.tapTo") + " inko")}"><div class="heart-art ${done ? "" : "pulsing"}">${svg(generateHeartPulsePath(width, 140, true).d, width, 140, done ? "#22c55e" : "#d1d5db", 2)}<div class="heart-overlay">${done ? `<span class="own-emojis ${state.own.length > 1 ? "multi" : ""}">${state.own.join("")}</span><span class="hint">${t("checkin.tapToChange")}</span>` : `<span class="tap">${t("checkin.tapTo")}</span><span class="inko">inko</span>`}</div></div></button>${done ? `<p class="done">🔥 ${state.ownStreak >= 2 ? t("checkin.doneStreak", { count: state.ownStreak }) : t("checkin.done")}</p>` : ""}</div>`;
}
function showSheet(title, content) {
	sheet.innerHTML = `<div class="handle"></div><h2 id="sheet-title">${escape(title)}</h2>${content}`;
	modal.setAttribute("aria-labelledby", "sheet-title");
	if (!modal.open) modal.showModal();
}
const closeButton = () => action("close", c("close"), "sheet-close");
function picker() {
	let selected = [];
	showSheet(
		t("emoji.title"),
		`<p class="subtitle">${t("emoji.subtitle")}</p><div class="emoji-grid">${emojis.map((e) => `<button class="emoji-option" data-emoji="${e}" aria-label="${e}" aria-pressed="false">${e}</button>`).join("")}</div><button id="emoji-done" class="primary" disabled>${t("emoji.done")}</button>${closeButton()}`,
	);
	sheet.querySelectorAll("[data-emoji]").forEach((button) =>
		button.addEventListener("click", () => {
			const e = button.dataset.emoji;
			selected = selected.includes(e)
				? selected.filter((item) => item !== e)
				: selected.length < 3
					? [...selected, e]
					: selected;
			sheet.querySelectorAll("[data-emoji]").forEach((b) => {
				const index = selected.indexOf(b.dataset.emoji);
				b.setAttribute("aria-pressed", String(index !== -1));
				b.innerHTML =
					b.dataset.emoji +
					(index !== -1 ? `<span class="badge">${index + 1}</span>` : "");
			});
			sheet.querySelector("#emoji-done").disabled = selected.length === 0;
		}),
	);
	sheet.querySelector("#emoji-done").addEventListener("click", () => {
		state.own = selected;
		save();
		modal.close();
		render();
	});
}
function editPerson(id) {
	const p = state.people.find((p) => p.id === id);
	if (!p) return;
	showSheet(
		c("edit"),
		`<form id="edit-person"><label class="label" for="edit-name">${c("name")}</label><input class="field" id="edit-name" value="${escape(p.name)}" maxlength="60" required>${contactFields("edit", p.streak)}<button class="primary" type="submit">${c("save")}</button></form>${action("person-check", c("check"))}${p.emoji.length ? action("person-clear", c("clear")) : ""}${action("person-remove", c("remove"), "danger")}${closeButton()}`,
	);
	const selection = bindContactFields(
		sheet.querySelector("#edit-person"),
		p.checkEmoji,
	);
	sheet.querySelector("#edit-person").addEventListener("submit", (event) => {
		event.preventDefault();
		const input = sheet.querySelector("#edit-name");
		if (!input.value.trim()) {
			input.setCustomValidity(c("invalid"));
			input.reportValidity();
			return;
		}
		p.name = input.value.trim();
		p.streak = Number(sheet.querySelector("#edit-streak").value);
		p.checkEmoji = selection();
		if (p.emoji.length) p.emoji = selection();
		save();
		modal.close();
		render();
	});
	sheet
		.querySelector("#edit-name")
		.addEventListener("input", (event) => event.target.setCustomValidity(""));
	const modify = (kind) => {
		if (kind === "check") {
			if (!sheet.querySelector("#edit-person").reportValidity()) return;
			p.streak = Number(sheet.querySelector("#edit-streak").value);
			p.checkEmoji = selection();
			p.emoji = [...p.checkEmoji];
			p.at = Date.now();
		} else if (kind === "clear") {
			p.emoji = [];
			p.at = null;
		} else state.people = state.people.filter((item) => item.id !== id);
		save();
		modal.close();
		render();
	};
	for (const kind of ["check", "clear", "remove"])
		sheet
			.querySelector(`[data-action="person-${kind}"]`)
			?.addEventListener("click", () => modify(kind));
}
function install() {
	showSheet(
		c("installTitle"),
		`<div class="install-guide"><p>${c("installIntro")}</p><p>${c("ios")}</p><p>${c("android")}</p><p>${c("local")}</p></div>${action("close", c("close"), "primary")}`,
	);
}
document.addEventListener("click", (event) => {
	const person = event.target.closest("[data-person]");
	if (person) {
		editPerson(person.dataset.person);
		return;
	}
	const button = event.target.closest("[data-action]");
	if (!button) return;
	const key = button.dataset.action;
	if (["home", "people", "settings"].includes(key)) navigate(key);
	if (key === "close") modal.close();
	if (key === "emoji") picker();
	if (key === "install") install();
	if (key === "language") {
		showSheet(
			t("settings.selectLanguage"),
			Object.entries(languages)
				.map(
					([code, label]) =>
						`<button class="language-option ${code === state.language ? "selected" : ""}" data-language="${code}" lang="${code}">${label}</button>`,
				)
				.join("") + closeButton(),
		);
		sheet.querySelectorAll("[data-language]").forEach((b) =>
			b.addEventListener("click", () => {
				state.language = b.dataset.language;
				save();
				modal.close();
				render();
			}),
		);
	}
	if (key === "reset") {
		state.own = [];
		state.people.forEach((p) => {
			p.emoji = [];
			p.at = null;
		});
		save();
		render();
	}
	if (key === "check-all") {
		state.people.forEach((p) => {
			p.emoji = [...p.checkEmoji];
			p.at = Date.now();
		});
		save();
		render();
	}
});
modal.addEventListener("click", (event) => {
	if (event.target === modal) modal.close();
});
window.addEventListener("hashchange", () => {
	modal.close();
	render();
});
let lastWidth = 0;
new ResizeObserver(() => {
	if (app.clientWidth !== lastWidth) {
		lastWidth = app.clientWidth;
		if (currentPage() === "home") render();
	}
}).observe(app);
render();
if (!state.introduced) {
	state.introduced = true;
	save();
	install();
}
if ("serviceWorker" in navigator)
	navigator.serviceWorker
		.register("/demo/sw.js", { scope: "/demo/" })
		.catch((error) => console.warn("Offline demo unavailable:", error));
