import { ajoutListenersAvis, envoyerAvis, afficherGraphe, } from "./avis.js"
let pieces = localStorage.getItem("pieces")
if (pieces === null) {
    const response = await fetch("http://localhost:8082/pieces/")
    pieces = await response.json()

    const valeurPieces = JSON.stringify(pieces)
    window.localStorage.setItem("pieces", valeurPieces)
} else {
    pieces = JSON.parse(pieces)
}




envoyerAvis()
// cette fonction permet de générer des articles pour chaque pièce
function genererPieces(pieces) {

    for (let i = 0; i < pieces.length; i++) {
        const articles = pieces[i]
        const fiches = document.querySelector(".fiches")


        const sectionarticles = document.createElement("article")
        sectionarticles.dataset.id = pieces[i].id
        const image = document.createElement("img")
        image.src = articles.image

        const titre = document.createElement("h2")
        titre.innerText = articles.nom

        const categorie = document.createElement("P")
        categorie.innerText = articles.categorie ?? "aucune catégorie"

        const description = document.createElement("p")
        description.innerText = articles.description ?? "pas de description"

        const prix = document.createElement("p")
        prix.innerText = `prix: ${articles.prix} € (${articles.prix < 35 ? "€" : "€€€"})`

        const avisBouton = document.createElement("button")
        avisBouton.dataset.id = articles.id
        avisBouton.textContent = "afficher les avis"




        fiches.appendChild(sectionarticles)
        sectionarticles.appendChild(image)
        sectionarticles.appendChild(titre)
        sectionarticles.appendChild(prix)
        sectionarticles.appendChild(categorie)
        sectionarticles.appendChild(description)
        sectionarticles.appendChild(avisBouton)

    }
    ajoutListenersAvis()
}
//première génération des pièces dans le DOM
genererPieces(pieces)


// for (let i = 0; i < pieces.length; i++) {
//     const id = pieces[i].id
//     const avisPieces = window.localStorage.getItem(`avis-pieces${id}`)
//     const avis = JSON.parse(avisPieces)
//     if (avis) {
//         const pieceElement = document.querySelector(`article[data-id="${id}"]`)
//         affichagesdesAvis(pieceElement, avis)

//     }
// }


//cette fonction permet de trier les pièces par ordre croissant de prix 
const btnTrier = document.querySelector(".btn-trier")
btnTrier.addEventListener("click", () => {

    const piecesOrdre = Array.from(pieces)
    piecesOrdre.sort(function (a, b) {
        return a.prix - b.prix
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesOrdre)
})


const filter = document.querySelector(".btn-filtrer")
// cette fonction permet de filtrer les pièces dont le prix est supérieur ou égal à 35 euros
filter.addEventListener('click', () => {
    const piecesfiltres = pieces.filter((piece) => {
        return piece.prix >= 35
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesfiltres)

})

const butdescription = document.querySelector(".butd")
//cette fonction permet de filtrer les pièces qui ont une description
butdescription.addEventListener('click', () => {
    const filterdescription = pieces.filter((butdescript) => {
        return butdescript.description
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(filterdescription)
})



const ordreD = document.querySelector(".buttorder")
//cette fonction permet de trier les pièces par ordre décroissant de prix 
ordreD.addEventListener('click', () => {
    const ordre = Array.from(pieces)
    ordre.sort((a, b) => {
        return b.prix - a.prix
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(ordre)
})

//cette fonction permet d'afficher les pièces dont le prix est inférieur à 35 euros grace a la metode map et splice
const noms = pieces.map((piece) => piece.nom)
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
        noms.splice(i, 1)
    }
}

// console.log(Array.isArray(pieces))
const listeAbordable = document.createElement("ul")
//cete boucle permet de créer une liste des pièces abordables
for (let i = 0; i < noms.length; i++) {
    const element = document.createElement("li")
    element.innerText = noms[i]
    listeAbordable.appendChild(element)
}
const sectionAbordable = document.querySelector(".abordable")
sectionAbordable.appendChild(listeAbordable)


const dispo = pieces.map((piece) => piece.description)
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].disponible === false) {
        dispo.splice(i, 1)
    }
}

// cette fonction permet de créer une liste des pièces disponibles
const prixDispo = pieces.map((piece) => piece.prix)
const piecesdispo = pieces.map((piece) => piece.nom)
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].disponible === false) {
        piecesdispo.splice(i, 1)
        prixDispo.splice(i, 1)
    }
}

const listeDispo = document.createElement("ul")
for (let i = 0; i < piecesdispo.length; i++) {
    const items = document.createElement("li")
    items.innerText = `${piecesdispo[i]} -${prixDispo[i]} €`
    listeDispo.appendChild(items)
}
const disponible = document.querySelector(".disponibles")
disponible.appendChild(listeDispo)

const PrixMax = document.querySelector("#prixMax")
// cette fonction permet de filtrer les pièces dont le prix est inférieur ou égal à la valeur du range input
PrixMax.addEventListener('input', () => {
    const piecesfiltrees = pieces.filter((piece) => {
        return piece.prix <= PrixMax.value
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesfiltrees)
})


const butaccueil = document.querySelector(".butaccueil")
butaccueil.addEventListener('click', () => {
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(pieces)
})

const miseajour = document.querySelector(".maj")
miseajour.addEventListener('click', () => {
    // window.localStorage.removeItem("pieces")
    localStorage.clear()
    console.log("le cache est vide")
})


await afficherGraphe()
