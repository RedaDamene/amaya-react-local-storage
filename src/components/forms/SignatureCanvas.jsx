import { useRef, useState, useEffect } from "react";

export default function SignatureCanvas({ onSave, disabled = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(null);
  const [ctx, setCtx] = useState(null);

  // Initialiser le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    // Définir la taille du canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Préparer le contexte
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000000";
    
    setCtx(context);
    
    // Nettoyer le canvas
    clearCanvas();
  }, []);

  // Effacer le canvas
  const clearCanvas = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignature(null);
  };

  // Commencer à dessiner
  const startDrawing = (e) => {
    if (disabled) return;
    
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  // Dessiner
  const draw = (e) => {
    if (!isDrawing || disabled) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  // Arrêter de dessiner
  const stopDrawing = () => {
    if (!isDrawing || disabled) return;
    
    setIsDrawing(false);
    ctx.closePath();
    
    // Sauvegarder la signature
    const signatureData = canvasRef.current.toDataURL("image/png");
    setSignature(signatureData);
  };

  // Obtenir les coordonnées (souris ou tactile)
  const getCoordinates = (event) => {
    if (event.touches && event.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: event.touches[0].clientX - rect.left,
        offsetY: event.touches[0].clientY - rect.top
      };
    } else {
      return {
        offsetX: event.nativeEvent.offsetX,
        offsetY: event.nativeEvent.offsetY
      };
    }
  };

  // Sauvegarder la signature
  const saveSignature = () => {
    if (signature) {
      onSave(signature);
    } else {
      alert("Veuillez signer avant de valider");
    }
  };

  return (
    <div className="signature-container">
      <div className="canvas-container" style={{ border: "1px solid #ccc", borderRadius: "4px", marginBottom: "10px" }}>
        <canvas
          ref={canvasRef}
          width="400"
          height="200"
          style={{ width: "100%", height: "200px", touchAction: "none" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="d-flex justify-content-between">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={clearCanvas}
          disabled={disabled}
        >
          Effacer
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={saveSignature}
          disabled={disabled || !signature}
        >
          Valider la signature
        </button>
      </div>
    </div>
  );
}