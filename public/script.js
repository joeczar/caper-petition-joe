(function () {
    const canvas = document.querySelector('#canvas');
    const sigInput = document.querySelector('#signInput');
    const first = document.querySelector('#first');
    const last = document.querySelector('#last');
    const submit = document.querySelector('#btnSubmit');
    const ctx = canvas.getContext('2d');
    const fields = [first, last, sigInput];
    let isDrawing = false;
    let x = 0;
    let y = 0;
    const regex = /^[A-Za-zöÖüÜäÄ]+$/;
    canvas.addEventListener(
        'mousedown',
        (e) => {
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;
            canvas.classList.remove('alert');
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
            }
        },
        false
    );
    submit.addEventListener('click', (e) => {
        e.preventDefault();

        if (fields.some((el) => el.value === '')) {
            window.alert('Please fill out all fields');
            fields.forEach((el) => {
                if (el.value === '') {
                    el.classList.add('alert');
                }
            });
            if (isCanvasBlank(canvas)) {
                canvas.classList.add('alert');
            }
        } else {
            document.querySelector('#petitionForm').submit();
            sigInput.value = '';
        }
    });
    fields.forEach((el) => {
        el.addEventListener('input', (e) => {
            let val = el.value;
            // console.log(e);
            if (
                !regex.test(val) &&
                el.inputType !== 'deleteContentBackward' &&
                val !== ''
            ) {
                window.alert('Names cannot contain numbers or symbols');
            }

            el.classList.remove('alert');
        });
    });
    function isCanvasBlank(canvas) {
        const blank = document.createElement('canvas');

        blank.width = canvas.width;
        blank.height = canvas.height;

        return canvas.toDataURL() === blank.toDataURL();
    }
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
