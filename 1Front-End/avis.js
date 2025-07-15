// // function addTwoNums(a,b){
// //     try{
// //         console.log(a+b)
// //         if(typeof(a) !== 'number' ){
// //             throw new Error("The first argument is not a number.")

// //         }else if(typeof(b) !== 'number'){
// //             throw new Error("The second argument is not a number.")
// //         }else{
// //             console.log(a+b)
// //         }      
// // }catch(err){
// //     console.error("Error!", err)  
// // }   
// // }
// // addTwoNums(5,"5")
// // console.log("It still works")
// function fib(n) {
//     // Step 1: Define the base case(s) here.
//     // if (n === 0) return 0
//     // if (n === 1) return 1

//     // Hint: What is the value of Fibonacci(0) and Fibonacci(1)?

//     // Step 2: Define the recursive case here.
//     // Hint: Return the sum of Fibonacci(n-1) and Fibonacci(n-2).
//     return fab(n - 1) + fab(n - 2)
// }
// console.log(fib(5)) // 5

export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    // Vérifier si des éléments ont été trouvés
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {

            const id = event.target.dataset.id

            let avisPieces = window.localStorage.getItem(`avis-pieces${id}`)
            let avis
            if (avisPieces) {
                avis = JSON.parse(avisPieces)
            } else {
                const r = await fetch(`https://sitelesbonnespieces.onrender.com/pieces/${id}/avis`)
                avis = await r.json()
                window.localStorage.setItem(`avis-pieces${id}`, JSON.stringify(avis))
            }

            piecesElements[i].disabled = true
            const pieceElement = event.target.parentElement // Récupérer l'élément parent de l'élément bouton cliqué qui est l'article
            affichagesdesAvis(pieceElement, avis)
        });
    }
}
function affichagesdesAvis(pieceElement, avis) {
    //Créer un nouvel élément pour afficher les avis
    const avisElement = document.createElement("p")
    avis.forEach(item => {
        avisElement.innerHTML += `<strong>${item.utilisateur}</strong>: ${item.commentaire}<br> 
        nobre d'etoiles: ${item.nbEtoiles}<br>`
    })
    avisElement.classList.add("avis")
    pieceElement.appendChild(avisElement)
}


export function envoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis")
    formulaireAvis.addEventListener('submit', async (event) => {
        event.preventDefault()
        //recupere les donnnees du formulaire et stocke pour etre utiliser dans body 
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=etoiles]").value)
        }

        const afficherAvis = JSON.stringify(avis)
        await fetch("https://sitelesbonnespieces.onrender.com/avis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: afficherAvis
        })
        event.target.reset()
        //recupere dans le serveur tout les avis qui correspondent a pieceId ex: si pieceId = 3 recupere tous les avis de la piece 3
        const r = await fetch(`https://sitelesbonnespieces.onrender.com/pieces/${avis.pieceId}/avis`);
        const avisActualises = await r.json();
        localStorage.setItem(`avis-pieces${avis.pieceId}`, JSON.stringify(avisActualises));//stocke les avis de cette piece dans mon localstorage ce qui permet la mise a jour

    })
}


export async function afficherGraphe() {
    const avis = await fetch("https://sitelesbonnespieces.onrender.com/avis").then(avis => avis.json())
    const nb_commentaire = [0, 0, 0, 0, 0]
    for (let comentaire of avis) {
        nb_commentaire[comentaire.nbEtoiles - 1]++
    }
    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labels = ["etoile-5", "etoile-4", "etoile-3", "etoile-2", "etoile-1"];
    const data = {
        labels: labels,
        datasets: [{
            label: 'commentaires par etoiles',
            data: nb_commentaire.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)"
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
        },
    };
    new Chart(
        document.querySelector("#myChart"),
        config
    )


    let getPieces = window.localStorage.getItem("pieces")
    const pieces = JSON.parse(getPieces)
    let commentaireDispo = 0
    let commentaireNonDispo = 0
    for (let i = 0; i < avis.length; i++) {
        const piece = pieces.find(p => p.id === avis[i].pieceId)
        if (piece) {
            if (piece.disponibilite) {
                commentaireDispo++
            } else {
                commentaireNonDispo++
            }
        }
    }

    const labelsdipo = ["PiecesDispo", "PiecesNonDispo"]
    const datapieces = {
        labels: labelsdipo,
        datasets: [
            {
                label: "Nombre de commentaire",
                data: [commentaireDispo, commentaireNonDispo],
                backgroundColor: " rgb(131, 132, 226)"
            }
        ]
    }

    const configData = {
        type: "bar",
        data: datapieces
    }

    new Chart(document.querySelector("#myChart1"), configData)
}



// export async function afficherGraphe() {
//     // Récupérer tous les avis
//     const avis = await fetch("http://localhost:8082/avis").then(r => r.json());

//     // Préparer une map pour stocker les étoiles par pièce
//     const etoilesParPiece = {};

//     for (let commentaire of avis) {
//         const pieceId = commentaire.pieceId;
//         const nbEtoiles = commentaire.nbEtoiles;

//         // Si la pièce existe déjà dans la map, on additionne
//         if (etoilesParPiece[pieceId]) {
//             etoilesParPiece[pieceId] += nbEtoiles;
//         } else {
//             etoilesParPiece[pieceId] = nbEtoiles;
//         }
//     }

//     // Charger les infos de chaque pièce (nom, etc.)
//     const pieces = await fetch("http://localhost:8082/pieces").then(r => r.json());

//     // Associer nom + total étoiles
//     const nomsPieces = [];
//     const etoilesTotales = [];

//     for (let piece of pieces) {
//         if (etoilesParPiece[piece.id]) {
//             nomsPieces.push(piece.nom);
//             etoilesTotales.push(etoilesParPiece[piece.id]);
//         }
//     }

//     // Créer le graphique
//     const data = {
//         labels: nomsPieces,
//         datasets: [{
//             label: 'Total étoiles par pièce',
//             data: etoilesTotales,
//             backgroundColor: [
//                 "rgba(111, 113, 230, 0.9)",
//                 "rgba(255, 159, 64, 0.9)",
//                 "rgba(75, 192, 192, 0.9)",
//                 "rgba(153, 102, 255, 0.9)",
//                 "rgba(255, 99, 132, 0.9)",
//                 "rgba(54, 162, 235, 0.9)"
//             ]
//         }]
//     };

//     const config = {
//         type: 'bar',
//         data: data,
//         options: {
//             indexAxis: 'x',
//             responsive: true,
//             plugins: {
//                 legend: {
//                     display: true
//                 },
//             }
//         }
//     };

//     new Chart(document.querySelector("#myChart"), config);
// }
