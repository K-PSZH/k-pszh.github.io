// Сама система i18n

let currentLang = localStorage.getItem('lang') || 'ru';

async function langLoad(lang) {
    const res = await fetch('/js/language.json');
    data = await res.json();

    // Текстовые элементы
    document.querySelectorAll('[data-i18n]').forEach(e => {
        const key = e.dataset.i18n;
        e.innerHTML = data[lang][key];
    });

    // Видео на главной странице (бесшовно)
    const en = document.getElementById('title-front-en');
    const ru = document.getElementById('title-front-ru');

    const active = lang === 'ru' ? ru : en;
    const inactive = lang === 'ru' ? en : ru;
    active.currentTime = inactive.currentTime;

    active.style.opacity = 1;
    inactive.style.opacity = 0;

    document.documentElement.lang = lang;
}

// Функция смены языка
function langSet(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    langLoad(lang);

    // Подписи изображений в image viewer
    viewerCaption.textContent = data[lang][activeCaptionKey] || '';
}

// Сохранение выбранного языка локально
langLoad(currentLang);

// Меню выбора языка
function langMenu() {
    document.getElementById("lang-dropdown").classList.toggle("show");
}

// Пункты меню выбора языка
window.onclick = e => {
    if (!e.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("kpszh-header-dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}