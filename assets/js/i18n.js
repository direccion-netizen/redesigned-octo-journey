/*!
 * GestpointGSM — simple i18n engine (vanilla JS, no build step)
 * ---------------------------------------------------------------
 * How it works:
 *  - Every translatable piece of text in the HTML is wrapped in a
 *    <span data-i18n="some.key">Texto original</span>
 *  - Attributes (title, meta content, alt, placeholder, aria-label) use
 *    data-i18n-attr="attrName:some.key" (several can be separated by ";")
 *  - All translations live in /assets/i18n/es.json and /assets/i18n/en.json
 *    as flat "key": "text" dictionaries. To edit copy, just edit those
 *    two files — no need to touch any .html file.
 *  - The chosen language is remembered in localStorage and also detected
 *    from the browser on first visit.
 *
 * This file is intentionally dependency-free so it works on GitHub Pages
 * or any static host with no server-side processing.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "gp_lang";
  var SUPPORTED = ["es", "en"];
  var DEFAULT_LANG = "es";
  var dictCache = {};

  function detectInitialLang() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {
      /* localStorage may be unavailable (privacy mode) — ignore */
    }
    var nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (nav.indexOf("en") === 0) return "en";
    return DEFAULT_LANG;
  }

  function assetPath(file) {
    // All pages live at the site root, so a relative path is enough.
    return "assets/i18n/" + file + ".json";
  }

  function loadDict(lang) {
    if (dictCache[lang]) return Promise.resolve(dictCache[lang]);
    return fetch(assetPath(lang), { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("i18n: could not load " + lang + ".json");
        return res.json();
      })
      .then(function (json) {
        dictCache[lang] = json;
        return json;
      });
  }

  function applyDict(dict) {
    // Text nodes
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.textContent = dict[key];
      }
    });

    // Attributes: data-i18n-attr="alt:key;placeholder:key2"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr");
      spec.split(";").forEach(function (pair) {
        var idx = pair.indexOf(":");
        if (idx === -1) return;
        var attr = pair.slice(0, idx).trim();
        var key = pair.slice(idx + 1).trim();
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
          el.setAttribute(attr, dict[key]);
        }
      });
    });
  }

  function renderSwitcher(current) {
    var slots = document.querySelectorAll("#lang-switch");
    slots.forEach(function (slot) {
      slot.innerHTML = "";
      SUPPORTED.forEach(function (lang) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lang-switch-btn" + (lang === current ? " is-active" : "");
        btn.textContent = lang.toUpperCase();
        btn.setAttribute("aria-pressed", lang === current ? "true" : "false");
        btn.addEventListener("click", function () {
          setLanguage(lang);
        });
        slot.appendChild(btn);
      });
    });
  }

  function setLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    loadDict(lang).then(function (dict) {
      applyDict(dict);
      document.documentElement.setAttribute("lang", lang);
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        /* ignore */
      }
      renderSwitcher(lang);
      document.dispatchEvent(new CustomEvent("gp:langchange", { detail: { lang: lang } }));
    }).catch(function (err) {
      console.error(err);
    });
  }

  window.gpI18n = { setLanguage: setLanguage, getSupportedLanguages: function () { return SUPPORTED.slice(); } };

  document.addEventListener("DOMContentLoaded", function () {
    setLanguage(detectInitialLang());
  });
})();
