// Function itself
async function langLoad(lang) {
    const res = await fetch('/js/language.json');
    const data = await res.json();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = data[lang][key];
    });

    document.documentElement.lang = lang;
}

function langSet(lang) {
    localStorage.setItem('lang', lang);
    langLoad(lang);
}

langLoad(localStorage.getItem('lang') || 'ru');

// Dropdown
function langMenu() {
    document.getElementById("lang-dropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
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