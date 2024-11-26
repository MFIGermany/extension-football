const btnright = document.querySelector(".arrow-right");
const btnleft = document.querySelector(".arrow-left");
const transfer = document.getElementById('transfer');
const matches = document.getElementById('matches');
const leagues = document.getElementById('leagues');
const about = document.getElementById('about');
const news = document.getElementById('news');
const lang = document.getElementById('current-lang');

//language
let langs = ['es', 'en', 'pt', 'de', 'it', 'fr'];

//Arreglos de dias
let days_es = ['Domingo ', 'Lunes ', 'Martes ', 'Miércoles ', 'Jueves ', 'Viernes ', 'Sábado '];
let days_en = ['Sunday ', 'Monday ', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday '];
let days_pt = ['Domingo ', 'Segunda-feira ', 'Terça-feira ', 'Quarta-feira ', 'Quinta-feira ', 'Sexta-feira ', 'Sábado '];
let days_de = ['Sonntag ', 'Montag ', 'Dienstag ', 'Mittwoch ', 'Donnerstag ', 'Freitag ', 'Samstag '];
let days_it = ['Domenica ', 'Lunedì ', 'Martedì ', 'Mercoledì ', 'Giovedì ', 'Venerdì ', 'Sabato '];
let days_fr = ['Dimanche ', 'Lundi ', 'Mardi ', 'Mercredi ', 'Jeudi ', 'Vendredi ', 'Samedi '];

let lg = navigator.language.substring(0, 2);

if(!langs.includes(lg))
	lg = 'en';

chrome.storage.local.get('idioma', function (result) {
	let aux = result.idioma;
	lg = (aux) ? aux : lg;
	
	//console.log('---->'+lg);
	lang.innerHTML = lg.toUpperCase();
	toggleSelectLang(lg);
});

let timeoutId;
//Arreglos de logos equipos
const arr_leagues = ['eng.png', 'esp.png', 'fra.png', 'ger.png', 'int.png', 'int.png'];
const arr_eng = [8191, 8346, 8455, 8456, 8586, 8602, 8650, 8654, 8657, 8668, 8678, 9825, 9826, 9879, 9937, 10203, 10204, 10252, 10260, 10261, 9902, 8197, 8466];
const arr_esp = [7732, 7878, 8302, 8305, 8306, 8315, 8370, 8371, 8385, 8560, 8603, 8633, 8634, 8661, 9865, 9866, 9906, 9910, 10205, 10267, 10281, 7854, 8558];
const arr_fra = [8311, 8521, 8550, 8588, 8592, 8639, 8689, 9746, 9748, 9829, 9830, 9831, 9837, 9847, 9848, 9851, 9941, 10249, 9853, 8121, 8583];
const arr_ger = [8149, 8178, 8226, 8262, 8358, 8406, 8697, 8721, 8722, 9788, 9789, 9810, 9823, 9905, 9911, 10269, 94937, 178475, 8152, 8150];
const arr_ita = [6480, 6504, 7943, 8524, 8529, 8534, 8535, 8543, 8564, 8600, 8636, 8686, 9804, 9857, 9875, 9876, 9885, 9888, 9891, 10233, 7881, 10171, 10167];

//mouseover
matches.addEventListener('mouseover', function() {
	this.classList.remove('disable');
});

leagues.addEventListener('mouseover', function() {
	this.classList.remove('disable');
});

news.addEventListener('mouseover', function() {
	this.classList.remove('disable');
});

transfer.addEventListener('mouseover', function() {
	this.classList.remove('disable');
});

about.addEventListener('mouseover', function() {
	this.classList.remove('disable');
});

//mouseout
matches.addEventListener('mouseout', function() {
	let img = document.getElementById('op_matches');
	
	if(img.src.includes('disable'))
		this.classList.add('disable');
});

leagues.addEventListener('mouseout', function() {
	let img = document.getElementById('img_cup');
	
	if(img.src.includes('disable'))
		this.classList.add('disable');
});

news.addEventListener('mouseout', function() {
	let img = document.getElementById('img_news');
	
	if(img.src.includes('disable'))
		this.classList.add('disable');
});

transfer.addEventListener('mouseout', function() {
	let img = document.getElementById('img_transfer');
	
	if(img.src.includes('disable'))
		this.classList.add('disable');
});

about.addEventListener('mouseout', function() {
	let img = document.getElementById('img_about');
	
	if(img.src.includes('disable'))
		this.classList.add('disable');
});

btnleft.addEventListener("click",() => {
	loadMatches(1);
})

btnright.addEventListener("click",() => {    
    loadMatches(2);
})

matches.addEventListener("click",() => {    
    toggleSelect(1);
})

leagues.addEventListener("click",() => {    
    toggleSelect(2);
})

news.addEventListener("click",() => {    
    toggleSelect(3);
})

transfer.addEventListener("click",() => {    
    toggleSelect(4);
})

about.addEventListener("click",() => {    
    toggleSelect(5);
})

document.addEventListener("DOMContentLoaded", function() {
    const langContainer = document.querySelector('.lang');
    const langToggle = document.getElementById('lang-toggle');
    const langOptions = document.querySelectorAll('.changelang p');

    langToggle.addEventListener('click', function(event) {
        event.preventDefault();
        langContainer.classList.toggle('show');
    });

    langOptions.forEach(option => {
        option.addEventListener('click', function() {
			const selectedLang = this.getAttribute('data-lang');
            lang.textContent = selectedLang;
            langContainer.classList.remove('show');
			lg = selectedLang.toLowerCase();			
			toggleSelectLang(lg);
			getNews();
        });
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!langContainer.contains(event.target)) {
            langContainer.classList.remove('show');
        }
    });
	
	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		console.log("El clic derecho está deshabilitado en esta página.");
	});
});

