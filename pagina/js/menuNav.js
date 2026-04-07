// ─── Activación del menú de navegación según página actual ─────────────
function activarLinkMenuActual() {
	// Obtener la ruta actual
	const rutaActual = window.location.pathname;

	// Mapeo de rutas a nombres de servicios
	const mapeoServicios = {
		'fontaneria': 'fontaneria',
		'electricidad': 'electricidad',
		'pintura': 'pintura',
		'reformas': 'reformas',
		'climatizacion': 'climatizacion',
		'jardin': 'jardin',
	};

	// Encontrar qué servicio está activo en la URL actual
	let servicioActivo = null;
	for (const [ruta, servicio] of Object.entries(mapeoServicios)) {
		if (rutaActual.includes(ruta)) {
			servicioActivo = ruta;
			break;
		}
	}

	// Actualizar todos los links de navegación principal
	document.querySelectorAll('.nav-link').forEach((link) => {
		link.classList.remove('is-active');
		
		// Determinar si este link debe estar activo
		const href = link.getAttribute('href');
		if (servicioActivo && href && href.includes(servicioActivo)) {
			link.classList.add('is-active');
		}
	});
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', activarLinkMenuActual);
} else {
	activarLinkMenuActual();
}
