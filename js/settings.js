const prefs = JSON.parse(localStorage.getItem('prefs')) ?? { lang: 'ru', theme: 0 };
let { lang: currentLang, theme: currentTheme } = prefs;
let data = {};

const settings = document.getElementById('settings');
const dropdown = settings.querySelector('.kpszh-header-dropdown-menu');
const btn = settings.querySelector('.kpszh-header-dropdown-button');

const savePrefs = () => localStorage.setItem('prefs', JSON.stringify(prefs));

function toggleActive(selector, key, value) {
    settings.querySelectorAll(selector).forEach(el =>
        el.classList.toggle('active', String(el.dataset[key]) === String(value))
    );
}

async function prefsLoad(lang) {
    const res = await fetch('/js/language.json');
    data = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = data[lang][el.dataset.i18n]; });
    document.documentElement.lang = lang;
    toggleActive('[data-lang]', 'lang', lang);
}

document.addEventListener('click', e => {
    if (!settings.contains(e.target)) {
        dropdown.classList.remove('open');
        btn.classList.remove('active');
    }
});

btn.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open);
    dropdown.setAttribute('aria-hidden', !open);
});

function setLang(lang) {
    currentLang = prefs.lang = lang;
    savePrefs();
    prefsLoad(lang);
}

function setTheme(theme) {
    currentTheme = prefs.theme = theme;
    savePrefs();
    document.documentElement.style.setProperty('--accent-hsl', theme);
    toggleActive('[data-theme]', 'theme', theme);
}

settings.addEventListener('click', e => {
    const lang = e.target.closest('[data-lang]');
    const theme = e.target.closest('[data-theme]');
    if (lang) return setLang(lang.dataset.lang);
    if (theme) return setTheme(Number(theme.dataset.theme));
});

prefsLoad(currentLang);
setTheme(currentTheme);