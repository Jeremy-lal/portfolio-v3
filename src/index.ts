import { initAllScroll } from './ts/scroll-effects';
import { displayProjects } from './ts/threejs';
import { transitionStart } from './ts/transition';

document.addEventListener('DOMContentLoaded', () => {
    initAllScroll()
    transitionStart()
    displayProjects()
})
