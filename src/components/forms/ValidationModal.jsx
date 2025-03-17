import { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';

export default function ValidationModal({ onValidate, onCancel, factureNum }) {
  const [signatureData, setSignatureData] = useState(null);
  const [userFullName, setUserFullName] = useState('');
  const [validationNotes, setValidationNotes] = useState('');

  // Gérer la sauvegarde de la signature
  const handleSignatureSave = (signature) => {
    setSignatureData(signature);
  };

  // Gérer la validation finale
  const handleValidation = () => {
    if (!signatureData) {
      alert("Veuillez signer avant de valider la facture");
      return;
    }
    
    if (!userFullName.trim()) {
      alert("Veuillez entrer votre nom complet");
      return;
    }
    
    // Envoyer les données de validation
    onValidate({
      signature: signatureData,
      userFullName: userFullName,
      validationNotes: validationNotes,
      validationDate: new Date().toISOString()
    });
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Validation définitive de la facture {factureNum}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          
          <div className="modal-body">
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Attention : Après validation, cette facture ne pourra plus être modifiée. 
              Toute correction devra être effectuée via une facture d'avoir.
            </div>
            
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">Votre nom complet *</label>
              <input 
                type="text" 
                className="form-control" 
                id="userName"
                value={userFullName}
                onChange={(e) => setUserFullName(e.target.value)}
                required
              />
              <div className="form-text">Ce nom sera enregistré avec la validation</div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="validationNotes" className="form-label">Notes de validation</label>
              <textarea 
                className="form-control" 
                id="validationNotes"
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                rows="2"
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Signature *</label>
              <SignatureCanvas onSave={handleSignatureSave} />
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              Annuler
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleValidation}
              disabled={!signatureData || !userFullName.trim()}
            >
              Valider définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}