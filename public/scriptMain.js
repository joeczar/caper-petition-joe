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
})();
