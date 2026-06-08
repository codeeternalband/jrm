document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const primaryNav = document.getElementById("primaryNav");
  const navLinks = document.querySelectorAll(".nav-links a");
  const pageViews = document.querySelectorAll(".page-view");

  // 1. MOBIILIVALIKON TOIMINTA
  if (menuBtn && primaryNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = primaryNav.classList.contains("open");
      if (isOpen) {
        primaryNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      } else {
        primaryNav.classList.add("open");
        menuBtn.setAttribute("aria-expanded", "true");
      }
    });
  }

  // 2. SIVUJEN VAIHTAMINEN (NAVIGOINTI)
  function switchView(viewName) {
    // Piilotetaan kaikki sivut ja poistetaan aktiivisuus linkeistä
    pageViews.forEach(view => view.classList.remove("is-active"));
    navLinks.forEach(link => link.classList.remove("is-active"));

    // Näytetään klikattu sivu
    const targetView = document.querySelector(`.page-view[data-view="${viewName}"]`);
    if (targetView) {
      targetView.classList.add("is-active");
    }

    // Merkitään klikattu linkki aktiiviseksi
    const targetLink = document.querySelector(`.nav-links a[data-view-link="${viewName}"]`);
    if (targetLink) {
      targetLink.classList.add("is-active");
    }

    // Suljetaan mobiilivalikko sivunvaihdon jälkeen
    if (primaryNav) primaryNav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

    // Kelataan sivu ylös
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Kuunnellaan valikon linkkien klikkauksia
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const viewName = link.getAttribute("data-view-link");
      if (viewName) {
        e.preventDefault();
        switchView(viewName);
        window.location.hash = viewName;
      }
    });
  });

  // Tarkistetaan osoiterivin #hash sivun latautuessa (esim. jos joku menee suoraan osoitteeseen #biography)
  const currentHash = window.location.hash.replace("#", "");
  if (currentHash) {
    switchView(currentHash);
  }

  // 3. IÄN AUTOMAATTINEN LASKENTA (Syntymäpäivä 29.6.2006)
  const currentAgeSpan = document.getElementById("currentAge");
  if (currentAgeSpan) {
    const birthDate = new Date(2006, 5, 29); // Huom: kuukaudet alkavat nollasta (5 = kesäkuu)
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    currentAgeSpan.textContent = age;
  }

  // 4. FOOTERIN VUOSILUKU
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 5. YHTEYSTIEDOT (Sähköpostien dynaaminen lisäys suojauksen vuoksi)
  const emailSpans = document.querySelectorAll(".js-contact-email");
  emailSpans.forEach(span => {
    span.textContent = "jrmguitarofficial@gmail.com";
  });

  const emailLinks = document.querySelectorAll(".js-contact-email-link");
  emailLinks.forEach(link => {
    link.textContent = "jrmguitarofficial@gmail.com";
    link.href = "mailto:jrmguitarofficial@gmail.com";
  });
});
