import gsap from 'gsap';

function transitionStart() {
    gsap.to(".transition div", {
        y: "-100%", duration: 0.6, delay: 1, stagger: 0.2, onComplete() {
            gsap.to('.transition div', { display: 'none' })
        }
    });

    setTimeout(() => {
        document.querySelector('body').style.overflow = "visible"
    }, 2000);
}

export { transitionStart }