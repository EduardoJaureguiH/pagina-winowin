(function () {
	var THEME_KEY = 'msp-site-theme';
	var body = document.body;
	var btn = document.getElementById('toggleTemaGlobal');

	if (!body || !btn) {
		return;
	}

	function aplicarTema(modo) {
		var oscuro = modo === 'dark';
		body.classList.toggle('theme-dark', oscuro);
		btn.textContent = oscuro ? 'Usar estilo claro' : 'Usar estilo oscuro';
		btn.setAttribute('aria-pressed', oscuro ? 'true' : 'false');
	}

	var modoInicial = 'light';
	try {
		var guardado = localStorage.getItem(THEME_KEY);
		if (guardado === 'dark' || guardado === 'light') {
			modoInicial = guardado;
		}
	} catch (error) {
		// localStorage puede estar bloqueado en algunos navegadores.
	}

	aplicarTema(modoInicial);

	btn.addEventListener('click', function () {
		var siguiente = body.classList.contains('theme-dark') ? 'light' : 'dark';
		aplicarTema(siguiente);
		try {
			localStorage.setItem(THEME_KEY, siguiente);
		} catch (error) {
			// Ignorar errores de almacenamiento para no bloquear la UX.
		}
	});
})();