function setFeatures(data){	
	if(data.transfer){
		actionData = {};
		const url = url_global + "transfers";
		
		getCall('GET', url, actionData, 5);
	}
	else{
		const options = [matches, leagues, news, about];
		
		for (let key in options) {
			options[key].classList.remove('opt_5');
			options[key].classList.add('opt_4');
		}
		transfer.classList.add('invisible');
	}
}

function toggleSelectLang(l) {
	// Options
	let options_es = {
		'op_matches': 'Partidos',
		'op_leagues': 'Ligas',
		'op_news': 'Noticias',
		'op_transfer': 'Fichajes',
		'op_about': 'Acerca de'
	};
	
	let options_en = {
		'op_matches': 'Matches',
		'op_leagues': 'Leagues',
		'op_news': 'News',
		'op_transfer': 'Transfers',
		'op_about': 'About us'
	};
	
	let options_pt = {
		'op_matches': 'Partidas',
		'op_leagues': 'Ligas',
		'op_news': 'Notícias',
		'op_transfer': 'Contratações',
		'op_about': 'Sobre nós'
	};
	
	let options_de = {
		'op_matches': 'Streichhölzer',
		'op_leagues': 'Ligen',
		'op_news': 'Nachricht',
		'op_transfer': 'Unterschriften',
		'op_about': 'Über uns'
	};
	
	let options_it = {
		'op_matches': 'Partite',
		'op_leagues': 'Leghe',
		'op_news': 'Notizie',
		'op_transfer': 'Acquisti',
		'op_about': 'Chi siamo'
	};
	
	let options_fr = {
		'op_matches': 'Parties',
		'op_leagues': 'Ligues',
		'op_news': 'Nouvelles',
		'op_transfer': 'Signatures',
		'op_about': 'À propos de'
	};
	
	//Headers
	let headers_es = {
		'title_leagues': 'Principales Ligas y Competencias',
		'title_news': 'Últimas Noticias',
		'title_transfer': 'Últimos Fichajes',
		'title_about': 'Acerca de Football Live'
	}
	
	let headers_en = {
		'title_leagues': 'Main Leagues and Competitions',
		'title_news': 'Last News',
		'title_transfer': 'Últimos Fichajes',
		'title_about': 'About Football Live'
	}
	
	let headers_pt = {
		'title_leagues': 'Principais Ligas e Competições',
		'title_news': 'Últimas notícias',
		'title_transfer': 'Últimas contratações',
		'title_about': 'Sobre Football Live'
	}
	
	let headers_de = {
		'title_leagues': 'Die wichtigsten Ligen und Wettbewerbe',
		'title_news': 'Letzte Neuigkeiten',
		'title_transfer': 'Letzte Transfers',
		'title_about': 'Über Football Live'
	}
	
	let headers_it = {
		'title_leagues': 'Principali Leghe e competizioni',
		'title_news': 'Ultime Notizie',
		'title_transfer': 'Ultimi Acquisti',
		'title_about': 'A proposito di Football Live'
	}
	
	let headers_fr = {
		'title_leagues': 'Principales Ligues et Compétitions',
		'title_news': 'Dernières Nouvelles',
		'title_transfer': 'Dernières Signatures',
		'title_about': 'À propos de Football Live'
	}
	
	//About
	let about_es = {
		'welcome': '¡Bienvenido amigo!',
		'title_description': 'Football Live es una extensión de Chrome que te permite estar al tanto de los últimos resultados de tus ligas favoritas. Con una interfaz intuitiva y fácil de usar, puedes mantenerte al día y seguir cada momento del deporte que amamos.',
		'feature': 'Características',
		'result': 'Resultados en tiempo real:',
		'sp_result': 'Obtén actualizaciones instantáneas sobre los marcadores de los partidos mientras ocurren.',
		'customize': 'Personalización:',
		'sp_customize': 'Selecciona tus ligas favoritas y mantente informado sobre sus partidos en vivo.',
		'interface': 'Interfaz intuitiva:',
		'sp_interface': 'Navega fácilmente por la extensión y encuentra lo que necesitas en segundos.',
		'title_team': 'Equipo',
		'developer': 'Desarrollador:',
		'contact': 'Contacto:',
		'version': 'Versión actual:',
		'date': 'Fecha de lanzamiento:'
	}
	
	let about_en = {
		'welcome': 'Welcome friend!',
		'title_description': 'Football Live is a Chrome extension that allows you to stay up to date with the latest results from your favorite leagues. With an intuitive and easy to use interface, you can stay up to date and follow every moment of the sport we love.',
		'feature': 'Features',
		'result': 'Real time scores:',
		'sp_result': 'Get instant updates on match scores as they happen.',
		'customize': 'Customization:',
		'sp_customize': 'Select your favorite leagues and stay informed about their live matches.',
		'interface': 'Intuitive interface:',
		'sp_interface': 'Easily navigate through the extension and find what you need in seconds.',
		'title_team': 'Team',
		'developer': 'Developer:',
		'contact': 'Contact:',
		'version': 'Current version:',
		'date': 'Release date:'
	}
	
	let about_pt = {
		'welcome': '¡Bem-vindo amigo!',
		'title_description': 'Football Live é uma extensão do Chrome que permite que você fique atualizado com os últimos resultados de suas ligas favoritas. Com uma interface intuitiva e fácil de usar, você pode ficar atualizado e acompanhar todos os momentos do esporte que amamos.',
		'feature': 'Caracteristicas',
		'result': 'Resultados em tempo real:',
		'sp_result': 'Receba atualizações instantâneas sobre os resultados das partidas conforme elas acontecem.',
		'customize': 'Personalização:',
		'sp_customize': 'Selecione suas ligas favoritas e fique informado sobre suas partidas ao vivo.',
		'interface': 'Interface intuitiva:',
		'sp_interface': 'Navegue facilmente pela extensão e encontre o que precisa em segundos.',
		'title_team': 'Equipe',
		'developer': 'Desenvolvedor:',
		'contact': 'Contato:',
		'version': 'Versão atual:',
		'date': 'Data de lançamento:'
	}
	
	let about_de = {
		'welcome': '¡Willkommen Freund!',
		'title_description': 'Football Live ist eine Chrome-Erweiterung, mit der Sie über die neuesten Ergebnisse Ihrer Lieblingsligen auf dem Laufenden bleiben. Mit einer intuitiven und benutzerfreundlichen Oberfläche bleiben Sie auf dem Laufenden und können jeden Moment des Sports, den wir lieben, verfolgen.',
		'feature': 'Eigenschaften',
		'result': 'Ergebnisse in Echtzeit:',
		'sp_result': 'Erhalten Sie sofortige Updates zu Spielergebnissen, sobald diese eintreten.',
		'customize': 'Personalisierung:',
		'sp_customize': 'Wählen Sie Ihre Lieblingsligen aus und bleiben Sie über deren Live-Spiele auf dem Laufenden.',
		'interface': 'Intuitive Benutzeroberfläche:',
		'sp_interface': 'Navigieren Sie einfach durch die Erweiterung und finden Sie in Sekundenschnelle, was Sie brauchen.',
		'title_team': 'Ausrüstung',
		'developer': 'Entwickler:',
		'contact': 'Kontakt:',
		'version': 'Aktuelle Version:',
		'date': 'Erscheinungsdatum:'
	}
	
	let about_it = {
		'welcome': '¡Benvenuto amico!',
		'title_description': "Football Live è un'estensione di Chrome che ti consente di rimanere aggiornato con gli ultimi risultati dei tuoi campionati preferiti. Con un'interfaccia intuitiva e facile da usare, potrai rimanere aggiornato e seguire ogni momento dello sport che amiamo.",
		'feature': 'Caratteristiche',
		'result': 'Risultati in tempo reale:',
		'sp_result': 'Ricevi aggiornamenti istantanei sui punteggi delle partite non appena si verificano.',
		'customize': 'Personalizzazione:',
		'sp_customize': 'Seleziona i tuoi campionati preferiti e rimani informato sulle loro partite in diretta.',
		'interface': 'Interfaccia intuitiva:',
		'sp_interface': "Naviga facilmente nell'estensione e trova ciò di cui hai bisogno in pochi secondi.",
		'title_team': 'Squadra',
		'developer': 'Sviluppatore:',
		'contact': 'Contatto:',
		'version': 'Versione attuale:',
		'date': 'Data di pubblicazione:'
	}
	
	let about_fr = {
		'welcome': '¡Bienvenue ami!',
		'title_description': 'Football Live est une extension Chrome qui vous permet de rester au courant des derniers résultats de vos ligues préférées. Avec une interface intuitive et facile à utiliser, vous pouvez rester informé et suivre chaque instant du sport que nous aimons.',
		'feature': 'Caractéristiques',
		'result': 'Résultats en temps réel:',
		'sp_result': "Obtenez des mises à jour instantanées sur les scores des matchs au fur et à mesure qu'ils se produisent.",
		'customize': 'Personnalisation:',
		'sp_customize': 'Sélectionnez vos ligues préférées et restez informé de leurs matchs en direct.',
		'interface': 'Interface intuitive:',
		'sp_interface': "Parcourez facilement l'extension et trouvez ce dont vous avez besoin en quelques secondes.",
		'title_team': 'Équipe',
		'developer': 'Développeur:',
		'contact': 'Contact:',
		'version': 'Version actuelle:',
		'date': 'Date de publication:'
	}
	
	let opts = {
        'es': options_es,
        'en': options_en,
        'pt': options_pt,
        'de': options_de,
        'it': options_it,
        'fr': options_fr
    };
	
	let heads = {
        'es': headers_es,
        'en': headers_en,
        'pt': headers_pt,
        'de': headers_de,
        'it': headers_it,
        'fr': headers_fr
    };
	
	let abouts = {
        'es': about_es,
        'en': about_en,
        'pt': about_pt,
        'de': about_de,
        'it': about_it,
        'fr': about_fr
    };
		
	let options = opts[l];
	let headers = heads[l];
	let about_us = abouts[l];
	
	for (let key in options) {
        let o = document.getElementById(key);
       
		o.textContent = options[key];
    }
	
	for (let key in headers) {
        let h = document.getElementById(key);
       
		h.textContent = headers[key];
    }
	
	for (let key in about_us) {
        let a = document.getElementById(key);
       
		a.textContent = about_us[key];
    }
	
	//Guardar idioma
	chrome.storage.local.set({ 'idioma': l });
	lang.style.left = ((l == 'it') ? 24 : 22) + 'px';
	
	loadMatches(-1);
}	

