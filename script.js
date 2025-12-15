
    const backToTopLink = document.getElementById('back-to-top');

    backToTopLink.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  

  
    const themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
    });
  

  
  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear();



  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (otherLink) {
        otherLink.classList.remove('active');
      });
      link.classList.add('active');
    });
  });



  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formError = document.getElementById('form-error');

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      formError.style.display = 'block';
      return;
    }

    formError.style.display = 'none';
    alert('Thanks for your message! I\'ll get in touch soon :)');
    contactForm.reset();
  });



  const projectNames = [
    'Number Guessing Game',
    'Notes App',
    'Expense Tracker'
  ];

  projectNames.forEach(function (project) {
    console.log('Project:', project);
  });

  const projectsList = document.getElementById('projects-list');

function renderProjects() {
  projectsList.innerHTML = '';

  for (let i = 0; i < projectNames.length; i++) {
    const li = document.createElement('li');
    li.textContent = projectNames[i];
    projectsList.appendChild(li);
  }
}

renderProjects();
