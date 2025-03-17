import jsPDF from "jspdf";
import logo1 from "../../assets/facture-pdf/logo3.jpg";
import iconMailG from "../../assets/facture-pdf/icon-mail.jpg";
import iconPhoneG from "../../assets/facture-pdf/icon-phone.jpg";
import iconWebG from "../../assets/facture-pdf/icon-www.jpg";
import iconInvG from "../../assets/facture-pdf/icon-inv.jpg";
import iconMobileG from "../../assets/facture-pdf/icon-mobile.jpg";
import triangleWhite from "../../assets/facture-pdf/triangle-white.jpg";
import iconCircle from "../../assets/facture-pdf/icon-circle.jpg";
import iconEuro from "../../assets/facture-pdf/icon-euro.png";
import iconAgenda from "../../assets/facture-pdf/icon-agenda.png";
import iconBarcode from "../../assets/facture-pdf/icon-barcode.png";
import iconEuroWhite from "../../assets/facture-pdf/icon-euro-w.png";
import iconEuroBlack from "../../assets/facture-pdf/icon-euro-g.png";
import imageFactice from "../../assets/facture-pdf/factice.png";
import autoTable from 'jspdf-autotable'

import open from "../../assets/facture-pdf/OpenSans-Regular.ttf";
import openB from "../../assets/facture-pdf/OpenSans-Bold.ttf";

const formatNumber= (number)=>
{
    number = parseFloat(number).toFixed(2) + '';
    const x = number.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}

