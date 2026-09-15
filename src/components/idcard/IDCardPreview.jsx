import { useEffect, useRef, useState } from "react";

import vsaTemplate from "../../assets/vsa-id-card.png";
import dbscTemplate from "../../assets/dbsc-id-card.png";

/*
|--------------------------------------------------------------------------
| CARD SIZE
|--------------------------------------------------------------------------
*/

const CARD_WIDTH = 853;
const CARD_HEIGHT = 1280;

/*
|--------------------------------------------------------------------------
| PLAYER PHOTO AREA
|--------------------------------------------------------------------------
| Inside the existing red photo frame.
|--------------------------------------------------------------------------
*/

const PHOTO = {
  x: 278,
  y: 423,
  width: 297,
  height: 312,
};

/*
|--------------------------------------------------------------------------
| DYNAMIC TEXT
|--------------------------------------------------------------------------
| The values are centered inside the right-side field area.
|--------------------------------------------------------------------------
*/

const TEXT = {
  // Center of the value area
  centerX: 575,

  // Moved upward so text sits ABOVE the red lines
  nameY: 792,
  ageY: 878,
  dobY: 964,
  centerY: 1050,
  sportY: 1136,

  // Available width for the values
  maxWidth: 400,
};

/*
|--------------------------------------------------------------------------
| TEXT STYLE
|--------------------------------------------------------------------------
*/

const TEXT_STYLE = {
  fontSize: 32,
  minFontSize: 18,
  fontWeight: 700,
  fontFamily: "Arial, Helvetica, sans-serif",
};

/*
|--------------------------------------------------------------------------
| LOAD IMAGE
|--------------------------------------------------------------------------
*/

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = () => {
      reject(
        new Error(`Unable to load image: ${src}`)
      );
    };

    img.src = src;
  });
}

/*
|--------------------------------------------------------------------------
| FORMAT DOB
|--------------------------------------------------------------------------
*/

function formatDOB(dob) {
  if (!dob) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    const [year, month, day] = dob.split("-");

    return `${day} / ${month} / ${year}`;
  }

  return dob;
}

/*
|--------------------------------------------------------------------------
| DRAW IMAGE AS COVER
|--------------------------------------------------------------------------
*/

function drawImageCover(
  ctx,
  image,
  x,
  y,
  width,
  height
) {
  const imageRatio =
    image.width / image.height;

  const boxRatio =
    width / height;

  let drawWidth;
  let drawHeight;

  if (imageRatio > boxRatio) {
    // Image is wider → crop left/right.
    drawHeight = height;
    drawWidth = height * imageRatio;
  } else {
    // Image is taller → crop top/bottom.
    drawWidth = width;
    drawHeight = width / imageRatio;
  }

  const drawX =
    x + (width - drawWidth) / 2;

  const drawY =
    y + (height - drawHeight) / 2;

  ctx.drawImage(
    image,
    drawX,
    drawY,
    drawWidth,
    drawHeight
  );
}

/*
|--------------------------------------------------------------------------
| DRAW PLAYER PHOTO
|--------------------------------------------------------------------------
*/

function drawPlayerPhoto(
  ctx,
  playerImage
) {
  if (!playerImage) return;

  ctx.save();

  /*
   * Keep the player's photo strictly
   * inside the existing red border.
   */
  ctx.beginPath();

  ctx.rect(
    PHOTO.x,
    PHOTO.y,
    PHOTO.width,
    PHOTO.height
  );

  ctx.clip();

  drawImageCover(
    ctx,
    playerImage,
    PHOTO.x,
    PHOTO.y,
    PHOTO.width,
    PHOTO.height
  );

  ctx.restore();
}

/*
|--------------------------------------------------------------------------
| DRAW CENTERED / FITTED TEXT
|--------------------------------------------------------------------------
*/

function drawCenteredFittedText(
  ctx,
  text,
  centerX,
  y,
  maxWidth
) {
  if (!text) return;

  let fontSize =
    TEXT_STYLE.fontSize;

  /*
   * Reduce font size for long values.
   */
  while (
    fontSize > TEXT_STYLE.minFontSize
  ) {
    ctx.font = `${TEXT_STYLE.fontWeight} ${fontSize}px ${TEXT_STYLE.fontFamily}`;

    const textWidth =
      ctx.measureText(text).width;

    if (textWidth <= maxWidth) {
      break;
    }

    fontSize -= 1;
  }

  /*
   * Center the text horizontally.
   */
  ctx.fillText(
    text,
    centerX,
    y
  );
}

/*
|--------------------------------------------------------------------------
| DRAW PLAYER DETAILS
|--------------------------------------------------------------------------
*/

