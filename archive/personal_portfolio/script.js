// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Select the nav element
const nav = document.querySelector("nav");

// Add an event listener to the nav element to toggle the menu when the menu icon is clicked
nav.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Select the work items
const workItems = document.querySelectorAll(".work-item");

// Add an event listener to each work item to toggle the description when the work item is clicked
workItems.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show-description");
  });
});
