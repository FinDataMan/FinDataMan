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