function hasClass(el, className) {
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
}

function toggleSelect(opt) {
    let images = {
        'transfer': 'img/transfer',
        'stadium': 'img/stadium',
        'leagues': 'img/cup',
        'about': 'img/about',
        'news': 'img/news'
    };

    let windows = {
        'transfer': 'wtransfer',
        'matches': 'wmatches',
        'leagues': 'wleagues',
        'about': 'wabout',
        'news': 'wnews'
    };

    let hiddenWindows = {
        'transfer': 'htransfer',
        'matches': 'hmatches',
        'leagues': 'hleagues',
        'about': 'habout',
        'news': 'hnews'
    };

    let selectedOption = {
        1: ['stadium', 'matches'],
        2: ['leagues'],
        3: ['news'],
        4: ['transfer'],
        5: ['about']
    };
	
	let images_ids = {
        'transfer': document.getElementById('img_transfer'),
        'stadium': document.getElementById('stadium'),
        'leagues': document.getElementById('img_cup'),
        'about': document.getElementById('img_about'),
        'news': document.getElementById('img_news')
    };

    let options = selectedOption[opt];

    for (let key in images) {
		let img = images_ids[key];
        let src = images[key] + (options.includes(key) ? '.png' : '_disable.png');
        img.src = src;
    }

    for (let key in windows) {
        let e = document.getElementById(key);
        let w = document.getElementById(windows[key]);
        let hw = document.getElementById(hiddenWindows[key]);
        let action = options.includes(key) ? 'remove' : 'add';
		
		e.classList[action]('disable');
		w.classList[action]('invisible');
		hw.classList[action]('invisible');
    }
}

