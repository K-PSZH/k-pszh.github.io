// Сама система i18n
let currentLang = localStorage.getItem('lang') || 'ru';

async function langLoad(lang) {
    const res = await fetch('/js/language.json');
    data = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(e => {
        const key = e.dataset.i18n;
        e.innerHTML = data[lang][key];
    });
    document.querySelectorAll('#lang-dropdown a').forEach(e => e.classList.toggle('active', e.dataset.lang === lang));
    document.documentElement.lang = lang;
}

// Функция смены языка
function langSet(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    langLoad(lang);
    viewerCaption.textContent = data[lang][activeCaptionKey] || '';
}

// Сохранение выбранного языка локально
langLoad(currentLang);

// Меню выбора языка
function langMenu() {
    const dropdown = document.getElementById("lang-dropdown");
    const btn = document.querySelector(".kpszh-header-dropdown-button");
    dropdown.classList.toggle("display-block");
    btn.classList.toggle("active", dropdown.classList.contains("display-block"));
}

// Пункты меню выбора языка
window.onclick = e => {
    // если клик не по элементу внутри dropdown
    if (!e.target.closest('.kpszh-header-dropdown')) {
        const dropdown = document.getElementById("lang-dropdown");
        const btn = document.querySelector(".kpszh-header-dropdown-button");
        if (dropdown.classList.contains('display-block')) {
            dropdown.classList.remove('display-block');
            btn.classList.remove('active');
        }
    }
};