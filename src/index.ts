import { initAllScroll } from './ts/scroll-effects';
import { displayProjects } from './ts/threejs';
import { transitionStart } from './ts/transition';

console.log(1);

document.addEventListener('DOMContentLoaded', () => {
    initAllScroll()
    transitionStart()
    displayProjects()
})
