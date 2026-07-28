/* Quadra Web Platform & Hydra Engine Interactive Script */
document.addEventListener("DOMContentLoaded", () => {
  initAudioMatrixCanvas();
  initGoogleAuth();
  initLicenseVerification();
  autoCheckPurchasedSession();
});

// Global Google Credential Handler
window.handleGoogleCredentialResponse = function(response) {
  if (response.credential) {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      if (profile.email) {
        sessionStorage.setItem("quadra_user_email", profile.email);
        const input = document.getElementById("userEmailInput");
        if (input) input.value = profile.email;
        verifyAndActivateLicense(profile.email);
      }
    } catch (e) {
      console.error("Google JWT parse error:", e);
    }
  }
};

function initGoogleAuth() {
  // Global callback registered above for Google SDK
}

// Auto-populate & verify if coming from completed purchase
function autoCheckPurchasedSession() {
  const savedEmail = sessionStorage.getItem("quadra_user_email");
  const urlParams = new URLSearchParams(window.location.search);
  const isPurchased = urlParams.get("purchased") === "true";

  const emailInput = document.getElementById("userEmailInput");
  const statusEl = document.getElementById("authStatusMessage");

  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }

  if (isPurchased && savedEmail) {
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:#30d158;font-weight:600;">Payment Confirmed for ${savedEmail}! Verifying entitlement...</span>`;
    }
    verifyAndActivateLicense(savedEmail);
  }
}

// 1. Interactive Audio Matrix Visualizer Canvas
function initAudioMatrixCanvas() {
  const canvas = document.getElementById("audioMatrixCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;

  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.clientWidth - 48;
    height = canvas.height = 420;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const inputs = ["Logic Pro DAW", "Spotify / iTunes", "OBS Studio", "Zoom Audio", "AES67 Network", "System Mic"];
  const outputs = ["Virtual Out 1/2", "Virtual Out 3/4", "AoIP Broadcast", "Headphones 1", "Hardware Out", "Stream Aux"];

  const connections = [
    { in: 0, out: 0, active: true },
    { in: 0, out: 2, active: true },
    { in: 1, out: 3, active: true },
    { in: 2, out: 2, active: true },
    { in: 3, out: 1, active: true },
    { in: 4, out: 4, active: true },
  ];

  let step = 0;

  function renderMatrix() {
    ctx.clearRect(0, 0, width, height);

    const marginX = 140;
    const marginY = 50;
    const inSpacing = (height - marginY * 2) / (inputs.length - 1);
    const outSpacing = (height - marginY * 2) / (outputs.length - 1);

    // Draw Input Nodes
    inputs.forEach((label, i) => {
      const y = marginY + i * inSpacing;
      ctx.fillStyle = "#ffffff";
      ctx.font = "13px -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(label, 20, y + 4);

      ctx.beginPath();
      ctx.arc(marginX, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#2997ff";
      ctx.fill();
    });

    // Draw Output Nodes
    outputs.forEach((label, j) => {
      const y = marginY + j * outSpacing;
      ctx.fillStyle = "#a1a1a6";
      ctx.font = "13px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, width - 20, y + 4);

      ctx.beginPath();
      ctx.arc(width - marginX, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#9e00ff";
      ctx.fill();
    });

    // Draw Active Connections & Animated Flux Pulses
    connections.forEach((conn) => {
      const startX = marginX;
      const startY = marginY + conn.in * inSpacing;
      const endX = width - marginX;
      const endY = marginY + conn.out * outSpacing;

      const cp1X = startX + (endX - startX) * 0.5;
      const cp1Y = startY;
      const cp2X = startX + (endX - startX) * 0.5;
      const cp2Y = endY;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.strokeStyle = "rgba(41, 151, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const t = ((step * 0.015) + (conn.in * 0.2)) % 1;
      const px = Math.pow(1 - t, 3) * startX + 3 * Math.pow(1 - t, 2) * t * cp1X + 3 * (1 - t) * Math.pow(t, 2) * cp2X + Math.pow(t, 3) * endX;
      const py = Math.pow(1 - t, 3) * startY + 3 * Math.pow(1 - t, 2) * t * cp1Y + 3 * (1 - t) * Math.pow(t, 2) * cp2Y + Math.pow(t, 3) * endY;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#00f2fe";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f2fe";
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    step++;
    requestAnimationFrame(renderMatrix);
  }

  renderMatrix();
}

// 2. License Entitlement Verification & Handoff to hydra://activate
async function verifyAndActivateLicense(email) {
  const statusEl = document.getElementById("authStatusMessage");
  if (statusEl) statusEl.innerHTML = `<span style="color:#2997ff;">Verifying license entitlement for ${email}...</span>`;

  try {
    const res = await fetch("https://api.quadraaudio.com/v1/verify-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, machineID: "MAC-STATION-PRO" })
    });

    const data = await res.json();
    if (res.ok && data.success && data.licensePayload) {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#30d158;font-weight:600;">Licence Entitlement Verified! Launching Hydra App...</span>`;
      }
      setTimeout(() => {
        window.location.href = `hydra://activate?license=${encodeURIComponent(data.licensePayload)}`;
      }, 1200);
    } else {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#ff453a;">${data.message || "No active license found. Please purchase Hydra Pro in the Store."}</span>`;
      }
    }
  } catch (err) {
    console.error("Entitlement error:", err);
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:#ff9f0a;">Network connection issue. Trying evaluation mode...</span>`;
    }
  }
}

function initLicenseVerification() {
  const form = document.getElementById("emailLoginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("userEmailInput");
    if (emailInput && emailInput.value) {
      sessionStorage.setItem("quadra_user_email", emailInput.value);
      verifyAndActivateLicense(emailInput.value);
    }
  });
}
