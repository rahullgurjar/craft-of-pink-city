const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const cartCount = document.querySelector('#cart-count');
const toast = document.querySelector('#toast');
let cart = 0;
let toastTimer;

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.add').forEach((button) => button.addEventListener('click', () => {
  cart += 1;
  cartCount.textContent = cart;
  const product = button.dataset.product;
  toast.textContent = `${product} added to your bag`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}));

document.querySelectorAll('.wish').forEach((button) => button.addEventListener('click', () => {
  const saved = button.classList.toggle('saved');
  button.textContent = saved ? '♥' : '♡';
  button.setAttribute('aria-pressed', saved);
}));

document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('#form-message');
  message.textContent = 'Thank you — you are on the studio list.';
  event.currentTarget.reset();
});
