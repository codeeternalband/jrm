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
    pageViews.forEach(view => view.classList.remove("is-active"));
    navLinks.forEach(link => link.classList.remove("is-active"));

    const targetView = document.querySelector(`.page-view[data-view="${viewName}"]`);
    if (targetView) {
      targetView.classList.add("is-active");
    }

    const targetLink = document.querySelector(`.nav-links a[data-view-link="${viewName}"]`);
    if (targetLink) {
      targetLink.classList.add("is-active");
    }

    if (primaryNav) primaryNav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  const currentHash = window.location.hash.replace("#", "");
  if (currentHash) {
    switchView(currentHash);
  }

  // 3. YOUTUBE-VIDEOT: PIKKUKUVAT JA SOITTO
  const videoLaunchButtons = document.querySelectorAll(".video-launch");
  
  videoLaunchButtons.forEach(button => {
    const videoId = button.getAttribute("data-video-id");
    
    if (videoId) {
      // Haetaan YouTuben virallinen pikkukuva automaattisesti taustakuvaksi
      button.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`;
      
      // Tehdään klikkaustoiminto, joka lataa videon suoraan sivulle
      button.addEventListener("click", function() {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1`);
        iframe.setAttribute("title", button.getAttribute("data-video-title") || "YouTube video");
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("allowfullscreen", "true");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "14px";
        
        // Korvataan musta nappi upotetulla videolla
        this.parentNode.replaceChild(iframe, this);
      });
    }
  });

  // 4. IÄN AUTOMAATTINEN LASKENTA
  const currentAgeSpan = document.getElementById("currentAge");
  if (currentAgeSpan) {
    const birthDate = new Date(2006, 5, 29);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    currentAgeSpan.textContent = age;
  }

  // 5. FOOTERIN VUOSILUKU
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 6. DYYNAAMISET YHTEYSTIEDOT
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