// Obtener todos los botones del acordeón
var accordionBtns = document.querySelectorAll('.accordion-btn');

// Agregar evento de clic a cada botón
accordionBtns.forEach(function(btn) {
	btn.addEventListener('click', function() {
		// Obtener el contenido asociado con el botón actual
		var content = this.nextElementSibling;
		content.classList.toggle('active');
	});
});

function sendForm(id, url) {
    const url_view = url_global + "view";
    let myform = document.getElementById(id);

    if (!myform || myform.length == 0) {
        myform = document.createElement("form");
        myform.setAttribute("action", url_view);
        myform.setAttribute("method", "post");
        myform.setAttribute("id", id);

        var field = document.createElement("input");
        field.setAttribute("type", "hidden");
        field.setAttribute("name", "url");
        field.setAttribute("value", url);
        myform.appendChild(field);

        document.body.appendChild(myform);
		
		myform = document.getElementById(id);
    }

    var newWin = window.open("", "_blank");
	newWin.document.body.appendChild(myform);
	myform.submit();
}

function getCall(method, url, actionData, opt) {
    let xhr = new XMLHttpRequest();
    if (method === 'GET') {
        // Convierte actionData a una query string si es GET
        url += '?' + new URLSearchParams(actionData).toString();
        xhr.open(method, url, true);
    } else if (method === 'POST') {
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else {
        console.error('Método HTTP no permitido para evitar preflight.');
        return;
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                switch (opt) {
                    case 1:
                        setNews(response.result);
                        break;
                    case 2:
                        setMatches(response.result);
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
                        
						timeoutId = setTimeout(() => {
                            getMatches();
                        }, 10000);
                        break;
                    case 3:
                        setLeagues(response.result);
                        getNews();
                        break;
					case 4:
                        setFeatures(response.result);
                        break;
					case 5:
                        setTransfers(response.result);
                        break;
                }
            } else {
                setTimeout(() => {
                    getCall(method, url, actionData, opt);
                }, 100);
            }
        }
    };

    if (method === 'POST') {
        xhr.send(new URLSearchParams(actionData).toString());
    } else {
        xhr.send();
    }
}

