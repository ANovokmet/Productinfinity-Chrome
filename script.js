chrome.topSites.get(items => {
    console.log(items);
    items.forEach(item => {
        addSiteCard(item);
    });
})

chrome.bookmarks.getTree(p => {
    console.log(p);
})


function $(id) {
    return document.getElementById(id);
}

function ce(tagName) {
    return document.createElement(tagName);
}

function addLink(item) {
    const topSitesContainer = $('top-sites');

    const div = ce('div');
    div.innerHTML = `<a href="${item.url}"><img src="chrome://favicon/size/24@1x/${item.url}" alt=""/>${item.title}</a>`;
    topSitesContainer.append(div);
}

/**
 * Item is {title, url}
 * @param {*} item 
 */
function addSiteCard(item) {
    const topSitesContainer = $('top-sites');

    const a = ce('a');
    a.href = item.url;
    a.title = item.title;
    a.className = "site-card";
    a.innerHTML = `<div class="card-header center">
        <img src="chrome://favicon/size/24@1x/${item.url}" alt="" />
    </div>
    <div class="card-footer center text-center">
        <span class="text-ellipsis">${item.title}</span> 
    </div>`;

    topSitesContainer.append(a);
}

['h-b', 'nh-b', 'h-nb', 'nh-nb'].forEach(id => {
    bindToStorage($(id), id);
});

function bindToStorage(elem, key) {
    chrome.storage.local.get([key], function(data) {
        elem.value = data[key];
    });

    function func(e) {
        const data = {};
        data[key] = this.value;
        chrome.storage.local.set(data);
    }

    elem.oninput = func;
}


// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//   function thumbnailsGotten(data) {
//     var eightBallWindow = $('mostVisitedThumb');
//     var rand = Math.floor(Math.random() * data.length);
//     eightBallWindow.href = data[rand].url;
//     eightBallWindow.textContent = data[rand].title;
//     eightBallWindow.style.backgroundImage = 'url(chrome://favicon/' +
//         data[rand].url + ')';
//   }
  
//   window.onload = function() {
//     chrome.topSites.get(thumbnailsGotten);
//   }