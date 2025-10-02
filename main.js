document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section-fade-in");

  const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of the item must be visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
});
