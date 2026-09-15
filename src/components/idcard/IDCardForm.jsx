import { useState, useRef } from "react";
import vsaLogo from "../../assets/vsa-logo.png";
import dbscLogo from "../../assets/dbsc-logo.png";

/* ─── Branch lists ────────────────────────────────────────────────── */
const VSA_BRANCHES = [
  "VSA TARSAALI",
  "VSA NIZAMPURA",
  "VSA BHAYLI",
  "VSA NYSA",
  "VSA CHAMP KID",
  "VSA YARD X",
];

/* ─── IDCardForm ──────────────────────────────────────────────────── */
export default function IDCardForm({ onGenerate }) {
  const [club, setClub] = useState("");
  const [branch, setBranch] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [sport, setSport] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  /* Center is auto-derived */
  const center =
    club === "vsa" ? branch : club === "dbsc" ? "DBSC FC ARENA" : "";

  /* ── Handlers ── */
  const handleClubChange = (value) => {
    setClub(value);
    setBranch("");
    setError("");
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!club) return setError("Please select a club.");
    if (club === "vsa" && !branch) return setError("Please select a branch.");
    if (!name.trim()) return setError("Please enter the player's name.");
    if (!age || Number(age) <= 0) return setError("Please enter a valid age.");
    if (!dob) return setError("Please select a date of birth.");
    if (!sport.trim()) return setError("Please enter the sport.");
    if (!photoUrl) return setError("Please upload a player photo.");

    onGenerate({ club, branch, name: name.trim(), age, dob, sport: sport.trim(), center, photoUrl });
  };

  return (
    <div className="idc-form-panel">
      <h2 className="idc-form-title">🪪 Player ID Card</h2>
      <p className="idc-form-subtitle">
        Fill in the details below to generate a professional player ID card.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── CLUB SELECTION ── */}
        <div className="idc-field-group">
          <label className="idc-label">Select Club *</label>
          <div className="idc-club-grid">
            {/* VSA */}
            <button
              type="button"
              id="club-vsa"
              className={`idc-club-card${club === "vsa" ? " selected" : ""}`}
              onClick={() => handleClubChange("vsa")}
            >
              <img src={vsaLogo} alt="Vadodara Sports Academia logo" />
              <span className="idc-club-card-name">VADODARA SPORTS ACADEMIA</span>
            </button>

            {/* DBSC FC */}
            <button
              type="button"
              id="club-dbsc"
              className={`idc-club-card${club === "dbsc" ? " selected" : ""}`}
              onClick={() => handleClubChange("dbsc")}
            >
              <img src={dbscLogo} alt="DBSC FC logo" />
              <span className="idc-club-card-name">DBSC FC</span>
            </button>
          </div>
        </div>

        {/* ── VSA BRANCH ── */}
        {club === "vsa" && (
          <div className="idc-field-group">
            <label htmlFor="vsa-branch" className="idc-label">
              Select Branch *
            </label>
            <select
              id="vsa-branch"
              className="idc-select"
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                setError("");
              }}
            >
              <option value="">— Select Branch —</option>
              {VSA_BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── DBSC ARENA (display only) ── */}
        {club === "dbsc" && (
          <div className="idc-field-group">
            <label className="idc-label">Arena</label>
            <input
              className="idc-input"
              value="DBSC FC ARENA"
              readOnly
            />
          </div>
        )}

        {/* ── CENTER (auto-derived, shown after club/branch) ── */}
        {center && (
          <div className="idc-field-group">
            <label className="idc-label">Center (auto-filled)</label>
            <input className="idc-input" value={center} readOnly />
          </div>
        )}

        <hr className="idc-divider" />

        {/* ── NAME + AGE ── */}
        <div className="idc-form-row-2">
          <div className="idc-field-group">
            <label htmlFor="player-name" className="idc-label">
              Name *
            </label>
            <input
              id="player-name"
              className="idc-input"
              type="text"
              placeholder="Player full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="idc-field-group">
            <label htmlFor="player-age" className="idc-label">
              Age *
            </label>
            <input
              id="player-age"
              className="idc-input"
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 17"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

        {/* ── DOB ── */}
        <div className="idc-field-group">
          <label htmlFor="player-dob" className="idc-label">
            Date of Birth *
          </label>
          <input
            id="player-dob"
            className="idc-input"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {/* ── SPORT ── */}
        <div className="idc-field-group">
          <label htmlFor="player-sport" className="idc-label">
            Sport *
          </label>
          <input
            id="player-sport"
            className="idc-input"
            type="text"
            placeholder="e.g. Football, Cricket, Badminton"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          />
        </div>

        <hr className="idc-divider" />

        {/* ── PHOTO UPLOAD ── */}
        <div className="idc-field-group">
          <label className="idc-label">Player Photo *</label>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="player-photo"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handlePhoto}
          />

          {/* Drop zone */}
          <div
            className={`idc-photo-upload-area${photoUrl ? " has-photo" : ""}`}
            onClick={handleDropZoneClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            style={{ cursor: "pointer" }}
          >
            {photoUrl ? (
              <>
                <img
                  src={photoUrl}
                  alt="Player photo preview"
                  className="idc-photo-preview"
                />
                <p className="idc-photo-hint">Click to change photo</p>
              </>
            ) : (
              <>
                <span className="idc-photo-icon">📷</span>
                <p className="idc-photo-hint">
                  Click or drag & drop to upload
                  <br />
                  JPG, JPEG, PNG, or WEBP
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="idc-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* ── SUBMIT ── */}
        <button type="submit" className="idc-generate-btn" id="generate-id-card-btn">
          ✦ Generate ID Card
        </button>
      </form>
    </div>
  );
}
