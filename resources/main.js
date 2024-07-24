function responsiveNavColor(scrollPosition) {
    const nav = document.querySelector('nav'); // Select the navigation element
    const logo = document.getElementById('nav-logo'); // Select the img in first div
    const menu = document.getElementById('nav-menu');

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY; // Get the current scroll position
  
      if (scrolled >= scrollPosition) {
        nav.classList.add('scrolled'); // Add a class for styling changes
        logo.src = './resources/images/blue logo.png';
        menu.src = './resources/images/menu-blue.png';
      } else {
        nav.classList.remove('scrolled'); // Remove the class if scrolled up
        logo.src = './resources/images/gray logo.png';
        menu.src = './resources/images/menu-gray.png';
      }
    });
}

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

function handleCarousel() {
    const softwareList = document.getElementById('software').querySelector('ul');
    const carouselItems = softwareList.querySelectorAll('li');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const itemsLenght = carouselItems.length;
  
    // Calculate itemsDisplayed based on screen width
    let itemsDisplayed;
    const screenWidth = window.innerWidth;
    switch (true) {
        case screenWidth > 1120:
            itemsDisplayed = 6;
        break;
        case screenWidth > 930:
            itemsDisplayed = 5;
        break;
        case screenWidth > 770:
            itemsDisplayed = 4;
        break;
        case screenWidth > 599:
            itemsDisplayed = 3;
        break;
        case screenWidth > 444:
            itemsDisplayed = 2;
        break;
        default:
            itemsDisplayed = 1;
    }
  
    let currentPage = 0;
  
    function updateClasses() {
      const firstIndex = currentPage * itemsDisplayed;
      const lastIndex = Math.min(firstIndex + itemsDisplayed, itemsLenght); // Ensure lastIndex doesn't exceed items
      carouselItems.forEach(item => item.classList.add('inactive'));
  
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
      carouselItems.forEach(item => item.classList.remove('active', 'inactive'));
      updateClasses();
    });
  
    // Add resize event listener
    window.addEventListener('resize', () => {
      handleCarousel(); // Call the function again on resize
    });
  }
  
  handleCarousel();

const tabOptions = document.querySelectorAll('.tab-item');
const tabContent = document.querySelectorAll('.tab-item-content');

tabOptions.forEach(option => {
  option.addEventListener('click', () => {
    const tabId = option.dataset.tab;
    const content = document.getElementById(tabId);

    // Remove active classes from all buttons and content sections
    tabOptions.forEach(option => option.classList.remove('active'));
    tabContent.forEach(content => content.classList.remove('active'));

    // Add active classes to the clicked button and its content
    option.classList.add('active');
    content.classList.add('active');
  });
});

const links = document.querySelectorAll('a'); // Select all anchor tags

links.forEach(link => {
  link.addEventListener('click', function(event) {
    if (!this.hash) return; // Exit if the link doesn't have a hash

    event.preventDefault(); // Prevent default anchor tag behavior
    const targetSection = document.getElementById(this.hash.substring(1));
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start', // Scroll to the top of the section
      duration: 1000
    });
  });
});

const imageElements = document.querySelectorAll('[data-color]');

imageElements.forEach(image => {
  const originalSrc = image.src; // Store original source

  image.addEventListener('mouseover', () => {
    const colorSrc = image.dataset.color;
    if (colorSrc) {
      image.src = colorSrc;
    }
  });

  image.addEventListener('mouseout', () => {
    image.src = originalSrc; // Revert to original source on mouseout
  });
});

const hardSkillItems = document.querySelectorAll('.hard-skill-item');

hardSkillItems.forEach(item => {
  const image = item.querySelector('img');
  const originalSrc = image.src;
  const paragraph = item.querySelector('p');

  item.addEventListener('mouseover', () => {
    const colorSrc = image.dataset.color;
    if (colorSrc) {
      image.src = colorSrc;
    }
    paragraph.style.color = '#DAA520'; // Change paragraph color on hover
  });

  item.addEventListener('mouseout', () => {
    image.src = originalSrc;
    paragraph.style.color = '#002366'; // Revert paragraph color on mouseout
  });
});

const softSkillItems = document.querySelectorAll('#soft .items li');

softSkillItems.forEach(item => {
    const image = item.querySelector('img');
    const originalSrc = image.src;
    const paragraph = item.querySelector('span + p'); // Get paragraph after span

    item.addEventListener('mouseover', () => {
      const colorSrc = image.dataset.color;
      if (colorSrc) {
        image.src = colorSrc;
      }
      paragraph.style.color = '#D3D3D3'; // Change paragraph color on hover
    });

    item.addEventListener('mouseout', () => {
      image.src = originalSrc;
      paragraph.style.color = '#DAA520'; // Reset paragraph color (inherits default)
    });
});

const knowHowElement = document.getElementById('know-how');
const knowHowText = knowHowElement.querySelector('p');
const knowHowImage = knowHowElement.querySelector('img');

knowHowElement.addEventListener('mouseover', () => {
  knowHowText.style.color = '#DAA520'; // Change text color on hover
  knowHowImage.src = knowHowImage.dataset.color; // Use data-color for image swap
});

knowHowElement.addEventListener('mouseout', () => {
  knowHowText.style.color = '#D3D3D3'; // Reset text color on mouseout
  knowHowImage.src = knowHowImage.src.replace(/\/arrow-gold\.png$/, '/arrow.png'); // Reset image source
});