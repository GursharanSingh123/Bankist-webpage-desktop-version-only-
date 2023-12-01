'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//smooth scrolling
const buttonScrolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// const sec = section1.getBoundingClientRect();

buttonScrolTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' }); //new method use this<------------->
});

const baseNavLinks = document.querySelector('.nav__links');
baseNavLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    // console.log(e.target);
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// tabbed component
const tabContainer = document.querySelector('.operations__tab-container');
// console.log(tabContainer);
tabContainer.addEventListener('click', function (e) {
  const targ = e.target.closest('.operations__tab');
  // console.log(targ);
  if (!targ.classList.contains('operations__tab')) return;
  // console.log(targ);
  const tabNum = targ.getAttribute('data-tab');
  // console.log(tabNum);
  tabContainer
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');
  tabContainer
    .querySelector(`.operations__tab--${tabNum}`)
    .classList.add('operations__tab--active');
  document
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');
  document
    .querySelector(`.operations__content--${tabNum}`)
    .classList.add('operations__content--active');
});

// navigation bar fading
function linkHoverOpacity(e) {
  const targ = e.target;
  if (targ.classList.contains('nav__link')) {
    const link = targ.closest('.nav').querySelectorAll('.nav__link');
    link.forEach(el => {
      if (el !== targ) el.style.opacity = this;
    });
  }
}
const navBar = document.querySelector('.nav');

navBar.addEventListener('mouseover', linkHoverOpacity.bind(0.3));
navBar.addEventListener('mouseout', linkHoverOpacity.bind(1));

// ------------navbar sticky
const header = document.querySelector('.header');
const height = navBar.getBoundingClientRect().height;

const obsOpt = {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
};
function obsFn(entries, obs) {
  const [entry] = entries;
  if (!entry.isIntersecting) navBar.classList.add('sticky');
  else navBar.classList.remove('sticky');
}
const obs = new IntersectionObserver(obsFn, obsOpt);

obs.observe(header);

//------------reveal elements on scroll

const sections = document.querySelectorAll('section');

const elemRevealobj = {
  root: null,
  threshold: 0.15,
};

function elemrevealFn(entries, elemReveal) {
  const [entry] = entries;

  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  elemReveal.unobserve(entry.target);
}

const elemReveal = new IntersectionObserver(elemrevealFn, elemRevealobj);
sections.forEach(sec => {
  elemReveal.observe(sec);
  sec.classList.add('section--hidden');
});

// ---------lazy loading
const lazyPic = document.querySelectorAll('img[data-src]');
const picHeight = lazyPic[0].getBoundingClientRect().height;

const lazyObj = {
  root: null,
  threshold: 0.35,
  rootMargin: `-${picHeight / 2}px`,
};
function lazyFn(entries, lazyImg) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  lazyImg.unobserve(entry.target);
}
const lazyImg = new IntersectionObserver(lazyFn, lazyObj);
lazyPic.forEach(pic => lazyImg.observe(pic));

// --------------------slider component
function slider() {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const SlidesTotalCount = slides.length;
  // ---creating dots
  const dotsContainer = document.querySelector('.dots');
  function dotsCreator() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  let currSlide = 0;
  // slider.style.overflow = 'visible';
  slides.forEach((sl, i) => {
    sl.style.transform = `translateX(${i * 100}%)`;
  });
  function moveSlides(slides) {
    slides.forEach(
      (sl, i) =>
        (sl.style.transform = `translateX(${i * 100 - currSlide * 100}%)`)
    );
  }
  function prevSlide() {
    if (currSlide === 0) currSlide = SlidesTotalCount;
    currSlide--;
    moveSlides(slides);
    activateDots(currSlide);
  }
  function nextSlide() {
    currSlide++;
    if (currSlide >= SlidesTotalCount) currSlide = 0;
    moveSlides(slides);
    activateDots(currSlide);
  }
  function activateDots(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }
  function init() {
    dotsCreator();
    activateDots(0);
  }
  init();
  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);

  // key bindings in slider arrows
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    const slideIndx = e.target.getAttribute('data-slide');
    currSlide = slideIndx;
    moveSlides(slides);
    activateDots(currSlide);
  });
}
slider();
