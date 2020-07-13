(function () {
    const subtext = document.querySelector('#subTextWrapper');
    const subMove = document.querySelector('#subMove');
    let subMoveHeight = subMove.offsetTop;
    const exclamations = subtext.getElementsByClassName('subs');
    const subHeight = exclamations[0].offsetHeight;
    let step;
    // subMove.style.top = `-${subMoveHeight}`;

    function moveDown() {
        subMoveHeight++;

        const subBottom = subMove.offsetTop + subMove.offsetHeight;
        subMove.style.top = subMoveHeight + 'px';
        if (subBottom % subHeight === 0) {
            cancelAnimationFrame(step);
            setTimeout(() => {
                subMoveHeight++;
                if (subBottom >= subHeight * 3) {
                    subMove.appendChild(exclamations[0]);
                    subMoveHeight -= subHeight * 2;
                    subMove.style.top = subMoveHeight + 'px';
                }
                window.requestAnimationFrame(moveDown);
            }, 2000);
            return;
        }
        step = window.requestAnimationFrame(moveDown);
    }
    step = window.requestAnimationFrame(moveDown);

    // smooth scroll on home slides
    $(document).ready(function () {
        // Add smooth scrolling to all links
        $('a').on('click', function (event) {
            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== '') {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                $('html, body').animate(
                    {
                        scrollTop: $(hash).offset().top,
                    },
                    800,
                    function () {
                        window.location.hash = hash;
                    }
                );
            }
        });
    });
})();
