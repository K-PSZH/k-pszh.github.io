window.I18N = (function(){
  const cfg = {
    defaultLang: 'ru',
    supported: ['ru','en'],
    localesPath: '/locales',
    cacheTTL: 1000 * 60 * 60,
    updateUrl: false
  };

  let store = {};
  let lastLoad = {};

  function pickLang() {
    const qp = new URLSearchParams(location.search).get('lang');
    if (qp && cfg.supported.includes(qp)) return qp;
    const hash = location.hash.replace('#','');
    if (hash && cfg.supported.includes(hash)) return hash;
    try {
      const saved = localStorage.getItem('lang');
      if (saved && cfg.supported.includes(saved)) return saved;
    } catch(e){}
    const nav = (navigator.language || navigator.userLanguage || '').slice(0,2);
    if (cfg.supported.includes(nav)) return nav;
    return cfg.defaultLang;
  }

  async function fetchLocale(lang){
    if (store[lang] && (Date.now() - (lastLoad[lang]||0) < cfg.cacheTTL)) return store[lang];
    const url = `${cfg.localesPath}/${lang}.json`;
    const res = await fetch(url, {cache: 'no-store'});
    if (!res.ok) throw new Error('Locale not found: ' + url);
    const obj = await res.json();
    store[lang] = obj;
    lastLoad[lang] = Date.now();
    return obj;
  }

  function getKey(obj, path) {
    return path.split('.').reduce((s,k)=> (s && s[k] !== undefined) ? s[k] : undefined, obj);
  }

  function applyTranslations(dict){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const v = getKey(dict, key);
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      const v = getKey(dict, key);
      if (v !== undefined) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{
      const key = el.getAttribute('data-i18n-title');
      const v = getKey(dict, key);
      if (v !== undefined) el.setAttribute('title', v);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el=>{
      const key = el.getAttribute('data-i18n-alt');
      const v = getKey(dict, key);
      if (v !== undefined) el.setAttribute('alt', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{
      const raw = el.getAttribute('data-i18n-aria');
      const parts = raw.split(':');
      if (parts.length === 2) {
        const attr = parts[0];
        const key = parts[1];
        const v = getKey(dict, key);
        if (v !== undefined) el.setAttribute(attr, v);
      }
    });
    document.querySelectorAll('meta[data-i18n-meta]').forEach(m=>{
      const key = m.getAttribute('data-i18n-meta');
      const v = getKey(dict, key);
      if (v !== undefined) m.setAttribute('content', v);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{
      const key = el.getAttribute('data-i18n-html');
      const v = getKey(dict, key);
      if (v !== undefined) el.innerHTML = v;
    });
  }

  function safeUpdateLangInUrl(lang){
    if (!cfg.updateUrl) return;
    try {
      const url = new URL(location.href);
      const current = new URLSearchParams(url.search).get('lang');
      if (current === lang) return;
      url.searchParams.set('lang', lang);
      const newUrl = url.pathname + url.search + url.hash;
      history.replaceState(null, '', newUrl);
    } catch (e) {
      console.warn('safeUpdateLangInUrl failed', e);
    }
  }

  async function setLang(lang) {
    if (!cfg.supported.includes(lang)) lang = cfg.defaultLang;
    try {
      const dict = await fetchLocale(lang);
      applyTranslations(dict);
      document.documentElement.lang = lang;
      try { localStorage.setItem('lang', lang); } catch(e){}
      safeUpdateLangInUrl(lang);
    } catch(e) {
      console.error('i18n error:', e);
    }
  }

  function attachSwitcher() {
    cfg.supported.forEach(l=>{
      const el = document.getElementById('lang-' + l);
      if (!el) return;
      el.addEventListener('click', (ev)=>{
        ev.preventDefault();
        const cur = pickLang();
        if (cur === l) return;
        setLang(l);
      });
    });
  }

  return {
    init: function(options){
      Object.assign(cfg, options||{});
      const lang = pickLang();
      window.I18N = window.I18N || {};
      window.I18N.setLang = setLang;
      window.I18N.current = lang;
      setLang(lang);
      attachSwitcher();
    },
    _cfg: cfg
  };
})();
