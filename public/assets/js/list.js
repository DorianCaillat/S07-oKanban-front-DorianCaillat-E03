import cardModule from "./card.js";

export default {
    base_url:"http://localhost:3000",
    setBaseUrl(url) {
        // this est le contexte - correspond à mon module
        this.base_url = url;
    },

    // Ouverture de la popup pour ajouter une liste
    showAddModal() {
        // j'ajoute la class "is-active" qui permet d'afficher la modal
        document.querySelector("#addListModal").classList.add("is-active");
    },

    //*gestion de l'apparition du formulaire d'édition
    showEditListForm() {
        document.querySelector('h2').classList.add("is-hidden");
        document.querySelector('#formEditList').classList.remove("is-hidden");
    },

    // Gestion du formulaire pour ajouter une liste
    async handleAddForm(event) {
        // Je stoppe le comportement par défaut
        event.preventDefault();

        // Je récupère les valeurs de mon formulaire
        const formData = new FormData(event.target);

        // Je convertis mon FormData en JSON
        const object = {};
        formData.forEach((value, key) => object[key] = value);
        /*
          object = {
            name:"test2"
          }
        */
        // je viens stringifier, je convertis mon objet en JSON
        const json = JSON.stringify(object);

        let response;
        try {
            // J'envoie les données du formulaire à l'API
            response = await fetch(`${this.base_url}/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json
            });
        }
        catch(err){
            console.error(err);
        }

        if (response && response.ok) {
            // je récupère la nouvelle liste créée dans mon API
            const list = await response.json();

            // J'ajoute le code HTML
            this.makeInDOM(list);
        }

        // je reset le formulaire
        event.target.reset();

        // Je masque la modal
        this.hideModals();
    },

    // Ajout d'une liste HTML dans notre page
    makeInDOM(list) {
        // Je récupère le template
        const template = document.querySelector("#list-template");

        // Je clone le template
        const newList = document.importNode(template.content, true);

        // Toujours utiliser textContent plutôt que innerHTML (pour éviter des problèmes de sécurité)
        newList.querySelector("h2").textContent = list.name;
        newList.querySelector(".panel").dataset.listId = list.id;

        // Je place un événement sur le bouton +
        newList.querySelector(".is-pulled-right").addEventListener("click", cardModule.showAddModal);

        // Je viens ajouter ma liste tout à gauche de la liste de listes
        // (je récupère la première liste et je place ma liste juste avant)
        //document.querySelector("#lists .panel").before(newList);

        const listContainer = document.querySelector("#lists");
        listContainer.insertBefore(newList, listContainer.firstChild);
    },

    //*Gestion formulaire pour edition liste

    async handleEditForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const object = {};
        formData.forEach((value, key) => object[key] = value);

        const json = JSON.stringify(object);

        let response;

        try {
            response = await fetch(`${this.base_url}/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json
            });
        } catch (err) {
            console.log(err);
        }

        if (response && response.ok) {
            const listId = formData.get('list-id'); // Récupérez l'identifiant de la liste depuis le formulaire
            const h2Element = document.querySelector(`[data-list-id="${listId}"] h2`);
            h2Element.textContent = object['list-name']; // Utilisez le nom de la liste provenant du formulaire
    
        } else {
            const listId = formData.get('list-id'); // Récupérez l'identifiant de la liste depuis le formulaire
            const h2Element = document.querySelector(`[data-list-id="${listId}"] h2`);
            h2Element.classList.remove("is-hidden");
    
            document.querySelector('#formEditList').classList.add("is-hidden");
        }

        
    }
};