function getNews(){
	actionData = {};	
	const url = url_global + "news/" + lg;
	
	getCall('GET', url, actionData, 1);
}
		
function getMatches(){
	let ch = [];
	chrome.storage.local.get(['checksMarcados'], function(result) {
		ch = result.checksMarcados || [];
	});
	
	chrome.storage.local.get('fecha', function (result) {
        let f = result.fecha;
		let e = document.querySelector("#fecha");
		
		if(e.innerHTML){
			let x = getDate(e.innerHTML);
			x = setDateStorage(x, 3);
			if(f != x)
				f = x;
		}
		
		setTimeout(() => {
			console.log(ch);
			actionData = {fecha: f, checks: ch};
			const url = url_global;
			
			getCall('POST', url, actionData, 2);
		}, 100);
	});
}

function getLeagues(){
	actionData = {};
	const url = url_global + "leagues/"+lg;
	const container = document.querySelector(".leaguesContainer");
	
	if(container.childElementCount === 0)
		getCall('GET', url, actionData, 3);
	else{
		getMatches();
		getNews();
	}
}

function removeDuplicates(array) {
    return [...new Set(array)];
}

function handleCheckbox(e) {
	const checkbox = e.target;
	const checkboxValue = checkbox.value;
	
	chrome.storage.local.get(['checksMarcados'], function(result) {
		let checksMarcados = result.checksMarcados || [];
		
		if (checkbox.checked) {
			// Agregar el value al arreglo si el checkbox está marcado
			checksMarcados.push(checkboxValue);
		} else {
			// Eliminar el value del arreglo si el checkbox está desmarcado
			checksMarcados = checksMarcados.filter(value => value !== checkboxValue);
		}
		
		// Eliminar duplicados antes de guardar
        checksMarcados = removeDuplicates(checksMarcados);

		// Guardar el arreglo actualizado en chrome.storage.local
		chrome.storage.local.set({ checksMarcados: checksMarcados });
		//Mostrar mask
		showMask();
		getMatches();
	});
}

function setLeagues(data){
    const ext = ".png";
    const url = "https://images.fotmob.com/image_resources/logo/leaguelogo/";
    const container = document.querySelector(".leaguesContainer");
    container.innerHTML = "";

    Object.entries(data).forEach(([idx, league]) => {
        const { id, name } = league;

        // LEAGUE
        const lk = document.createElement("a");
        lk.className = "css-groupHeaderContainer";
        
        // CHECK
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'check';
        check.value = name;
        check.checked = true;
        lk.appendChild(check);
        
        // DIV ICON
        const div = document.createElement("div");
        div.className = "LeagueIcon";
        
        // ICON
        const img = document.createElement("img");
        img.src = `${url}${id}${ext}`;
        img.width = 17;
        img.height = 17;
        div.appendChild(img);
        lk.appendChild(div);
        
        // LEAGUE NAME
        const span = document.createElement("span");
        span.className = "css-leagueTitle";
        span.innerHTML = name;
        lk.appendChild(span);
        
        container.appendChild(lk);
    });
    
    // Seleccionar todos los checkboxes dentro del div
    const checkboxes = document.querySelectorAll('.leaguesContainer .check');
    
    chrome.storage.local.get(['checksMarcados'], function(result) {
        let checksMarcados = result.checksMarcados || [];
        
        checkboxes.forEach(checkbox => {
            const checkboxValue = checkbox.value;
            checkbox.addEventListener('click', handleCheckbox);
            if (result.checksMarcados) {
                if (result.checksMarcados.includes(checkboxValue))
                    checksMarcados.push(checkbox.value);
                else
                    checkbox.checked = false;
            } else {
                checksMarcados.push(checkbox.value);
            }			
        });
		
		// Eliminar duplicados antes de guardar
        checksMarcados = removeDuplicates(checksMarcados);
        
        chrome.storage.local.set({ checksMarcados: checksMarcados });
		//Cargar los partidos
		getMatches();
    });
}

