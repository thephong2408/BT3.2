let xPos = 0;
let isDragging = false;
let startX = 0;
let rotationY = 180;
let requestId = null;

const cardImages = document.querySelectorAll(".container__images .img");

function fetchDogApi() {
  fetch("https://dog.ceo/api/breeds/image/random/12")
    .then((response) => response.json())
    .then((data) => {
      const img = data.message;

      img.forEach((image, index) => {
        cardImages[index].style.backgroundImage = `url(${image})`;
      });

      init();
    })
    .catch((error) => console.error("Error fetching images:", error));
}

function init() {
  const container__images = document.querySelector(".container__images");
  container__images.style.transition = "transform 0.1s linear";
  container__images.style.transform = `rotateY(${rotationY}deg)`;

  cardImages.forEach((img, i) => {
    img.style.transform = `rotateY(${i * -30}deg) translateZ(-600px)`;
    img.style.transition = "opacity 0.5s";
    img.style.opacity = "1";
  });

  addHoverEffects();
}

function addHoverEffects() {
  cardImages.forEach((img) => {
    img.addEventListener("mouseenter", (e) => {
      cardImages.forEach((t) => {
        if (t === e.currentTarget) {
          t.style.opacity = "1";
        } else {
          t.style.opacity = "0.25";
        }
      });
    });
    img.addEventListener("mouseleave", () => {
      cardImages.forEach((t) => (t.style.opacity = "1"));
    });
  });
}

function dragStart(e) {
  isDragging = true;
  xPos = e.clientX || e.touches[0].clientX;
  startX = xPos;
  document.querySelector(".container__images").style.cursor = "grabbing";
  e.preventDefault();
}

function drag(e) {
  if (!isDragging) return;

  const clientX = e.clientX || e.touches[0].clientX;
  const deltaX = clientX - xPos;
  xPos = clientX;

  rotationY -= deltaX * 0.2; // Adjust sensitivity here

  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  requestId = requestAnimationFrame(() => {
    const container__images = document.querySelector(".container__images");
    container__images.style.transform = `rotateY(${rotationY}deg)`;
  });

  e.preventDefault();
}

function dragEnd(e) {
  isDragging = false;
  document.querySelector(".container__images").style.cursor = "grab";

  if (requestId) {
    cancelAnimationFrame(requestId);
    requestId = null;
  }

  e.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchDogApi();
  const container__images = document.querySelector(".container__images");
  container__images.addEventListener("mousedown", dragStart);
  container__images.addEventListener("mousemove", drag);
  container__images.addEventListener("mouseup", dragEnd);
  container__images.addEventListener("touchstart", dragStart);
  container__images.addEventListener("touchmove", drag);
  container__images.addEventListener("touchend", dragEnd);
});
