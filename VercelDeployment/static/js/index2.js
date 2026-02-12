/* index2.js - HNDRX.ORG home page interactions */

// Sites data
const sites = [
  {
    title: 'Anonymity',
    description: 'Protecting users online through privacy tools, tips, and ethos for digital security.',
    link: './anonymity.html'
  },
  {
    title: 'Uma Musume',
    description: 'Explore the world of Uma Musume Pretty Derby with character guides and tier lists.',
    link: './uma-musume.html'
  },
  {
    title: 'Uma Timeline',
    description: 'Track upcoming Uma Musume character releases and banner timelines.',
    link: './uma-musume-timeline/uma-musume-timeline.html'
  },
  {
    title: 'Gura Gallery',
    description: 'A dedicated gallery showcasing artwork and content for Gura.',
    link: './gura-gallery.html'
  },
  {
    title: 'VTubers Wiki',
    description: 'A comprehensive wiki dedicated to VTubers and virtual content creators.',
    link: './vtubers-wiki.html'
  },
  {
    title: 'AIL Portfolio',
    description: 'Portfolio showcasing various projects and creative works.',
    link: './ail-portfolio/home-portfolio.html'
  },
  {
    title: 'Blue Archive',
    description: 'Blue Archive game guides, tier lists, and character information.',
    link: './blue-archive/blue-archive-tierlist.html'
  },
  {
    title: 'Wuthering Waves',
    description: 'Wuthering Waves game content, guides, and resources.',
    link: './wuthering-waves/index.html'
  },
  {
    title: 'Projects',
    description: 'Browse all creative projects and experimental work.',
    link: './projects.html'
  },
  {
    title: 'Blog',
    description: 'Articles, thoughts, and updates from HNDRX.ORG.',
    link: './posts.html'
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const exploreBtn = document.getElementById('explore-btn');
  const backBtn = document.getElementById('back-btn');
  const hero = document.getElementById('hero');
  const sitesSection = document.getElementById('sites-section');
  const sitesGrid = document.getElementById('sites-grid');
  const titleEl = document.querySelector('.title');

  // Populate sites grid
  function populateSitesGrid() {
    sitesGrid.innerHTML = '';
    sites.forEach(site => {
      const card = document.createElement('div');
      card.className = 'site-card';
      card.innerHTML = `
        <h3>${site.title}</h3>
        <p>${site.description}</p>
        <a href="${site.link}">${site.title}</a>
      `;
      sitesGrid.appendChild(card);
    });
  }

  // Explore button click (guarded in case button is not present)
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
      hero.style.display = 'none';
      sitesSection.classList.add('active');
      populateSitesGrid();
      window.scrollTo(0, 0);
    });
  }

  // Back button click
  backBtn.addEventListener('click', function() {
    sitesSection.classList.remove('active');
    hero.style.display = 'grid';
    window.scrollTo(0, 0);
  });

  console.log('HNDRX.ORG loaded');
  
  // Title font cycler: fades out, swaps font-family, then fades in every 1.5s
  if (titleEl) {
    const fonts = [
      "'Oswald', sans-serif",
      "'Segoe UI', Tahoma, Geneva, sans-serif",
      "Georgia, 'Times New Roman', Times, serif",
      "'Courier New', Courier, monospace",
      "'Trebuchet MS', Arial, sans-serif",
      "Impact, 'Arial Black', sans-serif"
    ];
    let fontIndex = 0;

    // Ensure initial font-family is first in the list if possible
    titleEl.style.fontFamily = fonts[0];
    titleEl.style.opacity = '1';

    setInterval(() => {
      // Fade out
      titleEl.style.opacity = '0';
      // After fade duration (~350ms) change font and fade back in
      setTimeout(() => {
        fontIndex = (fontIndex + 1) % fonts.length;
        titleEl.style.fontFamily = fonts[fontIndex];
        titleEl.style.opacity = '1';
      }, 350);
    }, 1500);
  }
});

// Optional: Handle viewport height for mobile
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

window.addEventListener('resize', setVH);
setVH();
