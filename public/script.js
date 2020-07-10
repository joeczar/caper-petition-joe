(function () {
    console.log($);

    const canvas = document.querySelector('#canvas');
    const sigInput = document.querySelector('#signInput');
    const first = document.querySelector('#first');

    const ctx = canvas.getContext('2d');

    let isDrawing = false;
    let x = 0;
    let y = 0;

    canvas.addEventListener(
        'mousedown',
        (e) => {
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;
        },
        false
    );
    canvas.addEventListener(
        'mousemove',
        (e) => {
            if (isDrawing === true) {
                drawLine(ctx, x, y, e.offsetX, e.offsetY);
                x = e.offsetX;
                y = e.offsetY;
            }
        },
        false
    );
    canvas.addEventListener(
        'mouseup',
        (e) => {
            if (isDrawing === true) {
                drawLine(ctx, x, y, e.offsetX, e.offsetY);
                x = 0;
                y = 0;
                isDrawing = false;
                const data = canvas.toDataURL();
                sigInput.value = data;
                console.log(sigInput, $('#last'));
            }
        },
        false
    );

    function drawLine(context, x1, y1, x2, y2) {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }
})();
