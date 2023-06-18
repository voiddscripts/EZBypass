// ==UserScript==
// @name         EZBypass (Linkvertise) [UPDATED]
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Simplified Linkvertise bypassing.
// @author       ###
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://linkvertise.com
// @exclude      *://linkvertise.com/search*
// @exclude      *://blog.linkvertise.com
// @exclude      *://blog.linkvertise.com/*
// @exclude      https://linkvertise.com/assets/vendor/thinksuggest.html
// @exclude      https://linkvertise.com/assets/vendor/*
// @exclude      https://linkvertise.com/
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @icon         https://www.google.com/s2/favicons?domain=linkvertise.com
// @license ###
// ==/UserScript==

(function () {
  'use strict';

  const bypassServerUrl = "https://main-bypass-server.tk/v8?" + window.location.href;

  async function httpGet(url) {
    const response = await fetch(url);
    return response.text();
  }

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    const cookie = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookie ? cookie.pop() : null;
  }

  if (getCookie("useManualfa") === 'yes') {
    setCookie("useManualfa", 'no', 30);
    let response, target_token, ut, linkvertise_link, link_id, key = getCookie("BPtoke");
    setCookie("BPtoke", "", 1);
    let bypassFlag = false;

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener('load', async (data) => {
        if (data.currentTarget.responseText.includes('tokens')) {
          response = JSON.parse(data.currentTarget.responseText);
          target_token = response.data.tokens['TARGET'];
          ut = localStorage.getItem("X-LINKVERTISE-UT");
          linkvertise_link = location.pathname.replace(/\/[0-9]$/, "");
          if (!getCookie('permssssss')) {
            GM_xmlhttpRequest({
              method: "GET",
              url: `https://publisher.linkvertise.com/api/v1/redirect/link/static${linkvertise_link}?X-Linkvertise-UT=${ut}`,
              onload: function () {
                setCookie('permssssss', "yes", 3365);
                window.location.reload();
              }
            });
          }
          const uagt = await httpGet('https://main-bypass-server.tk/ua');

          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://publisher.linkvertise.com/api/v1/redirect/link/static${linkvertise_link}?X-Linkvertise-UT=${ut}`,
            headers: {
              "User-Agent": uagt
            },
            onload: function (response) {
              const json = JSON.parse(response.responseText);
              const target_type = json.data.link.target_type;
              link_id = json.data.link.id;
              const json_body = {
                serial: btoa(JSON.stringify({ timestamp: new Date().getTime(), random: "6548307", link_id: link_id })),
                token: target_token
              };
              GM_xmlhttpRequest({
                method: 'POST',
                url: `https://publisher.linkvertise.com/api/v1/redirect/link${linkvertise_link}${target_type === "PASTE" ? '/paste' : "/target"}?X-Linkvertise-UT=${ut}`,
                data: JSON.stringify(json_body),
                headers: {
                  "Accept": 'application/json',
                  "Content-Type": 'application/json',
                  "User-Agent": uagt
                },
                onload: function (response) {
                  const json = JSON.parse(response.responseText);
                  httpGet(`https://main-bypass-server.tk/manual?targetToken=${encodeURIComponent(target_token)}&linkId=${encodeURIComponent(link_id)}&lvLink=${encodeURIComponent(linkvertise_link)}&ut=${encodeURIComponent(ut)}&url=${encodeURIComponent(window.location.href)}&key=${encodeURIComponent(key)}&tType=${encodeURIComponent(target_type)}&Fts=${encodeURIComponent(btoa(JSON.stringify(json)))}`)
                    .then((w) => {
                      window.location.replace(JSON.parse(w).destination);
                    });
                }
              });
              bypassFlag = true;
            }
          });
        }
      });
      originalOpen.apply(this, arguments);
    };
  } else {
    const bypassRequest = new XMLHttpRequest();
    bypassRequest.addEventListener("load", function () {
      const response = JSON.parse(this.responseText);

      if (response.destination.includes("https://errorr.ml/?")) {
        const key = response.destination.substring(19);
        setCookie("useManualfa", "yes", 1);
        setCookie("BPtoke", key, 1);
        window.location.reload();
      } else {
        window.location.replace(response.destination);
      }
    });

    bypassRequest.open("GET", bypassServerUrl);
    bypassRequest.send();
  }
})();
