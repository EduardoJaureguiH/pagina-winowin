const formServicio = document.getElementById("contactoForm");

if (formServicio) {
	const tipoEl = document.getElementById("tipo");
	const zonaEl = document.getElementById("zona");

	if (tipoEl) {
		tipoEl.addEventListener("blur", () => {
			if (!tipoEl.value) mostrarError(tipoEl, "Selecciona el tipo de trabajo.");
			else limpiarError(tipoEl);
		});
		tipoEl.addEventListener("change", () => limpiarError(tipoEl));
	}

	formServicio.addEventListener("submit", (e) => {
		let valido = true;
		const nombreEl = document.getElementById("nombre");
		const telefonoEl = document.getElementById("telefono");

		if (nombreEl && nombreEl.value.trim().length < 2) {
			mostrarError(nombreEl, "Introduce tu nombre completo.");
			valido = false;
		}

		if (telefonoEl && !/^[0-9]{9}$/.test(telefonoEl.value.trim())) {
			mostrarError(telefonoEl, "Telefono de 9 digitos sin espacios.");
			valido = false;
		}

		if (tipoEl && !tipoEl.value) {
			mostrarError(tipoEl, "Selecciona el tipo de trabajo.");
			valido = false;
		}

		if (zonaEl && !zonaEl.value) {
			mostrarError(zonaEl, "Selecciona tu zona.");
			valido = false;
		}

		if (!valido) {
			e.preventDefault();
			e.stopImmediatePropagation();
			const primerError = formServicio.querySelector(".campo-error");
			if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
		} else {
			const btn = formServicio.querySelector(".btn-submit");
			if (btn) {
				btn.textContent = "Enviando...";
				btn.disabled = true;
			}
		}
	}, true);
}
