
(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- KPI count-up ---------- */
  const kpiNumbers = document.querySelectorAll(".kpi .num[data-target]");
  function animateCount(el) {
    const target = el.getAttribute("data-target");
    const suffix = el.getAttribute("data-suffix") || "";
    const numericTarget = parseFloat(target);
    const isDecimal = target.includes(".");
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = numericTarget * eased;
      el.textContent = (isDecimal ? value.toFixed(2) : Math.round(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
    } else {
      requestAnimationFrame(tick);
    }
  }
  if (kpiNumbers.length) {
    const kpiObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            kpiObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    kpiNumbers.forEach((el) => kpiObserver.observe(el));
  }

  /* ---------- Formula-bar typing effect ---------- */
  const typedEl = document.querySelector(".formula-bar .typed");
  if (typedEl) {
    const fullText = typedEl.getAttribute("data-text") || typedEl.textContent;
    if (prefersReducedMotion) {
      typedEl.textContent = fullText;
      typedEl.classList.add("done");
    } else {
      typedEl.textContent = "";
      let i = 0;
      function typeChar() {
        if (i <= fullText.length) {
          typedEl.textContent = fullText.slice(0, i);
          i++;
          setTimeout(typeChar, 28);
        } else {
          typedEl.classList.add("done");
        }
      }
      setTimeout(typeChar, 350);
    }
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.removeAttribute("aria-current"));
            const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (match) match.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
