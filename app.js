Object.defineProperty(String.prototype, 'uriEncoded', {
    get: function() {
        return encodeURIComponent(this);
    }
});

HTMLElement.prototype.createChild = function(tagName) {
    return this.appendChild(document.createElement(tagName));
}

HTMLElement.withID = (id) => document.getElementById(id);

const ElementID = {
    searchForm: 'searchForm',
    //searchButton: 'searchButton',
    searchTextField: 'searchText',
    storeSelectionContainer: 'storeSelection',
};

class App {
    stores = {
        'bauhaus':  { name: 'Bauhaus',  url: 'https://www.bauhaus.info/suche/produkte?text={{search}}' },
        'baywa':    { name: 'Baywa',    url: 'https://www.baywa-baumarkt.de/search?search={{search}}' },
        'globus':   { name: 'Globus',   url: 'https://www.globus-baumarkt.de/search?sSearch={{search}}' },
        'hagebau':  { name: 'Hagebau',  url: 'https://www.hagebau.de/search/?q={{search}}&ms=true' },
        'hellweg':  { name: 'Hellweg',  url: 'https://www.hellweg.de/search?search={{search}}' },
        'hornbach': { name: 'Hornbach', url: 'https://www.hornbach.de/shop/suche/sortiment/{{search}}' },
        'obi':      { name: 'Obi',      url: 'https://www.obi.de/search/{{search}}/' },
        'toom':     { name: 'Toom',     url: 'https://toom.de/s/{{search}}' },
    };


    #elementID = {
        searchForm: 'searchForm',
        //searchButton: 'searchButton',
        searchTextField: 'searchText',
        storeSelectionContainer: 'storeSelection',
    };


    constructor() {}

    setup() {
        Object.entries(this.stores).forEach(([id, store]) =>
            this.#addStoreSelectionCheckbox(id, store)
        );
        const form = HTMLElement.withID(ElementID.searchForm);
        form.onsubmit = ($0) => this.#runSearch($0);
        form.onchange = ()   => this.#saveSelection();
    }

    #addStoreSelectionCheckbox(storeID, store) {
        const container = HTMLElement.withID(ElementID.storeSelectionContainer);
        const selection = this.#loadSelection();
        
        const checkboxGroup = container.createChild('div');
        checkboxGroup.className = 'form-check';

        const label = checkboxGroup.createChild('label');
        label.setAttribute('for', storeID);
        label.className = 'form-check-label';
        label.innerText = store.name;

        const checkbox = checkboxGroup.createChild('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        checkbox.id = storeID;
        checkbox.checked = selection[storeID] ?? true;
    }


    #saveSelection() {
        const form = HTMLElement.withID(ElementID.searchForm);
        const selectionEntries = Array.from(form.elements)
            .filter($0 => $0.type === 'checkbox')
            .map($0 => [$0.id, $0.checked]);
        const selection = Object.fromEntries(selectionEntries);
        window.localStorage.setItem('selection', JSON.stringify(selection));
    }

    #loadSelection() {
        const selection = window.localStorage.getItem('selection');
        return (selection !== null) ? JSON.parse(selection) : {};
    }


    #runSearch(event) {
        event.preventDefault();

        const searchText = HTMLElement.withID(ElementID.searchTextField).value;
        const encodedSearchText = searchText.uriEncoded;

        const formInputs = event.srcElement.elements;
        for (const input of formInputs) {
            if (!input.checked) { continue; }
            const store = this.stores[input.id];
            const url = store.url.replace('{{search}}', encodedSearchText);
            window.open(url, '_blank');
            // console.log(url);
        }
    }
}

const app = new App();
app.setup();
