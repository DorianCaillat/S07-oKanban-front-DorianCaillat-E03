export default {
    base_url: null,
    setBaseUrl(url) {
        this.base_url = url;
    },
    
    // Ouverture de la popup pour ajouter une carte
    showAddModal(event) {

        // je récupère l'id de ma liste
        const listHTML = event.target.closest(".panel");

        // je récupère ma modal
        const cardModal = document.querySelector("#addCardModal")

        // je mets à jour le champ input avec l'id de ma liste
        // console.log(listHTML.dataset["list-id"]);
        cardModal.querySelector('form input[name="list_id"]').value = listHTML.dataset.listId;

        // j'ajoute la class "is-active" qui permet d'afficher la modal
        cardModal.classList.add("is-active");
    },

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
            response = await fetch(`${app.base_url}/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json
            });
        }
        catch (err) {
            console.error(err);
        }

        if (response.ok) {
            // je récupère la nouvelle liste créée dans mon API
            const card = await response.json();

            // J'ajoute le code HTML
            app.makeCardInDOM(card);
        }

        // je reset le formulaire
        event.target.reset();

        // Je masque la modal
        app.hideModals();
    },
    
    // Ajout d'une carte HTML dans notre page
    makeInDOM(card) {
        // Je récupère le template
        const template = document.querySelector("#card-template");

        // Je clone le template
        const newCard = document.importNode(template.content, true);

        // Toujours utiliser textContent plutôt que innerHTML (pour éviter des problèmes de sécurité)
        newCard.querySelector("#name").textContent = card.title;
        newCard.querySelector(".box").dataset.cardId = card.id;
        newCard.querySelector(".box").style["background-color"] = card.color;

        // Je récupère le conteneur de cartes
        const cardContainer = document.querySelector(`[data-list-id="${card.list_id}"] .panel-block`);
        // J'ajoute ma carte en premier
        cardContainer.appendChild(newCard);
    }
}