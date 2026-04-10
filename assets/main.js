// document.getElementById('entryDialog').showModal()
//Ouverture de mon dialogue auto
const DEBUG = true // Permet l'utilisation des console.table/log pour affichage console : repris dans les fonctions


//Mes Variables :
const btnNewEntry = document.getElementById('newEntry') //Bouton New Saisie
const entryDialog = document.getElementById('entryDialog') // Dialog : New Saisie

const notifError = document.getElementById('notif_Input_Error') //div Erreur de Saisie dans dialog

const btnCancelEntry = document.getElementById('cancel') // Btn Annuler dans New Saisie
const btnOkEntry = document.getElementById('ok') // Btn Valider dans New Saisie

const client = document.getElementById('clientInput')
const refPiece = document.getElementById('refInput')
const mat = document.getElementById('mat')
const epaiss = document.getElementById('epaisseur')
const planX = document.getElementById('planXinput')
const planY = document.getElementById('planYinput')
const cotaX = document.getElementById('cotaXinput')
const cotaY = document.getElementById('cotaYinput')
const diffX = document.getElementById('diffXinput')
const diffY = document.getElementById('diffYinput')
const diffInputDialog = document.getElementById('diffInputDialog')

const bodyTable = document.getElementById('bodyTable')
//const pAc =
//const rubMeter =
//const comment =
const numTotalEntry = document.getElementById('numTotalEntry')
const numGoodEntry = document.getElementById('numGoodEntry')
const numBadEntry = document.getElementById('numBadEntry')

const infoVersion = document.getElementById('infoVersion')

const diffXY = [diffX, diffY] //Pour desactiver mes radio dans le forEach en cas de saisie manuelle
let total = 0
let totalOk = 0
let totalNok = 0

let meterX, meterY // = let meterX & let meterY : Annoncées mais non sans valeur pour l'instant
//Scripts :
window.addEventListener('load', () => { //Load page : ajout des meter dans dialog NewEntry
    iniMeters()
})
//Dialog New Entry : Open / Close
btnNewEntry.addEventListener("click", () => {   
    entryDialog.showModal()  
})
btnCancelEntry.addEventListener("click", () =>{
    entryDialog.close();
})

//Erreurs sur mes Inputs
function showError(message) {
    notifError.textContent = message
    notifError.classList.add('active')
    setTimeout(() => {
        notifError.classList.remove('active')
    }, 5000)
}
//Selecteurs type Radio
document.querySelectorAll('input[name="outil"]').forEach(radio => {
    radio.addEventListener('change', () => {
        diffX.value = radio.value
        diffY.value = radio.value
    })
})
//en cas de modif : les Radio passe en inactif

diffXY.forEach(input => {
    input.addEventListener('input', () => {
        document.querySelectorAll('input[name="outil"]').forEach(radio => {
            radio.checked = false
        })
    })
})

//Fonction Creation 
function creerRow(isOkX, isOkY, ecartX, ecartY) { 
    //Appel de isOkX et isOKY + ecartX & Y (en parametres)
    const createRow = document.createElement('tr')
    const statutGlobal = (isOkX && isOkY) ? "✅ OK" : "❌ REJET";  // Condition si les 2données sont ok ou pas + texte
    const dataRow = [
        //on met nos values dans une const pour le forEach create array 
        client.value, 
        refPiece.value,
        mat.value, 
        epaiss.value, 
        planX.value, 
        planY.value, 
        cotaX.value,
        cotaY.value, 
        diffX.value, 
        diffY.value, 
        statutGlobal
    ]
    const meterRowX = document.createElement('meter')
        meterRowX.classList.add('meter_row_x')
        const tolX = parseFloat(diffX.value)
        meterRowX.min = 0
        meterRowX.max = tolX * 1
        meterRowX.low = tolX * 0.7
        meterRowX.high = tolX * 0.99
        meterRowX.optimum = 0
        meterRowX.value = ecartX
    const meterRowY = document.createElement('meter')
        meterRowY.classList.add('meter_row_y')
        const tolY = parseFloat(diffY.value)
        meterRowY.min = 0
        meterRowY.max = tolY * 1
        meterRowY.low = tolY * 0.7
        meterRowY.high = tolY * 0.99
        meterRowY.optimum = 0
        meterRowY.value = ecartY

    dataRow.forEach((donnee, index) => { //POUR CHAQUE CELLULES : dataRow=cellules
        const cellule = document.createElement('td')

        cellule.textContent = donnee
            if (index === 8) {
                cellule.textContent = ""  // efface le chiffre brut
                const label = document.createElement('small')
                label.textContent = ecartX.toFixed(2) + ' / ±' + parseFloat(diffX.value).toFixed(2)
                cellule.appendChild(label)
                cellule.appendChild(meterRowX)
            }
            if (index === 9) {
            cellule.textContent = ""  // efface le chiffre brut
            const label = document.createElement('small')
            label.textContent = ecartY.toFixed(2) + ' / ±' + parseFloat(diffY.value).toFixed(2)
            cellule.appendChild(label)
            cellule.appendChild(meterRowY)
            }
            if (index === 10) // Si l'index = 10 : Si toutes les champs sont presénts
            {
                if (donnee === "✅ OK") // Si les pieces sont ok : Class list ajout pour CSS
                    {
                    cellule.classList.add('statut-ok');} 
                    else                // Sinon ajout de la class pour le CSS
                    {
                    cellule.classList.add('statut-nok'); }
            }
        createRow.appendChild(cellule)  //Creation de la Cellule dans la ligne
    })

    bodyTable.appendChild(createRow)//Creation de la ligne dans le body du tableau
} 

