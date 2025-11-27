(() => {
    const cursor = document.getElementById("kpszh-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let angle = 0;
    
    let speed = 30;
    let boosted = 450;
    let currentSpeed = speed;
    let lastMove = Date.now();

    const sizeHalf = cursor.offsetWidth / 2;
    const scalePower = 1.5;

    document.querySelectorAll("a, button, .cursor-hoverable").forEach(el => {
        el.onmouseenter = () => cursor.classList.add("pointer");
        el.onmouseleave = () => cursor.classList.remove("pointer");
    });

    document.onmousemove = e => {
        x = e.clientX;
        y = e.clientY;
        lastMove = Date.now();
        currentSpeed = boosted;
    };

    function tick() {
        let target = (Date.now() - lastMove > 200) ? speed : boosted;
        currentSpeed += (target - currentSpeed) * 0.01;

        angle += currentSpeed * 0.016;
        let scale = 1.0 + currentSpeed * scalePower * 0.001;

        cursor.style.transform = `translate(${x - sizeHalf}px, ${y - sizeHalf}px) rotate(${angle}deg) scale(${scale})`;

        requestAnimationFrame(tick);
    }

    tick();
})();