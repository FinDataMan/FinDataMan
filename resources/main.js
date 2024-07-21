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

function handleCarousel(){

    const softwareList = document.getElementById('software').querySelector('ul');
    const carouselItems = softwareList.querySelectorAll('li');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const itemsLenght = carouselItems.length;
    const itemsDisplayed = 6;
    let currentPage = 0;

    function updateClasses() {

        const firstIndex = currentPage * itemsDisplayed;
        const lastIndex = Math.min(firstIndex + itemsDisplayed, itemsLenght); // Ensure lastIndex doesn't exceed items
        carouselItems.forEach(item => {item.classList.add('inactive')});

        for (let i = firstIndex; i < lastIndex; i++) {
            if (i >= firstIndex && i <= lastIndex) {
                carouselItems[i].classList.remove('inactive');
                carouselItems[i].classList.add('active');
            }
        }
    }

    // Update classes initially
    updateClasses();

    prevButton.addEventListener('click', () => {
        const totalPages = Math.ceil(itemsLenght / itemsDisplayed);
        currentPage = (currentPage - 1 + totalPages) % totalPages; // Handle both negative and exceeding total pages
        // Update classes using the adjusted currentPage
        carouselItems.forEach(item => item.classList.remove('active', 'inactive'));
        updateClasses();
    });
      
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(itemsLenght / itemsDisplayed);
        currentPage = Math.min(currentPage + 1, totalPages) % totalPages; // Handle both negative and exceeding total pages
        carouselItems.forEach(item => item.classList.remove('active','inactive'));
        updateClasses();
    });
}

handleCarousel();