function resetForm(){
    const champs = [client, refPiece,mat, epaiss, planX, planY, cotaX,cotaY, diffX, diffY]
    champs.forEach((champ) => {
        champ.value = ""
    }) //Fonction pour clear les champs des inputs à la fermeture du dialog
}

btnOkEntry.addEventListener('click', () => {
        if (!client.value || !refPiece.value || !mat.value || 
        !epaiss.value || !planX.value || !planY.value || 
        !cotaX.value || !cotaY.value || !diffX.value || !diffY.value) {
        showError("Tous les champs sont obligatoires")
        return
    }
    const ecartX = Math.abs(parseFloat(planX.value) - parseFloat(cotaX.value)) || 0
    const ecartY = Math.abs(parseFloat(planY.value) - parseFloat(cotaY.value)) || 0
    const isOkX = ecartX <= parseFloat(diffX.value)
    const isOkY = ecartY <= parseFloat(diffY.value)

    if (DEBUG) { console.table({
        client: client.value,
        ref: refPiece.value,
        ecartX: ecartX,
        ecartY: ecartY,
        isOkX: isOkX,
        isOkY: isOkY,
        })
    } //Permet l'affichage de console.table avec les elements dans la console id debug = true

    creerRow(isOkX, isOkY, ecartX, ecartY)
    majCompteurs(isOkX, isOkY)
    resetForm()
    entryDialog.close() //Facultatif
}) //Bouton de Validation : Executions des fonctions : Creer Ligne tableau / Maj Compteur / Vide champs / (close)

function majCompteurs(isOkX, isOkY) // Appel de isOkX&Y (en parametre)
{
    total = total +1 // total++
    if (isOkX && isOkY) { totalOk++ } else { totalNok++ }
    numTotalEntry.textContent = total
    numGoodEntry.textContent = totalOk
    numBadEntry.textContent = totalNok
} // Met a jour les compteur et les inscrit dans leurs span respectifs

function iniMeters() {
    const divMeter = document.createElement('div')
    divMeter.classList.add('diffMeter')
    meterX = document.createElement('meter')
    meterX.id = 'meterXhtml'
    meterX.min = 0
    meterX.low = 0.7
    meterX.high = 0.9
    meterX.optimum = 0
    meterX.value = 0
    meterY = document.createElement('meter')
    meterY.id = 'meterYhtml'
    meterY.min = 0
    meterY.low = 0.7
    meterY.high = 0.9
    meterY.optimum = 0
    meterY.value = 0

    divMeter.appendChild(meterX)
    divMeter.appendChild(meterY)
    diffInputDialog.insertAdjacentElement('afterend', divMeter)
}

    const inputListenMeter = [cotaX, cotaY, diffX, diffY]
inputListenMeter.forEach((input) =>{
    input.addEventListener('input', function(){
    const tolX = parseFloat(diffX.value) || 0
    const tolY = parseFloat(diffY.value) || 0

    meterX.max = tolX * 1
    meterX.low = tolX * 0.7
    meterX.high = tolX * 0.9
    meterX.value = Math.abs(parseFloat(planX.value) - parseFloat(cotaX.value)) || 0

    meterY.max = tolY * 1
    meterY.low = tolY * 0.7
    meterY.high = tolY * 0.9
    meterY.value = Math.abs(parseFloat(planY.value) - parseFloat(cotaY.value)) || 0
    })
})

infoVersion.addEventListener('click', function() {
    const versionlog = document.getElementById('versionlog')
    versionlog.classList.toggle('active')
})
