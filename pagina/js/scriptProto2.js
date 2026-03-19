const animeAPI = window.anime || null;
const animate = animeAPI && typeof animeAPI.animate === "function" ? animeAPI.animate : null;
const stagger = animeAPI && typeof animeAPI.stagger === "function" ? animeAPI.stagger : null;

if (!animeAPI) {
	console.warn("Anime.js no esta disponible. Se ejecuta la pagina sin animaciones avanzadas.");
}

// splitText propio: envuelve cada carácter en un <span style="display:inline-block">
// Cada palabra queda en un wrapper nowrap para que no se corte a mitad de palabra
function splitTextChars(selector) {
	const el = typeof selector === "string" ? document.querySelector(selector) : selector;
	if (!el) return [];
	const palabras = el.textContent.split(" ");
	el.innerHTML = palabras
		.map((palabra) =>
			`<span style="white-space:nowrap">${palabra
				.split("")
				.map((c) => `<span style="display:inline-block">${c}</span>`)
				.join("")}</span>`
		)
		.join(" ");
	return Array.from(el.querySelectorAll("span[style*='inline-block']"));
}

// ─── Animación letras al hover: logo y hero h1 ───────────────────────
if (animate && stagger) {
	const logoEl = document.querySelector(".logo");
	const heroTitleEl = document.querySelector(".hero h1");

	if (logoEl) {
		const charsLogo = splitTextChars(".logo");
		let animandoLogo = false;

		logoEl.addEventListener("mouseenter", () => {
			if (animandoLogo) return;
			animandoLogo = true;

			animate(charsLogo, {
				y: [
					{ to: "-2.75rem", ease: "outExpo", duration: 600 },
					{ to: 0, ease: "outBounce", duration: 800, delay: 100 },
				],
				rotate: {
					from: "-1turn",
					delay: 0,
				},
				delay: stagger(50),
				ease: "inOutCirc",
				onComplete: () => {
					animandoLogo = false;
				},
			});
		});
	}

	if (heroTitleEl) {
		const charsH1 = splitTextChars(".hero h1");
		let animandoH1 = false;

		heroTitleEl.addEventListener("mouseenter", () => {
			if (animandoH1) return;
			animandoH1 = true;

			animate(charsH1, {
				y: [
					{ to: "-2.75rem", ease: "outExpo", duration: 600 },
					{ to: 0, ease: "outBounce", duration: 800, delay: 100 },
				],
				rotate: {
					from: "-1turn",
					delay: 0,
				},
				delay: stagger(50),
				ease: "inOutCirc",
				onComplete: () => {
					animandoH1 = false;
				},
			});
		});
	}
}

// ─── Navegación suave ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
	enlace.addEventListener("click", (e) => {
		const destino = document.querySelector(enlace.getAttribute("href"));
		if (!destino) return;
		e.preventDefault();
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		destino.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
	});
});

// ─── Header sticky: ocultar/mostrar al hacer scroll ───────────────────
const header = document.querySelector(".main-header");
let ultimoScroll = 0;
let scrollTicking = false;

if (header) {
	const onScroll = () => {
		scrollTicking = false;
		const scrollActual = window.scrollY;
		if (scrollActual > ultimoScroll && scrollActual > 120) {
			header.classList.add("header-oculto");
		} else {
			header.classList.remove("header-oculto");
		}
		ultimoScroll = scrollActual;
	};

	window.addEventListener("scroll", () => {
		if (scrollTicking) return;
		scrollTicking = true;
		window.requestAnimationFrame(onScroll);
	}, { passive: true });
}

// ─── Animación de entrada para secciones ──────────────────────────────
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
				observer.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.12 }
);

document.querySelectorAll(".section, .hero").forEach((el) => observer.observe(el));

// ─── Validación del formulario de contacto ────────────────────────────
const contactoForm = document.getElementById("contactoForm");