function drawPlayerDetails(
  ctx,
  data
) {
  ctx.save();

  ctx.fillStyle = "#111111";

  /*
   * THIS IS THE IMPORTANT CHANGE:
   *
   * Instead of:
   * textAlign = "left"
   *
   * we center every value inside
   * the right-side field area.
   */
  ctx.textAlign = "center";

  ctx.textBaseline = "middle";

  /*
   * NAME
   */
  if (data.name) {
    drawCenteredFittedText(
      ctx,
      data.name,
      TEXT.centerX,
      TEXT.nameY,
      TEXT.maxWidth
    );
  }

  /*
   * AGE
   */
  if (data.age) {
    drawCenteredFittedText(
      ctx,
      String(data.age),
      TEXT.centerX,
      TEXT.ageY,
      TEXT.maxWidth
    );
  }

  /*
   * DOB
   */
  if (data.dob) {
    drawCenteredFittedText(
      ctx,
      formatDOB(data.dob),
      TEXT.centerX,
      TEXT.dobY,
      TEXT.maxWidth
    );
  }

  /*
   * CENTER
   */
  if (data.center) {
    drawCenteredFittedText(
      ctx,
      data.center,
      TEXT.centerX,
      TEXT.centerY,
      TEXT.maxWidth
    );
  }

  /*
   * SPORT
   */
  if (data.sport) {
    drawCenteredFittedText(
      ctx,
      data.sport,
      TEXT.centerX,
      TEXT.sportY,
      TEXT.maxWidth
    );
  }

  ctx.restore();
}

/*
|--------------------------------------------------------------------------
| GENERATE COMPLETE CARD
|--------------------------------------------------------------------------
*/

async function drawCard(
  canvas,
  data
) {
  /*
   * Keep the downloaded image at
   * the original template resolution.
   */
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Unable to create canvas context."
    );
  }

  ctx.clearRect(
    0,
    0,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  /*
  |--------------------------------------------------------------------------
  | STEP 1 — SELECT CARD TEMPLATE
  |--------------------------------------------------------------------------
  */

  const template =
    data.club === "dbsc"
      ? dbscTemplate
      : vsaTemplate;

  const baseImage =
    await loadImage(template);

  /*
   * Draw the COMPLETE template.
   *
   * Nothing from the template is recreated.
   */
  ctx.drawImage(
    baseImage,
    0,
    0,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  /*
  |--------------------------------------------------------------------------
  | STEP 2 — PLAYER PHOTO
  |--------------------------------------------------------------------------
  */

  if (data.photoUrl) {
    try {
      const playerImage =
        await loadImage(
          data.photoUrl
        );

      drawPlayerPhoto(
        ctx,
        playerImage
      );
    } catch (error) {
      console.error(
        "Unable to load player photo:",
        error
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | STEP 3 — PLAYER DETAILS
  |--------------------------------------------------------------------------
  */

  drawPlayerDetails(
    ctx,
    data
  );
}

/*
|--------------------------------------------------------------------------
| ID CARD PREVIEW COMPONENT
|--------------------------------------------------------------------------
*/

export default function IDCardPreview({
  data,
  generated,
  animKey,
}) {
  const canvasRef =
    useRef(null);

  const [drawing, setDrawing] =
    useState(false);

  const [drawError, setDrawError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | GENERATE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!generated || !data) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    let cancelled = false;

    async function generate() {
      try {
        setDrawing(true);
        setDrawError("");

        await drawCard(
          canvas,
          data
        );

        if (cancelled) {
          return;
        }
      } catch (error) {
        console.error(
          "ID card generation failed:",
          error
        );

        if (!cancelled) {
          setDrawError(
            "Unable to generate the ID card. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setDrawing(false);
        }
      }
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, [
    generated,
    data,
    animKey,
  ]);

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD
  |--------------------------------------------------------------------------
  */

  const handleDownload = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const name =
      data?.name
        ?.trim()
        .replace(/\s+/g, "-")
        .toLowerCase() ||
      "player";

    const link =
      document.createElement("a");

    link.download =
      `player-id-${name}.png`;

    link.href =
      canvas.toDataURL(
        "image/png"
      );

    link.click();
  };

  /*
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  if (!generated) {
    return (
      <div className="idc-empty-state">
        <span className="idc-empty-icon">
          🪪
        </span>

        <p className="idc-empty-text">
          Fill out the form and click
          <br />

          <strong>
            Generate ID Card
          </strong>

          <br />

          to preview and download
          your card.
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PREVIEW
  |--------------------------------------------------------------------------
  */

  return (
    <div
      key={animKey}
      className="idc-card-appear"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      {drawError && (
        <div
          className="idc-error"
          role="alert"
        >
          {drawError}
        </div>
      )}

      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          boxShadow:
            "0 12px 48px rgba(0,0,0,0.28)",
          lineHeight: 0,
          background: "#fff",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "320px",
            height: "auto",
            maxWidth: "100%",
          }}
        />
      </div>

      {drawing && (
        <p
          style={{
            color: "#888",
            fontSize: 13,
          }}
        >
          Filling ID card template…
        </p>
      )}

      {!drawing && !drawError && (
        <button
          className="idc-download-btn"
          id="download-id-card-btn"
          onClick={handleDownload}
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            width="18"
            height="18"
          >
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>

          Download ID Card (PNG)
        </button>
      )}
    </div>
  );
}