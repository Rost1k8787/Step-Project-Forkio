/* Burger */
const burger = document.querySelector('.header__burger')
const nav = document.querySelector('.header__nav')
const body = document.querySelector('body')

document.addEventListener('click', (e) => {
    if (
        e.target.closest('.header__burger') ||
        (!e.target.closest('.header__nav') &&
            !e.target.closest('.header__navbar-wrapper') &&
            body.classList.contains('lock'))
    ) {
        burger.classList.toggle('active')
        nav.classList.toggle('visible')
        body.classList.toggle('lock')
    }
})