function setTransfers(data){
    let ext = ".png";
    let ext_small = "_xsmall.png";
    const url_team = "https://images.fotmob.com/image_resources/logo/teamlogo/";
    const url_player = "https://images.fotmob.com/image_resources/playerimages/";
    const container = document.querySelector(".transferContainer");
    container.innerHTML = "";

    Object.entries(data).forEach(([idx, moves]) => {
		Object.entries(moves).forEach(function([id, move]) {
			
			if (arr_eng.includes(move.fromClubId) || arr_eng.includes(move.toClubId) ||
			    arr_esp.includes(move.fromClubId) || arr_esp.includes(move.toClubId) ||
			    arr_fra.includes(move.fromClubId) || arr_fra.includes(move.toClubId) ||
			    arr_ger.includes(move.fromClubId) || arr_ger.includes(move.toClubId) ||
			    arr_ita.includes(move.fromClubId) || arr_ita.includes(move.toClubId)){
					
				const { playerId, name, fromClubId, fromClub, toClubId, toClub, fee } = move;
				
				//
				const div_cont = document.createElement("div");
				div_cont.className = "transferContainer";
				
				const div_item = document.createElement("div");
				div_item.className = "transferItemContainer";
				
				const div_pcont = document.createElement("div");
				div_pcont.className = "playerContainer";
				
				const div_player = document.createElement("div");
				div_player.className = "playerIconWrapper";
				
				const div_icon = document.createElement("div");
				div_icon.className = "playerIconCSS";
				
				// IMG PLAYER
				const img = document.createElement("img");
				img.src = `${url_player}${playerId}${ext}`;
				img.width = 48;
				img.height = 48;				
				img.onerror = function(){
					this.src = chrome.runtime.getURL('img/player.png');
				};
				
				div_icon.appendChild(img);
				div_player.appendChild(div_icon);
				div_pcont.appendChild(div_player);
				
				const div_name = document.createElement("div");
				div_name.className = "nameAndTeam";
				
				const lk = document.createElement("a");
				lk.innerHTML = name;
				
				const div_toClub = document.createElement("div");
				div_toClub.className = "toClubContainer";
				
				const img_arrow = document.createElement("img");
				img_arrow.src = "img/arrow.png";
				img_arrow.width = 20;
				img_arrow.height = 20;
				
				const img_toClub = document.createElement("img");
				img_toClub.src = `${url_team}${toClubId}${ext_small}`;
				img_toClub.width = 25;
				img_toClub.height = 25;
				img_toClub.onerror = function(){
					this.src = chrome.runtime.getURL('img/logo.png');
				};
				
				const span_toClub = document.createElement("span");
				span_toClub.innerHTML = toClub;
				
				div_toClub.appendChild(img_arrow);
				div_toClub.appendChild(img_toClub);
				div_toClub.appendChild(span_toClub);
				
				div_name.appendChild(lk);
				div_name.appendChild(div_toClub);
				
				div_pcont.appendChild(div_name);
				
				const div_fee = document.createElement("div");
				div_fee.className = "feeTextContainer";
				
				const span_fee = document.createElement("span");

				span_fee.innerHTML = (fee) ? formatNumber(fee.value) : '-';
				
				div_fee.appendChild(span_fee);
				
				const div_fromClub = document.createElement("div");
				div_fromClub.className = "clubContainer";
				
				const img_fromClub = document.createElement("img");
				img_fromClub.src = `${url_team}${fromClubId}${ext_small}`;
				img_fromClub.width = 25;
				img_fromClub.height = 25;
				img_fromClub.onerror = function(){
					this.src = chrome.runtime.getURL('img/logo.png');
				};
				
				const span_fromClub = document.createElement("span");
				span_fromClub.innerHTML = fromClub;
				
				div_fromClub.appendChild(img_fromClub);
				div_fromClub.appendChild(span_fromClub);
				
				div_item.appendChild(div_pcont);
				div_item.appendChild(div_fee);
				div_item.appendChild(div_fromClub);
				
				container.appendChild(div_item);
		    }	
		});
    });
}

