import cardModule from "./card.js";

export default {
    base_url: null,
    setBaseUrl(url) {
        // this est le contexte - correspond à mon module
        this.base_url = url;
    },
    // Ouverture de la popup pour ajouter une liste
    showAddModal() {
        // j'ajoute la class "is-active" qui permet d'afficher la modal
        document.querySelector("#addListModal").classList.add("is-active");
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
            response = await fetch(`${base_url}/lists`, {
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
            app.makeListInDOM(list);
        }

        // je reset le formulaire
        event.target.reset();

        // Je masque la modal
        app.hideModals();
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
};