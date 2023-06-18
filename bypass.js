// ==UserScript==
// @name         EZBypass (Linkvertise) [Updated again]
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Simplifies Linkvertise link bypassing.
// @author       X1Y
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
// ==/UserScript==

(function () {
  'use strict';

  const bypassServerUrl = 'https://bypass.pm/bypass2?url=' + encodeURIComponent(window.location.href);

  async function bypassLinkvertise() {
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    };

    const response = await fetch(bypassServerUrl, { headers });
    const data = await response.json();
    const link = data.destination;
    window.location.href = link;
  }

  bypassLinkvertise();
})();