if (contactoForm) {
	contactoForm.setAttribute("novalidate", "novalidate");
	const formStatus = crearEstadoFormulario(contactoForm);

	const campos = {
		nombre:   { el: document.getElementById("nombre"),   min: 2 },
		telefono: { el: document.getElementById("telefono"), patron: /^[0-9]{9}$/ },
		servicio: { el: document.getElementById("servicio") },
		zona:     { el: document.getElementById("zona") },
	};

	Object.values(campos).forEach(({ el }) => {
		if (!el) return;
		el.addEventListener("blur",  () => validarCampo(el));
		el.addEventListener("input", () => limpiarError(el));
	});

	contactoForm.addEventListener("submit", (e) => {
		let valido = true;

		if (campos.nombre.el && campos.nombre.el.value.trim().length < 2) {
			mostrarError(campos.nombre.el, "Introduce tu nombre completo.");
			valido = false;
		}
		if (campos.telefono.el && !campos.telefono.patron.test(campos.telefono.el.value.trim())) {
			mostrarError(campos.telefono.el, "Teléfono de 9 dígitos sin espacios.");
			valido = false;
		}
		if (campos.servicio.el && !campos.servicio.el.value) {
			mostrarError(campos.servicio.el, "Selecciona un servicio.");
			valido = false;
		}
		if (campos.zona.el && !campos.zona.el.value) {
			mostrarError(campos.zona.el, "Selecciona tu zona.");
			valido = false;
		}

		if (!valido) {
			e.preventDefault();
			actualizarEstadoFormulario(formStatus, "Revisa los campos marcados con error antes de enviar.", "assertive");
			const primerError = contactoForm.querySelector(".campo-error");
			if (primerError) {
				primerError.focus();
				primerError.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		} else {
			actualizarEstadoFormulario(formStatus, "Enviando solicitud. Espera un momento.", "polite");
			const btn = contactoForm.querySelector(".btn-submit");
			if (btn) { btn.textContent = "Enviando..."; btn.disabled = true; }
		}
	});
}

function mostrarError(campo, texto) {
	campo.classList.add("campo-error");
	campo.setAttribute("aria-invalid", "true");

	let msg = campo.parentElement.querySelector(".error-msg");
	if (!msg) {
		msg = document.createElement("span");
		msg.className = "error-msg";
		msg.id = generarIdError(campo);
		campo.parentElement.appendChild(msg);
	}
	msg.setAttribute("aria-live", "polite");
	msg.textContent = texto;
	actualizarDescripcionError(campo, msg.id, true);
}

function limpiarError(campo) {
	campo.classList.remove("campo-error");
	campo.removeAttribute("aria-invalid");
	const errorId = generarIdError(campo);
	actualizarDescripcionError(campo, errorId, false);
	const msg = campo.parentElement.querySelector(".error-msg");
	if (msg) msg.remove();
}

function validarCampo(campo) {
	if (!campo.value.trim()) {
		mostrarError(campo, "Este campo es obligatorio.");
	} else {
		limpiarError(campo);
	}
}

function generarIdError(campo) {
	const base = campo.id || campo.name || "campo";
	return base + "-error";
}

function actualizarDescripcionError(campo, errorId, agregar) {
	const prev = (campo.getAttribute("aria-describedby") || "")
		.split(" ")
		.filter(Boolean)
		.filter((id) => id !== errorId);
	if (agregar) prev.push(errorId);
	if (prev.length > 0) campo.setAttribute("aria-describedby", prev.join(" "));
	else campo.removeAttribute("aria-describedby");
}

function crearEstadoFormulario(form) {
	let estado = form.querySelector("[data-form-status]");
	if (estado) return estado;
	estado = document.createElement("p");
	estado.className = "sr-only";
	estado.setAttribute("data-form-status", "true");
	estado.setAttribute("role", "status");
	estado.setAttribute("aria-live", "polite");
	estado.setAttribute("aria-atomic", "true");
	form.prepend(estado);
	return estado;
}

function actualizarEstadoFormulario(estadoEl, texto, prioridad) {
	if (!estadoEl) return;
	estadoEl.setAttribute("aria-live", prioridad === "assertive" ? "assertive" : "polite");
	estadoEl.textContent = texto;
}

// ─── Calculadora de presupuesto con Anime.js v4 ───────────────────────
const sliderM2     = document.getElementById("calcM2");
const labelM2      = document.getElementById("calcM2Val");
const elMin        = document.getElementById("calcMin");
const elEst        = document.getElementById("calcEst");
const elMax        = document.getElementById("calcMax");
const elBarra      = document.getElementById("calcBarra");
const elBarraLabel = document.getElementById("calcBarraLabel");

if (elMin && elEst && elMax) {
	let basePrice  = null;
	let urgMult    = 1.0;
	let animActual = null;

	// Objeto proxy que Anime.js anima — usamos su valor para actualizar el DOM
	const contador = { valor: 0 };

	const COLOR_NORMAL  = "#1a6e3c";
	const COLOR_SEMANA  = "#b45309";
	const COLOR_URGENTE = "#b91c1c";

	// ── Selección de servicio / tipo de trabajo ──────────────────────
	document.querySelectorAll(".calc-btn-servicio").forEach((btn) => {
		btn.addEventListener("click", () => {
			document.querySelectorAll(".calc-btn-servicio").forEach((b) => b.classList.remove("activo"));
			btn.classList.add("activo");
			basePrice = parseFloat(btn.dataset.base);
			calcular();
		});
	});

	// ── Selección de urgencia ────────────────────────────────────────
	document.querySelectorAll(".calc-btn-urgencia").forEach((btn) => {
		btn.addEventListener("click", () => {
			document.querySelectorAll(".calc-btn-urgencia").forEach((b) => {
				b.classList.remove("activo", "urgencia-semana", "urgencia-urgente");
			});
			btn.classList.add("activo");
			urgMult = parseFloat(btn.dataset.mult);
			if (urgMult === 1.3) btn.classList.add("urgencia-semana");
			if (urgMult === 1.6) btn.classList.add("urgencia-urgente");
			calcular();
		});
	});

	// ── Slider m² (solo si existe en la página) ──────────────────────
	if (sliderM2) {
		sliderM2.addEventListener("input", () => {
			labelM2.textContent = sliderM2.value + " m²";
			calcular();
		});
	}

	// Máximo posible: mayor base disponible × slider al máximo (si existe) × urgencia máxima
	const maxBase = Math.max(...Array.from(document.querySelectorAll(".calc-btn-servicio")).map(b => parseFloat(b.dataset.base)));
	const maxPosible = sliderM2
		? maxBase * (parseInt(sliderM2.max) / 20) * 1.6
		: maxBase * 1.6;

	// ── Cálculo y animación con Anime.js v4 ─────────────────────────
	function calcular() {
		if (!basePrice) return;

		// Si hay slider de m² lo usa; si no, precio base directo × urgencia
		const target = sliderM2
			? Math.round(basePrice * (parseInt(sliderM2.value) / 20) * urgMult)
			: Math.round(basePrice * urgMult);
		const pct    = Math.min(100, Math.round((target / maxPosible) * 100));

		const colorBarra = urgMult === 1.6 ? COLOR_URGENTE : urgMult === 1.3 ? COLOR_SEMANA : COLOR_NORMAL;
		const labelBarra = urgMult === 1.6 ? "Precio urgente" : urgMult === 1.3 ? "Precio prioritario" : "Precio estándar";

		if (elBarra)      { elBarra.style.width = pct + "%"; elBarra.style.background = colorBarra; }
		if (elBarraLabel) { elBarraLabel.textContent = labelBarra; }

		// Cancela la animación anterior si sigue corriendo
		if (animActual && typeof animActual.pause === "function") animActual.pause();

		const pintarPrecios = (valor) => {
			const v = Math.round(valor);
			const vMin = Math.round(v * 0.75);
			const vMax = Math.round(v * 1.35);
			elEst.textContent = v.toLocaleString("es-ES") + " €";
			elMin.textContent = vMin.toLocaleString("es-ES") + " €";
			elMax.textContent = vMax.toLocaleString("es-ES") + " €";
		};

		if (animate) {
			animActual = animate(contador, {
				valor: target,
				duration: 550,
				ease: "outQuart",
				onUpdate: () => pintarPrecios(contador.valor),
			});
		} else {
			contador.valor = target;
			pintarPrecios(contador.valor);
		}
	}

	// Activa por defecto el primer tipo + urgencia Normal al cargar
	const primerServicio = document.querySelector(".calc-btn-servicio");
	const primerUrgencia = document.querySelector(".calc-btn-urgencia");
	if (primerServicio) primerServicio.click();
	if (primerUrgencia) primerUrgencia.click();
	
}