export const myFacturePdf = (facture, client) => {
  const pdf = new jsPDF();
  const data = localStorage.getItem("amaya");
  const amaya = JSON.parse(data);
  if (data) {
    pdf.setProperties({
      title: "FACTURE " + facture.num,
      subject: "Facture " + facture.name,
      author: amaya.entreprise.name,
      keywords: "facture, " + client.shortName,
      creator: "Amaya Facture"
    });
    
    const tva = (parseFloat(facture.ht)*0.2).toFixed(2);
    const ttc = (parseFloat(facture.ht)*1.2).toFixed(2);
    const crea = new Date(facture.crea);
    pdf.addFont(open, "OpenSans-Regular", "normal");
    pdf.addFont(openB, "OpenSans-Bold", "normal");

    //-----------------------------------------------
    // HAUT A GAUCHE
    //-----------------------------------------------
    const y = 4;
    pdf.addImage(logo1, "JPEG", 7, 4 + y, 20, 20);
    pdf.setFontSize(11);

    pdf.setTextColor(128, 128, 128);
    pdf.setFont("OpenSans-Regular");
    pdf.text(amaya.entreprise.name, 32, 9.5 + y);
    pdf.setFontSize(8);
    pdf.text(amaya.entreprise.address1, 32, 14 + y);
    pdf.text(amaya.entreprise.address2, 32, 18 + y);
    pdf.text(amaya.entreprise.country, 32, 22 + y);

    //-----------------------------------------------
    // HAUT CARTOUCHE DROIT
    //-----------------------------------------------

    pdf.addImage(iconMailG, "JPEG", 79, 11, 5, 3.3);
    pdf.text(amaya.entreprise.email, 79, 22);

    pdf.addImage(iconPhoneG, "JPEG", 114, 11, 4, 4);
    pdf.text(amaya.entreprise.tel, 114, 22);

    pdf.addImage(iconWebG, "JPEG", 149, 11, 4, 4);
    pdf.text(amaya.entreprise.www, 149, 22);

    // les lignes : _|_|_ ;)
    pdf.setFillColor(128, 128, 128);
    pdf.rect(79, 27, 100, 0.1, "F");
    pdf.rect(112, 10, 0.1, 16, "F"); // w :115 -3
    pdf.rect(147, 10, 0.1, 16, "F"); // w :150 -3

    pdf.setFontSize(44);
    pdf.setFont("OpenSans-Bold");
    pdf.text("FACTURE", 78, 41);

    //-----------------------------------------------
    // Statut de la facture (si validée ou avoir)
    //-----------------------------------------------
    if (facture.status === 'validée') {
      pdf.setFontSize(12);
      pdf.setTextColor(125, 187, 119); // Vert
      pdf.text("VALIDÉE", 173, 41);

      // Date de validation si disponible
      if (facture.dateValidation) {
        pdf.setFontSize(8);
        pdf.setFont("OpenSans-Regular");
        const dateValid = new Date(facture.dateValidation);
        pdf.text(`Le ${dateValid.toLocaleDateString()}`, 173, 45);
      }
    } else if (facture.factureOriginale) {
      pdf.setFontSize(12);
      pdf.setTextColor(255, 140, 0); // Orange
      pdf.text("AVOIR", 173, 41);
    }
    
    // Retour à la couleur normale
    pdf.setTextColor(128, 128, 128);

    //-----------------------------------------------
    // A L'INTENTION DE
    //-----------------------------------------------

    pdf.setFont("OpenSans-Regular");
    pdf.setFontSize(12);
    pdf.addImage(iconInvG, "JPEG", 9.5, 34, 10, 11);
    pdf.text("A L'INTENTION DE", 20, 43.5);
    // ligne de separation
    pdf.rect(9.5, 46, 46, 0.1, "F");
    //-----------------------------------------

    //-----------------------------------------
    pdf.setFont("OpenSans-Bold");
    pdf.text(client.company, 10, 51);
    pdf.setFontSize(10);
    pdf.text(client.name, 10, 56);
    pdf.setFontSize(8);
    pdf.setFont("OpenSans-Regular");
    pdf.text(client.address1, 10, 61);
    pdf.text(client.address2, 10, 65);
    pdf.text(client.country, 10, 69);
    //-----------------------------------------
    const y2 = 2;
    pdf.addImage(iconMobileG, "JPEG", 11, 68.5 + y2, 6, 6);
    pdf.text(client.tel, 17, 72.5 + y2);
    pdf.addImage(iconMailG, "JPEG", 10, 76 + y2, 5, 3.3);
    pdf.text(client.email, 17, 78.6 + y2);
    // ligne de separation
    pdf.rect(9.5, 84, 46, 0.1, "F");

    //-----------------------------------------------
    // PAVE VERT
    //-----------------------------------------------
    // les bulles
    pdf.addImage(iconCircle, "JPEG", 79, 55, 10, 10);
    pdf.addImage(iconCircle, "JPEG", 112, 55, 10, 10);
    pdf.addImage(iconCircle, "JPEG", 149, 55, 10, 10);
    // les icones des bulles
    pdf.addImage(iconEuro, "PNG", 80.7, 56.7, 8, 6.7);
    pdf.addImage(iconAgenda, "PNG", 114, 56.5, 8, 6.7);
    pdf.addImage(iconBarcode, "PNG", 150, 56, 10, 8.3);

    // Le rectangle VERT
    //-----------------------------------------------
    pdf.setFillColor(125, 187, 119);
    pdf.rect(79, 67, 100, 17, "F");
    //-----------------------------------------------

    // les triangles blancs
    pdf.addImage(triangleWhite, "JPEG", 81, 67, 5, 4.2);
    pdf.addImage(triangleWhite, "JPEG", 114, 67, 5, 4.2);
    pdf.addImage(triangleWhite, "JPEG", 151, 67, 5, 4.2);

    // le contenu
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text("Montant TTC", 82, 76);
    pdf.text("Date", 115, 76);
    pdf.text("Facture #", 150, 76);

    // les 3 valeur :

    pdf.addImage(iconEuroWhite, "JPEG", 81.7, 78, 5, 4.2);
    pdf.setFont("OpenSans-Bold");
    pdf.setFontSize(13);
    pdf.text(formatNumber(ttc), 86, 82);
    pdf.text(crea.toLocaleDateString(), 115, 82);
    pdf.text(facture.num, 150, 82);

    //-----------------------------------------------
    //-----------------------------------------------
    // LES PRODUITS PARTIE CENTRAL
    //-----------------------------------------------
    //-----------------------------------------------
    pdf.setTextColor(125, 187, 119);
    pdf.setFontSize(12);
    pdf.setFont("OpenSans-Regular");
    pdf.text("Produit", 10, 104);
    pdf.text("Prix HT", 81.5, 104);
    pdf.text("Quantité", 115, 104);
    pdf.text("Total HT", 151, 103.5);

    pdf.setFillColor(232, 232, 232);
    pdf.rect(0, 105, 180, 17, "F");
    pdf.setFillColor(246, 246, 246);
    pdf.rect(0, 122, 180, 17, "F");
    pdf.setFillColor(232, 232, 232);
    pdf.rect(0, 139, 180, 17, "F");
    pdf.setFillColor(246, 246, 246);
    pdf.rect(0, 156, 180, 17, "F");

    // cadre CHEQUE OU VIREMENT
    pdf.setFillColor(150, 150, 150);
    pdf.rect(9.5, 173, 70, 9, "F");
    pdf.setFont("OpenSans-Bold");
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text("MODE DE PAIEMENT ", 14, 179);
    pdf.setFont("OpenSans-Regular");
    pdf.text(":  CHEQUE OU VIREMENT", 43, 179);

    //$pdf->SetTextColor(60,60,60);
    //-----------------------------------------------
    //-----------------------------------------------
    let yp = 0;
    facture.lignes.map(p => {
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(9);
      pdf.text(p.ligne1, 10, 110+yp);
      pdf.setFontSize(7);
      pdf.text(p.ligne2, 10, 114.5+yp);
      pdf.text(p.ligne3,10,119+yp);
      pdf.addImage(iconEuroBlack, "PNG", 81.5, 111.5+yp, 4, 3.35);
      pdf.setFontSize(10);
      pdf.text(p.prix, 86, 114.5+yp);
      pdf.text(p.qt, 115, 114.5+yp);
      pdf.addImage(iconEuroBlack, "PNG", 151, 111.5+yp, 4, 3.35);
      autoTable(pdf, {
        startY: 110.5+yp,
        tableWidth:24,
        margin: {
          left: 153,
        },
        
        body: [
          [{ content: formatNumber(p.total),  styles: { font:'OpenSans-Regular', halign: 'right' ,textColor:'#3c3c3c',fillColor:false  } }],
        ],
       
      })  
    
      yp += 17
    }) // fin for each des 4 lignes
    pdf.setFillColor(232, 232, 232);
    pdf.rect(110, 173, 70, 9, "F");
    pdf.setFillColor(200, 200, 200);
    pdf.rect(110, 173, 70, 0.2, "F");
    pdf.setFont("OpenSans-Bold");
    pdf.text("SOUS TOTAL HT", 115, 179);
    pdf.addImage(iconEuroBlack, "PNG", 151, 176, 4, 3.35);
   
    //pdf.text("10000.00", 155.5, 179);
    autoTable(pdf, {
      startY:174,
      tableWidth:24,
      margin: {
        left: 153,
      },
      // fillColor:false 
      body: [
        [{ content: formatNumber(facture.ht),  styles: { font:'OpenSans-Bold', halign: 'right' ,textColor:'#3c3c3c',fillColor:false  } }],
      ],
     
    })  
    //---

    pdf.setFillColor(246, 246, 246);
    pdf.rect(110, 182, 70, 9, "F");
    pdf.setFillColor(200, 200, 200);
    pdf.rect(110, 182, 70, 0.2, "F");
   // pdf.setFont("OpenSans-Regular");
    pdf.text("TVA", 115, 188);
    pdf.addImage(iconEuroBlack, "PNG", 151, 185, 4, 3.35);
   // pdf.setFont("OpenSans-Bold");
      //pdf.text(addSpace("2000.00"), 155.5, 188);
    //  pdf.cell(155.5,97,30,9,formatNumber(tva),1,'right')
    autoTable(pdf, {
      startY:183,
      tableWidth:24,
      margin: {
        left: 153,
      },
      // fillColor:false 
      body: [
        [{ content: formatNumber(tva),  styles: { font:'OpenSans-Bold', halign: 'right' ,textColor:'#3c3c3c',fillColor:false  } }],
      ],
     
     })

  
    //---
    pdf.setTextColor(60, 60, 60);
    pdf.setFillColor(60, 60, 60);
    pdf.rect(110, 191, 70, 0.2, "F");
   // pdf.setFont("OpenSans-Regular");
    pdf.text("TOTAL TTC", 115, 197);
    pdf.addImage(iconEuroBlack, "PNG", 151, 194, 4, 3.35);
   // pdf.setFont("OpenSans-Bold");
   // pdf.text(addSpace("120000.00"), 155.5, 197);
   //pdf.autoTable({body:["test"]});

   autoTable(pdf, {
    startY:192,
    tableWidth:24,
    margin: {
      left: 153,
    },
    // fillColor:false 
    body: [
      [{ content: formatNumber(ttc),  styles: { font:'OpenSans-Bold', halign: 'right' ,textColor:'#000000',fillColor:false  } }],
    ],
   
  })

  //-----------------------------------------------
  // AJOUT DE LA SIGNATURE ELECTRONIQUE SI VALIDÉE
  //-----------------------------------------------
  if (facture.status === 'validée' && facture.signature) {
    // Création d'un cadre pour la signature
    pdf.setDrawColor(125, 187, 119); // Vert
    pdf.setLineWidth(0.5);
    
    // Position et dimensions du cadre
    const sigX = 10;
    const sigY = 205;
    const sigWidth = 90;
    const sigHeight = 25;
    
    // Dessiner le cadre
    pdf.rect(sigX, sigY, sigWidth, sigHeight);
    
    // Titre de la section
    pdf.setTextColor(125, 187, 119); // Vert
    pdf.setFontSize(10);
    pdf.setFont("OpenSans-Bold");
    pdf.text("VALIDATION ÉLECTRONIQUE", sigX + 5, sigY + 5);
    
    // Informations sur le signataire
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(8);
    pdf.setFont("OpenSans-Regular");
    
    if (facture.signataireName) {
      pdf.text(`Signataire: ${facture.signataireName}`, sigX + 5, sigY + 10);
    }
    
    if (facture.dateValidation) {
      const dateValid = new Date(facture.dateValidation);
      pdf.text(
        `Date: ${dateValid.toLocaleDateString()} à ${dateValid.toLocaleTimeString()}`, 
        sigX + 5, 
        sigY + 15
      );
    }
    
    if (facture.signatureNotes) {
      pdf.text(`Notes: ${facture.signatureNotes}`, sigX + 5, sigY + 20);
    }
    
    // Ajout de l'image de signature
    try {
      pdf.addImage(
        facture.signature,  // données base64
        'PNG',
        sigX + 55,         // Position X 
        sigY + 5,          // Position Y
        30,                // Largeur
        15                 // Hauteur
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout de la signature:", error);
    }
  }
  
  pdf.setFont("OpenSans-Bold");
  pdf.setFontSize(9);
  pdf.setTextColor(128, 128, 128);

  pdf.text('Numero de TVA Intracommunautaire FR84 888777888', 11,217);

  pdf.text('Numéro (formateur) NDA : 52441095644', 11,227);

  pdf.setFont("OpenSans-Regular");
  pdf.setFontSize(6);
  pdf.text('Conditions de paiement : paiement à réception de facture. \nAucun escompte consenti pour règlement anticipé.\nTout incident de paiement est passible d\'intérêt de retard.\nLe montant des pénalités résulte de l\'application aux sommes restant dues d\'un taux d\'intérêt égal en vigueur au moment de l\'incident. \nIndemnité forfaitaire pour les frais de recouvrement due au créancier en cas de retard de paiement : 40 Euros.', 11,257);
 
    //-----------------------------------------------
    // PIED DE PAGE
    //-----------------------------------------------
    pdf.setFontSize(6);
    pdf.setFont("OpenSans-Regular");
    pdf.text('AMAYA TECH- SAS au capital de 11.000 EUR', 11,277);
    pdf.text('810 888 888 RCS Nantes, Code APE :  6202A', 60,277);
    pdf.text('Siege Social : 6 rue de la poste 44100 Nantes FRANCE', 126,277);

  
    pdf.setFillColor(125,187,119);
    pdf.rect(0,278,179,1,'F');
    pdf.addImage(logo1, "JPEG", 9, 282 , 14, 14);



    pdf.addImage(imageFactice, "PNG", 0, 0, 210, 297);
    // pdf.setFontSize(122);
    //   pdf.setTextColor(252,212,212);
    // pdf.text('F A C T I C E',30,250,{angle:45});

    //-----------------------------------------------
    // Ouvrir directement le PDF
    const pdfOutput = pdf.output('dataurlstring');
    
    // Ouvrir le PDF dans un nouvel onglet
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe width="100%" height="100%" src="${pdfOutput}"></iframe>`
      );
    } else {
      // Si le navigateur bloque l'ouverture d'un nouvel onglet
      alert("Votre navigateur a bloqué l'ouverture du PDF. Veuillez vérifier vos paramètres de blocage des popups.");
      
      // Fallback: ouvrir le PDF dans la fenêtre actuelle
      window.location.href = pdfOutput;
    }
  }
};