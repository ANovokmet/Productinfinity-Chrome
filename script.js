chrome.topSites.get(items => {
    console.log(items);
	const container = $('top-sites');
    items.forEach(item => {
        addSiteCard(container, item);
    });
})

chrome.bookmarks.getChildren("1", items => {
	const container = $('bookmarks');
	items.forEach(item => {
		if(item.dateGroupModified) {
			addGroup(item.id, item.title)
		}
        else {
			addSiteCard(container, item);
		}
	})
});

function addGroup(id, title) {
	const mainContainer = $('main-container');
	const CONTAINER_ID = 'bookmarks-' + id;

	const titleDiv = ce('div');
	titleDiv.className = 'row';
	titleDiv.innerHTML = `<label>Bookmarks bar > ${title}</label>`;

	const container = ce('div');
	container.id = CONTAINER_ID;
	container.className = 'site-cards';

	chrome.bookmarks.getChildren(id, items => {
		items.forEach(item => {
			addSiteCard(container, item);
		});
	});

	mainContainer.append(titleDiv);
	mainContainer.append(container);
}


function $(id) {
    return document.getElementById(id);
}

function $c(elem, query) {
	return elem.querySelectorAll(query);
}

function ce(tagName) {
    return document.createElement(tagName);
}


/**
 * Item is {title, url}
 * @param {*} item 
 */
function addSiteCard(container, item, callback) {

    const a = ce('div');
    a.className = "site-card-wrapper";
	a.innerHTML = `
	<a href="${item.url}" title="${item.title}" class="site-card">
		<div class="card-header center">
			<img src="chrome://favicon/size/24@1x/${item.url}" alt="" />
		</div>
		<div class="card-footer center text-center">
			<span class="text-ellipsis">${item.title}</span> 
		</div>
	</a>`

	if(callback) {
		const button = ce('div');
		button.className = 'card-options';
		button.innerHTML = '&middot;&middot;&middot;'
		button.onclick = callback;
		a.append(button);
	}

	container.append(a);
	return a;
}

['h-b', 'nh-b', 'h-nb', 'nh-nb'].forEach(id => {
    bindToStorage($(id), id);
});

function bindToStorage(elem, key) {
    chrome.storage.local.get([key], function(data) {
        elem.value = data[key];
    });

    function updateStorage(e) {
        const data = {};
        data[key] = this.value;
        chrome.storage.local.set(data);
    }

    elem.oninput = updateStorage;
}

const shortcutsMenu = new Shortcuts();
const modal = new Modal();

function Modal() {
	MicroModal.init();
	const inputTitle = $('input-title');
	const inputUrl = $('input-url');
	const MODAL_ID = 'site-modal';

	$('add-site').onclick = () => {
		this.setData('', '');
		MicroModal.show(MODAL_ID);
	}

	$('remove-site').onclick = () => {
		const item = this.getData();
		shortcutsMenu.removeShortcut(item);
		MicroModal.close(MODAL_ID);
	}

	$('done-site').onclick = () => {
		const item = this.getData();
		shortcutsMenu.addShortcut(item);
		MicroModal.close(MODAL_ID);
	}

	this.open = function(item) {
		this.setData(item.title, item.url);
		MicroModal.show(MODAL_ID);
	}

	this.setData = function(title, url) {
		inputTitle.value = title;
		inputUrl.value = url;
	}

	this.getData = function() {
		return {
			title: inputTitle.value,
			url: inputUrl.value
		}
	}
}


function Shortcuts() {
	this.shortcuts = [];
	const container = $('shortcuts');

	function addElement(item) {
		addSiteCard(container, item, e => {
			e.stopPropagation();
			modal.open(item);
		});
	}

	chrome.storage.local.get(['shortcuts'], (data) => {
		this.shortcuts = data['shortcuts'] || [];
		this.shortcuts.forEach(addElement);
	});

	this.addShortcut = function(item) {
		addElement(item);
		this.shortcuts.push(item);
		chrome.storage.local.set({shortcuts: this.shortcuts});
	}

	this.removeShortcut = function(item) {
		const index = this.shortcuts.findIndex(s => s.url === item.url);
		if(index !== -1){
			this.shortcuts.splice(index, 1);
			chrome.storage.local.set({shortcuts: this.shortcuts});
			const elems = $c(container, '.site-card-wrapper');
			elems[index].remove();
		}
	}
}