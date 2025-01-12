function smoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function goToTop() {
    const topButton = document.getElementById('topButton');

    if(topButton) {
        topButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
    };
}

function initAllScroll() {
    smoothAnchor()
    goToTop()
}

export { initAllScroll }