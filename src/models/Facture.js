import Ligne from "./Ligne"
export default class Facture{
    constructor (exercice){
        this.id = new Date().getTime()
        this.name=''
        this.num =''
        this.crea =''
        this.sent =''  
        this.client = ''
        this.charges = ''
        this.ht = 0.00
        this.lignes = []
        this.lignes.push(new Ligne())
        this.exercice = exercice
        
        // Propriétés de sécurisation
        this.status = 'brouillon' // brouillon, validée, annulée
        this.dateValidation = null
        this.userValidation = null
        this.historique = [] // Pour tracer les modifications
        this.factureDavoir = null // Référence à une éventuelle facture d'avoir
        this.factureOriginale = null // Pour les factures d'avoir
        
        // Propriétés de signature
        this.signature = null // Données de l'image de signature
        this.signataireName = null // Nom du signataire
        this.signatureNotes = null // Notes associées à la validation
    }

    // Vérifier si la facture est modifiable
    estModifiable() {
        return this.status !== 'validée'
    }

    // Calculer le total de la facture
    calculerTotal() {
        let total = 0
        for (const ligne of this.lignes) {
            // Utiliser les propriétés de votre classe Ligne
            const prix = parseFloat(ligne.prix) || 0
            const quantite = parseFloat(ligne.qt) || 0
            total += prix * quantite
        }
        // Ajouter les charges
        if (this.charges) {
            total += parseFloat(this.charges)
        }
        return Math.round(total * 100) / 100
    }

    // Valider la facture avec signature
    valider(validationData) {
        if (this.status === 'validée') {
            throw new Error('Cette facture est déjà validée')
        }

        // Vérifier que la signature est présente
        if (!validationData.signature) {
            throw new Error('La signature est requise pour valider la facture')
        }

        // Vérifier que le nom du signataire est présent
        if (!validationData.userFullName) {
            throw new Error('Le nom du signataire est requis pour valider la facture')
        }

        // Calculer le total si nécessaire
        if (!this.ht || this.ht === 0) {
            this.ht = this.calculerTotal()
        }

        // Enregistrer les informations de signature
        this.signature = validationData.signature
        this.signataireName = validationData.userFullName
        this.signatureNotes = validationData.validationNotes || ''

        // Changement de statut
        this.status = 'validée'
        this.dateValidation = validationData.validationDate || new Date().toISOString()
        this.userValidation = validationData.userFullName

        // Ajouter à l'historique
        this.ajouterHistorique(
            validationData.userFullName, 
            'validation', 
            `Facture validée et verrouillée par ${validationData.userFullName}`
        )

        return true
    }

    // Créer une facture d'avoir
    creerFactureDavoir(userId = 'system') {
        if (this.status !== 'validée') {
            throw new Error("Seules les factures validées peuvent avoir une facture d'avoir")
        }

        // Créer une nouvelle facture d'avoir
        const avoir = new Facture(this.exercice)
        avoir.name = `Avoir pour ${this.num} - ${this.name}`
        avoir.num = `AV-${this.num}`
        avoir.crea = new Date().toISOString().split('T')[0]
        avoir.client = this.client
        avoir.factureOriginale = this.id
        
        // Copier les lignes avec montants négatifs
        for (const ligne of this.lignes) {
            const nouvelleLigne = new Ligne()
            nouvelleLigne.ligne1 = ligne.ligne1
            nouvelleLigne.ligne2 = ligne.ligne2
            nouvelleLigne.ligne3 = ligne.ligne3
            nouvelleLigne.prix = ligne.prix
            // Quantité négative pour l'avoir
            nouvelleLigne.qt = parseFloat(ligne.qt) * -1
            // Total sera négatif aussi
            nouvelleLigne.total = parseFloat(ligne.total || 0) * -1
            avoir.lignes.push(nouvelleLigne)
        }

        // Inverser les charges
        if (this.charges) {
            avoir.charges = parseFloat(this.charges) * -1
        }

        // Inverser le total
        avoir.ht = parseFloat(this.ht) * -1

        // Ajouter à l'historique
        this.ajouterHistorique(userId, 'avoir', `Création d'une facture d'avoir: ${avoir.id}`)
        this.factureDavoir = avoir.id

        return avoir
    }

    // Ajouter un événement à l'historique
    ajouterHistorique(userId, type, description) {
        const evenement = {
            date: new Date().toISOString(),
            userId: userId,
            type: type,
            description: description
        }

        this.historique.push(evenement)
    }
}