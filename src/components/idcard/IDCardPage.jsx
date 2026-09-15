import { useState } from "react";
import IDCardForm from "./IDCardForm";
import IDCardPreview from "./IDCardPreview";
import "./idcard.css";

export default function IDCardPage() {
  const [cardData, setCardData] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleGenerate = (data) => {
    setCardData(data);
    setGenerated(true);
    setAnimKey((k) => k + 1); // re-trigger animation on re-generate
  };

  return (
    <div className="idc-page">
      <div className="idc-split">
        {/* Left — Form */}
        <div>
          <IDCardForm onGenerate={handleGenerate} />
        </div>

        {/* Right — Preview */}
        <div className="idc-preview-panel">
          <p className="idc-preview-panel-title">
            {generated ? "Your ID Card Preview" : "Card Preview"}
          </p>
          <IDCardPreview
            data={cardData}
            generated={generated}
            animKey={animKey}
          />
        </div>
      </div>
    </div>
  );
}
