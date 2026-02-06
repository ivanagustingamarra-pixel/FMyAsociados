(function () {
  const numArgentina = "5491134618549";
  const numUruguay = "59898497662";
  const numeroPorDefecto = numUruguay;
  const mensajeBase = "Hola! Me contacto desde la web de FM & Asociados.";

  let paisDetectado = null;
  

  async function detectarPais() {
    try {
      const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
        signal: AbortSignal.timeout(3000),
      });
      const data = await response.text();
      const loc = data.split("\n").find((line) => line.startsWith("loc="));
      return loc ? loc.split("=")[1].toUpperCase() : "OTHER";
    } catch (e) {
      return "OTHER";
    }
  }

  detectarPais().then((codigo) => {
    paisDetectado = codigo;
  });

  const getWhatsAppURL = () => {
    let numFinal =
      paisDetectado === "AR"
        ? numArgentina
        : paisDetectado === "UY"
          ? numUruguay
          : numeroPorDefecto;
    return `https://wa.me/${numFinal}?text=${encodeURIComponent(mensajeBase)}`;
  };

  const mainVideo = document.getElementById("mainVideo");
  let videoStarted = false;

  const startMainVideo = () => {
    if (!videoStarted && mainVideo) {
      mainVideo.muted = false;
      mainVideo
        .play()
        .then(() => {
          videoStarted = true;
          ["click", "touchstart", "scroll"].forEach((ev) =>
            window.removeEventListener(ev, startMainVideo),
          );
        })
        .catch(() => {
          mainVideo.muted = true;
          mainVideo.play();
        });
    }
  };

  ["click", "touchstart", "scroll"].forEach((ev) =>
    window.addEventListener(ev, startMainVideo),
  );

  document.addEventListener("click", function (e) {
    const waLink = e.target.closest(".wa-link");
    if (waLink) {
      e.preventDefault();
      window.open(getWhatsAppURL(), "_blank");
      return;
    }

    const navLink = e.target.closest("nav a");
    if (navLink) {
      e.preventDefault();
      const href = navLink.getAttribute("href");

      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const header = document.getElementById("main-header");
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;

          const isMobile = window.innerWidth < 768;

          window.scrollTo({
            top: isMobile ? targetPosition - headerHeight : targetPosition,
            behavior: "smooth",
          });
        }
      }
    }

    const video = e.target.closest(".card-vid");
    if (video && !video.classList.contains("featured-vid")) {
      document.querySelectorAll(".card-vid").forEach((v) => {
        if (v !== video && !v.classList.contains("featured-vid")) v.pause();
      });
    }
  });

  document.querySelectorAll(".card-vid").forEach((v) => {
    v.addEventListener("play", function () {
      if (!v.classList.contains("featured-vid")) {
        document.querySelectorAll(".card-vid").forEach((ov) => {
          if (ov !== v && !ov.classList.contains("featured-vid")) ov.pause();
        });
      }
    });
  });
  // end existing handlers

  // Carousel control: play only the active slide's video
  (function () {
    const radios = document.querySelectorAll('input[name="carousel"]');

    function videos() {
      return Array.from(document.querySelectorAll('.carousel .slides .slide video'));
    }

    function update() {
      const vids = videos();
      const idx = Array.from(radios).findIndex((r) => r.checked);
      vids.forEach((v, i) => {
        try {
          if (i === idx) {
            v.play().catch(() => {});
          } else {
            v.pause();
            v.currentTime = 0;
          }
        } catch (e) {
          /* ignore errors */
        }
      });
    }

    radios.forEach((r) => r.addEventListener('change', update));
    window.addEventListener('load', update);
    document.addEventListener('visibilitychange', update);
    setTimeout(update, 250);
  })();

})();