function formatNumber(num) {
    if (isNaN(num)) {
        return "-";
    }

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + " M";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + " Mil";
    } else {
        return num.toString();
    }
}

function getTime(fecha) {
    const ahora = new Date();
    const diferencia = ahora - fecha;

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
		
		mes = (mes.length == 1) ? '0' + mes : mes;
		
        return `${dia}/${mes}/${año}`;
    } else if (horas > 0) {
        return `hace ${horas} h`;
    } else {
        return `hace ${minutos} m`;
    }
}

function setNews(data){
    const base_url = "https://www.fotmob.com/" + lg;
    const container = document.querySelector(".newsContainer");
    container.innerHTML = "";
    
	Object.entries(data).forEach(([idx, news]) => {
        const { page, title, imageUrl, sourceStr, gmtTime } = news;
        const fecha = new Date(gmtTime);
        
		// Verificar si la url es externa
        let url = page.url;
        if (!url.includes('http:') && !url.includes('https:')) {
            url = base_url + url;
        }
		
        // Crear elementos
        const article = document.createElement("article");
        article.className = "article";
        article.title = title;
        
        const lk = document.createElement("a");
        lk.className = "newsItemLink";
        //lk.target = '_blank';
        lk.href = '#';
        //lk.href = url;
		
		lk.addEventListener("click", function(event) {
			event.preventDefault();
			sendForm('form'+idx, url);
		});
        
        const img = document.createElement("img");
        img.src = imageUrl;
        img.width = 175;
		img.height= 135;
        
        const h = document.createElement("h3");
        h.className = "title-article";
        h.innerHTML = title;
        
        const span = document.createElement("span");
        span.className = "trending-source";
        
        const span1 = document.createElement("span");
        span1.className = "source";
        span1.innerHTML = sourceStr;
        
        const span2 = document.createElement("span");
        span2.className = "time";
        span2.innerHTML = ` (${getTime(fecha)})`;
        
        // Agrupar elementos
        span.appendChild(span1);
        span.appendChild(span2);
        lk.appendChild(img);
        lk.appendChild(h);
        lk.appendChild(span);
        
        article.appendChild(lk);
        container.appendChild(article);
    });
}

function setMatches(data){
	let count = 0;
	let ext = "_xsmall.png";
	let url = "https://images.fotmob.com/image_resources/logo/teamlogo/";
	let container = document.querySelector(".scrollableContainer");
	container.innerHTML = "";
	Object.entries(data).forEach(function([id, value]) {
		// GROUP
		let div_group = document.createElement("div");
		div_group.className = "css-group";
		// HEADER IMG
		let div_header = document.createElement("div");
		div_header.className = "css-groupHeaderContainer";
		let img = document.createElement("img");			
		let paths = value.flag.split('.png');
		if(arr_leagues.includes(value.flag)){
			let logo = chrome.runtime.getURL('img/' + paths[0] + '/' + value.flag);
			img.src = logo;
		}
		else
			img.src = url + value.flag;
		img.className = "Image CountryIcon";
		img.width = 15;
		img.height = 15;
		div_header.appendChild(img);
		// HEADER TITLE
		let div = document.createElement("div");
		div.className = "css-groupTitle";
		div.innerHTML = id;
		div_header.appendChild(div);
		div_group.appendChild(div_header);

		Object.entries(value.matches).forEach(function([idx, match]) {
			// MATCH
			let lk = document.createElement("a");
			lk.className = "css-positioning";
			// MATCH TEAM 1
			let span_team = document.createElement("span");
			span_team.className = "css-teamName";
			span_team.innerHTML = match.home;
			// MATCH IMG 1
			img = document.createElement("img");
			let imgExist = imageTeam(paths[0], match.homeid);
			//console.log(paths[0]+'--->'+match.homeid+'--->'+imgExist);
			if(imgExist !== false){
				if(imgExist === true)
					ico = chrome.runtime.getURL('img/' + paths[0] + '/' + match.homeid + ext);
				else
					ico = chrome.runtime.getURL('img/' + imgExist + '/' + match.homeid + ext);
				img.src = ico;
			}
			else
				img.src = url + match.homeid + ext;
			img.onerror = function(){
				this.src = chrome.runtime.getURL('img/logo.png');
			};
			img.className = "Image TeamIcon";
			img.width = 25;
			img.height = 25;
			lk.appendChild(span_team);
			lk.appendChild(img);
			// MATCH STATUS
			let div = document.createElement("div");
			div.className = "css-statusMatch";
			let span = document.createElement("span");
			span.className = "css-live";
			if (match.finished)
				span.innerHTML = (Array('PP', 'Ab').includes(match.reason)) ? 'Ap' : match.score;
			else if (match.started)
				span.innerHTML = match.scorehome + ' (' + match.time + ') ' + match.scoreaway;
			else {
				//let hora = new Date(match.start).toLocaleString();
				let hora = getformatDate(match.start);
				let time = hora.split(' ');
				let temp = time[1].split(':');
				span.innerHTML = temp[0] + ':' + temp[1];
			}
			div.appendChild(span);
			// MATCH TEAM 2
			span_team = document.createElement("span");
			span_team.className = "css-teamName";
			span_team.innerHTML = match.away;
			// MATCH IMG 2
			img = document.createElement("img");
			imgExist = imageTeam(paths[0], match.awayid);
			if(imgExist !== false){
				if(imgExist === true)
					ico = chrome.runtime.getURL('img/' + paths[0] + '/' + match.awayid + ext);
				else
					ico = chrome.runtime.getURL('img/' + imgExist + '/' + match.awayid + ext);
				img.src = ico;
			}
			else
				img.src = url + match.awayid + ext;
			img.onerror = function(){
				this.src = chrome.runtime.getURL('img/logo.png');
			};
			img.className = "Image TeamIcon";
			img.width = 25;
			img.height = 25;
			lk.appendChild(div);
			lk.appendChild(span_team);
			lk.appendChild(img);

			div_group.appendChild(lk);
			container.appendChild(div_group);
			count++;
		});		
	});
	setCountBadge(count);
	setTimeout(() => {
		document.getElementById("mask").style.display = "none";
	}, 100);
}

