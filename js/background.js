//const url_global = "https://www.football-live.lol/footlive/";
const url_global = "http://127.0.0.1:3001/footlive/";

function setCountBadge(matchesCount = 0) {
    if (matchesCount) {
        chrome.action.setBadgeTextColor({ color: 'white' });
        chrome.action.setBadgeText({ text: matchesCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#EB5052' });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

function getCountMatches() {
    chrome.storage.local.get(['checksMarcados', 'fecha'], function (result) {
        const ch = result.checksMarcados || [];
        const f = result.fecha;

        setTimeout(function () {
            const actionData = { fecha: f, checks: ch };
            fetch(url_global, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(actionData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                let count = 0;
                Object.values(data.result).forEach(value => {
                    count += value.matches.length;
                });
                if (count > 0) {
                    setCountBadge(count);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar errores
                setTimeout(getCountMatches, 10000);
            });
        }, 100);
    });
}

function formatDate(fecha, formato) {
    const map = {
        dd: (fecha.getDate() < 10) ? '0' + fecha.getDate() : fecha.getDate(),
        mm: (fecha.getMonth() < 9) ? '0' + (fecha.getMonth() + 1) : fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    };

    return formato.replace(/dd|mm|yyyy/gi, matched => map[matched]);
}

function setDateStorage(hoy, opt = 0) {
    let day = hoy.getDay();

    if (opt === 1) {
        day -= 1;
        hoy.setDate(hoy.getDate() - 1);
    } else if (opt === 2) {
        day += 1;
        hoy.setDate(hoy.getDate() + 1);
    }
    if (day === 7) {
        day = 0;
    }
    if (day === -1) {
        day = 6;
    }
    
	const today = formatDate(hoy, 'yyyymmdd');

    // Guardar
    chrome.storage.local.set({ 'fecha': today });

	switch(opt){
		case -1:
		case 0:
		case 1:
		case 2:
			return day;
		break;
		case 3:
			return today;
		break;
		case 4:
			getCountMatches(); 
		break;
	}
}
/*
async function enviarNotificacion() {
	await chrome.notifications.create(`my-notification-${Date.now()}`, {
		type: 'basic',
		iconUrl: '../img/goal.png',
		title: '¡Gol!',
		message: 'Tu equipo favorito ha marcado un gol.',
		requireInteraction: true
	}, function(context) {
		console.log("Last error:", chrome.runtime.lastError);
	});
}*/

let windowNotification; // Variable para almacenar la ventana de notificación abierta

async function enviarNotificacion(options) {
	console.log('ventana');
    // Verifica si ya hay una ventana de notificación abierta
    if (windowNotification && await esVentanaAbierta(windowNotification.id)) {
        return; // Evita crear una nueva ventana si ya existe una abierta
    }
    
    // Valida las opciones
    if (!options || typeof options !== 'object') {
        throw new Error('Se esperaba un objeto de opciones');
    }
    
    // Define valores predeterminados
    const { title = 'Goooool !!!', body = '', width = 300, height = 150 } = options;

    const encodedBody = encodeURIComponent(body); // Codifica el cuerpo HTML
    const html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${title}</title>
                        <style>
                            body, html{
                                width: ${width}px; /* Establece el ancho de la ventana emergente */
                                height: ${height}px; /* Establece la altura de la ventana emergente */
                                overflow: hidden; /* Evita que el contenido se desborde si es necesario */
								resize: none;
                            }
                        </style>
                    </head>
                    <body>
                        ${decodeURIComponent(encodedBody)}
                    </body>
                    </html>`;

    // Obtiene la ventana actual si no se proporcionan coordenadas
    const w = options.left == null && options.top == null && await chrome.windows.getCurrent();
    
    // Crea la ventana emergente
    const w2 = await chrome.windows.create({
        url: `data:text/html,${encodeURIComponent(html)}`,
        type: 'popup',
        left: options.left ?? Math.floor(w.left + (w.width - width) / 2),
        top: options.top ?? Math.floor(w.top + (w.height - height) / 2),
        height,
        width,
    });
	
	windowNotification = w2; // Actualiza la variable de la ventana de notificación
    
    return new Promise((resolve, reject) => {
        // Maneja la eliminación de la ventana emergente
        const onRemoved = (id) => {
            if (id === w2.id) {
                chrome.windows.onRemoved.removeListener(onRemoved);
                windowNotification = null; // Restablece la variable de la ventana de notificación cuando se cierra
                resolve();
            }
        };
        
        chrome.windows.onRemoved.addListener(onRemoved, { windowTypes: ['popup'] });
        
        // Maneja errores al crear la ventana emergente
        chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : null;
    });
}

// Función para manejar el evento de redimensionamiento de la ventana
function handleResize() {
    // Obtiene las dimensiones originales de la ventana
    const originalWidth = windowNotification.width;
    const originalHeight = windowNotification.height;

    // Establece las dimensiones de la ventana nuevamente a su tamaño original
    chrome.windows.update(windowNotification.id, { width: originalWidth, height: originalHeight });
}

// Función para verificar si una ventana está abierta
async function esVentanaAbierta(windowId) {
    return new Promise((resolve) => {
        chrome.windows.get(windowId, (window) => {
            resolve(window !== undefined);
        });
    });
}

function getNotif(){
	console.log('entre inicio mensaje');
	setTimeout(function (){
		chrome.runtime.sendMessage({ event: 'equipoMarcandoGol' });
		getNotif();
	}, 10000)
}

function initialize() {
	console.log('iniciado');
    const hoy = new Date();
    setDateStorage(hoy, 4);	
}

//chrome.runtime.sendMessage({ event: 'equipoMarcandoGol' });
// Listeners
chrome.windows.onFocusChanged.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);
chrome.action.onClicked.addListener(initialize);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("entre mensaje");
	if (message.event === 'equipoMarcandoGol') {
		const options = {
			body: 'Foo <b>bar</b><ul><li>bla<li>bla</ul>',
		};
		
		enviarNotificacion(options);
	}
});

chrome.windows.onBoundsChanged.addListener((window) => {
    if (window.type === 'popup' && windowNotification && window.id === windowNotification.id) {
        handleResize(window.id);
    }
});