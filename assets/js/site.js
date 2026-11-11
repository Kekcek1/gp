(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Шапка ---------- */
  const header = document.querySelector("[data-header]");
  if (header) {
    const setHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    setHeader();
    window.addEventListener("scroll", setHeader, { passive: true });
  }

  /* ---------- Год в подвале ---------- */
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- Появление блоков ---------- */
  const revealNodes = [...document.querySelectorAll("[data-reveal]")];
  if (revealNodes.length && "IntersectionObserver" in window && !reduceMotion) {
    document.body.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );
    revealNodes.forEach((node) => observer.observe(node));
  }

  /* ---------- Фильтр каталога ---------- */
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const gameCards = [...document.querySelectorAll("[data-genre]")];
  const resultCount = document.querySelector("[data-result-count]");

  if (filterButtons.length && gameCards.length) {
    const plural = (n) => {
      const n10 = n % 10;
      const n100 = n % 100;
      if (n10 === 1 && n100 !== 11) return "игра";
      if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return "игры";
      return "игр";
    };

    const apply = (filter) => {
      let visible = 0;

      filterButtons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      gameCards.forEach((card) => {
        const show = filter === "all" || card.dataset.genre === filter;
        card.classList.toggle("is-hidden", !show);
        card.classList.remove("is-filtering");
        if (!show) return;

        visible += 1;
        /* Даём браузеру пересчитать сетку и запускаем мягкое появление. */
        void card.offsetWidth;
        card.classList.add("is-filtering");
      });

      if (resultCount) {
        resultCount.textContent = `${visible} ${plural(visible)}`;
      }
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filter || "all"));
    });

    const initial = filterButtons.find((button) => button.classList.contains("is-active"));
    apply(initial ? initial.dataset.filter : "all");
  }

  /* ---------- Звёздное поле ---------- */
  const canvas = document.getElementById("stars");
  if (!canvas || reduceMotion) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let frame = 0;

  const random = (min, max) => min + Math.random() * (max - min);

  const buildStars = () => {
    const density = Math.round((width * height) / 22000);
    const count = Math.max(45, Math.min(120, density));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: random(0.35, 1.35),
      alpha: random(0.18, 0.68),
      phase: random(0, Math.PI * 2),
      speed: random(0.006, 0.028),
    }));
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildStars();
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);

    for (const star of stars) {
      const twinkle = 0.62 + 0.38 * Math.sin(time * 0.00065 + star.phase);
      const alpha = Math.min(0.85, star.alpha * twinkle);

      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(205, 220, 255, ${alpha})`;
      context.fill();

      star.y -= star.speed;
      if (star.y < -2) {
        star.y = height + 2;
        star.x = Math.random() * width;
      }
    }

    frame = window.requestAnimationFrame(draw);
  };

  const start = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(draw);
  };

  const stop = () => {
    if (!frame) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 140);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  start();
})();
