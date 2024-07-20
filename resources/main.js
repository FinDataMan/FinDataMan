function responsiveNavColor(scrollPosition) {
    const nav = document.querySelector('nav'); // Select the navigation element
    const logo = document.getElementById('logo'); // Select the img in first div

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY; // Get the current scroll position
  
      if (scrolled >= scrollPosition) {
        nav.classList.add('scrolled'); // Add a class for styling changes
        logo.src = './resources/images/blue logo.png';
      } else {
        nav.classList.remove('scrolled'); // Remove the class if scrolled up
        logo.src = './resources/images/gray logo.png';
      }
    });
}

//Change image and nav a color when scrolled 100 pixels down
responsiveNavColor(850);

const experienceRows = document.querySelectorAll('.experience-row');

experienceRows.forEach(row => {
  const textContainer = row.querySelector('.text-container');
  const logoContainer = row.querySelector('.logo-container');

  row.addEventListener('mouseover', () => {
    textContainer.style.transition = 'opacity 1s ease-in-out';  // Add transition
    textContainer.style.display = 'block';
    textContainer.style.opacity = 1;
  });

  row.addEventListener('mouseout', () => {
    textContainer.style.transition = 'opacity 1s ease-in-out';  // Keep transition
    textContainer.style.display = 'none';
    textContainer.style.opacity = 0;
  });

  // Toggle centered class on click (optional)
  row.addEventListener('click', () => {
    row.classList.toggle('centered');
  });
});