function getformatDate(dateString) {
	console.log(dateString);
	const date = new Date(dateString);
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,  // Para forzar el formato de 24 horas
	};
	// Configura el formato específico (en este caso, 'es-ES' para español)
	return new Intl.DateTimeFormat('es-ES', options).format(date);
}

function imageTeam(league, team_id){
	let exist = false;
	switch (league){
		case 'eng':
			if(arr_eng.includes(team_id))
				exist = true;
		break;
		case 'esp':
			if(arr_esp.includes(team_id))
				exist = true;
		break;
		case 'fra':
			if(arr_fra.includes(team_id))
				exist = true;
		break;
		case 'ger':
			if(arr_ger.includes(team_id))
				exist = true;
		break;
		case 'ita':
			if(arr_ita.includes(team_id))
				exist = true;
		break;
		case 'int':
			if(arr_eng.includes(team_id))
				return 'eng';
			if(arr_esp.includes(team_id))
				return 'esp';
			if(arr_fra.includes(team_id))
				return 'fra';
			if(arr_ger.includes(team_id))
				return 'ger';
			if(arr_ita.includes(team_id))
				return 'ita';
		break;
	}
	
	return exist;
}

function showMask(){
	let maskElement = document.getElementById("mask");
	let body = document.body,
    html = document.documentElement;

	let height = Math.max(body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight);
	maskElement.style.display = "block";
	maskElement.style.height = height + "px";
}

function getDate(fecha = ''){
	let hoy = new Date();
	
	if (fecha){
		fecha = fecha.split('/');
		let f = fecha[0].split(' ');
		let d = f[1];
		let m = fecha[1];
		let y = fecha[2];
		if(d.substring(0, 1) == '0')
			d = d.substring(1);
		if(m.substring(0, 1) == '0')
			m = m.substring(1);
		fecha = y+'/'+m+'/'+d;
		
		hoy = new Date(fecha);
	}
	
	return hoy;
}

function loadMatches(opt=0){
	let day = -1;	
	let fecha = document.querySelector("#fecha");
	let hoy = getDate(fecha.innerHTML);
	
	day = setDateStorage(hoy, opt);
	
	switch (lg){
		case 'es':
			fecha.innerHTML = days_es[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
		case 'en':
			fecha.innerHTML = days_en[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
		case 'pt':
			fecha.innerHTML = days_pt[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
		case 'de':
			fecha.innerHTML = days_de[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
		case 'it':
			fecha.innerHTML = days_it[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
		case 'fr':
			fecha.innerHTML = days_fr[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
		default:
			fecha.innerHTML = days_en[day] + formatDate(hoy, 'dd/mm/yyyy');
		break;
	}
	
	if(opt != -1){
		// Mostrar mask
		showMask();
		getLeagues();
	}
}

function getFeatures(){
	actionData = {};
	const url = url_global + "features";
	
	getCall('GET', url, actionData, 4);
}

getFeatures();
loadMatches();