function init() {
    // var mobile = {
    //     Android: function() {
    //       return navigator.userAgent.match(/Android/i);
    //     },
    //     BlackBerry: function() {
    //       return navigator.userAgent.match(/BlackBerry/i);
    //     },
    //     iOS: function() {
    //       return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    //     },
    //     Opera: function() {
    //       return navigator.userAgent.match(/Opera Mini/i);
    //     },
    //     Windows: function() {
    //       return navigator.userAgent.match(/IEMobile/i);
    //     },
    //     any: function() {
    //       return (mobile.Android() || mobile.BlackBerry() || mobile.iOS() || mobile.Opera() || mobile.Windows());
    //     }
    // };
    // console.log(mobile.any());
    let mouse = {
        click: false,
        move: false,
        pos: { x: 0, y: 0 },
        pos_prev: false
    };
    // Canvas
    const canvas = document.getElementById('drawing');
    const context = canvas.getContext('2d');
    const boton = document.getElementById('limpiar');
    const body = document.body;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    const socket = io();
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        // events body to prevent scrolling in touch inputs
        body.addEventListener("touchstart", function (e) {
            
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, { passive:false });
        body.addEventListener("touchend", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, { passive:false });
        body.addEventListener("touchmove", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, { passive:false });
        // Set up touch events for mobile, etc
        canvas.addEventListener("touchstart", (e) => {
            mouse.click = true;
            console.log('start');
            mouse.pos = { x: 0, y: 0};
            mouse.pos = getTouchPos(canvas, e);
            // var touch = e.touches[0];
            // mouse.pos.x = touch.clientX / width;
            // mouse.pos.y = touch.clientY / height;
            // var mouseEvent = new MouseEvent("mousedown", {
            //     clientX: touch.clientX,
            //     clientY: touch.clientY
            // });
            // canvas.dispatchEvent(mouseEvent);
        });
        canvas.addEventListener("touchend", (e) => {
            mouse.click = false;
            console.log('fin');
            // var mouseEvent = new MouseEvent("mouseup", {});
            // canvas.dispatchEvent(mouseEvent);
        });
        canvas.addEventListener("touchmove", (e) => {
            var touch = e.touches[0];
            // mouse.pos = getTouchPos(canvas, e);
            // var mouseEvent = new MouseEvent("mousemove", {
            //     clientX: touch.clientX,
            //     clientY: touch.clientY
            // });
            mouse.pos.x = touch.clientX / width;
            mouse.pos.y = touch.clientY / height;
            mouse.move = true;
            // console.log(mouse.pos);
            // canvas.dispatchEvent(mouseEvent);
        });
        
        // Get the position of a touch relative to the canvas
        function getTouchPos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX / width,
                y: touchEvent.touches[0].clientY / height
            };
        }

    }
    else {
        console.log('que?');
        // web desktop
        canvas.addEventListener('mousedown', (e) => {
            mouse.click = true;
        });
        canvas.addEventListener('mouseup', (e) => {
            mouse.click = false;
        });
        canvas.addEventListener('mousemove', (e) => {
            mouse.pos.x = e.clientX / width;
            mouse.pos.y = e.clientY / height;
            mouse.move = true;
        });
        // socket.on('draw_line', data => {
        //     let line = data.line;
        //     context.beginPath();
        //     context.lineWidth = 2;
        //     context.moveTo(line[0].x * width, line[0].y * height);
        //     context.lineTo(line[1].x * width, line[1].y * height);
        //     context.stroke();
        // });
        // function mainLoop() {
        //     if(mouse.click && mouse.move && mouse.pos_prev) {
        //         socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev] });
        //         mouse.move = false;
        //     }
        //     mouse.pos_prev = {x: mouse.pos.x , y: mouse.pos.y};
        //     setTimeout(mainLoop, 25);
        // }
        // mainLoop();
        // boton.addEventListener('click', () => {
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        // }, false);
    }
    // draw
    socket.on('draw_line', data => {
        console.log(data);
        let line = data.line;
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });
    function mainLoop() {
        if(mouse.click && mouse.move && mouse.pos_prev) {
            socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev] });
            mouse.move = false;
        }
        mouse.pos_prev = {x: mouse.pos.x , y: mouse.pos.y};
        setTimeout(mainLoop, 25);
    }
    mainLoop();
    // clean bottom
    boton.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }, false);
}

document.addEventListener('DOMContentLoaded', init);