import listModule from "./list.js";
import cardModule from "./card.js";

// on objet qui contient des fonctions
const app = {
  base_url: "http://localhost:3000",
  // fonction d'initialisation, lancée au chargement de la page
  async init() {
    // Initialisation des modules (on renseigne l'url de l'API)
    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);

    console.log('app.init !');

    app.addListenerToActions();
    await app.getListsFromAPI();
  },
  // Initialisation des événements
  addListenerToActions() {
    // je récupère mon bouton par son id
    document.querySelector("#addListButton").addEventListener("click", listModule.showAddModal);

    // j'ajoute l'événement click sur mes boutons "close"
    const closeButtons = document.querySelectorAll(".close");
    for (const button of closeButtons) {
      button.addEventListener("click", app.hideModals);
    }

    // ajout de l'événement "submit" lors de l'envoi du formulaire de création d'une liste
    document.querySelector("#addListModal form").addEventListener("submit", listModule.handleAddForm);

    // ajout de l'événement "submit" lors de l'envoi du formulaire de création carte
    document.querySelector("#addCardModal form").addEventListener("submit", cardModule.handleAddForm);

    // j'ajoute l'événement click sur mes boutons "+"
    // document.querySelectorAll(".is-pulled-right").forEach(button => button.addEventListener("click", app.showAddCardModal));
  },
  // Récupération des listes et des cartes
  async getListsFromAPI() {
    let response;
    // j'appelle l'API pour récupérer les listes et leurs cartes
    try{
      response = await fetch(`${app.base_url}/lists`);
    }
    catch(err){
      console.error(err);
    }
    
    if (response && response.ok) {
      let lists = await response.json();

      // je parcours les listes
      for (let list of lists) {
        listModule.makeInDOM(list);

        // je parcours les cartes de la liste courante
        for (let card of list.cards) {
          cardModule.makeInDOM(card);
        }
      }
    }
    else {
      alert("Problème avec l'API !!!");
    }
  },
  // Fermeture de toutes les popup
  hideModals() {
    // j'enlève la class "is-active" qui permet de masquer la modal
    document.querySelectorAll(".modal").forEach(modal => modal.classList.remove("is-active"));
  },


};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);