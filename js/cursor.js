// Кастомный курсор
(() => {
    const cursor = document.getElementById("kpszh-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let angle = 0;
    let speed = 30; // Обычная скорость вращения
    let boosted = 450; // Увеличенная скорость вращения при движении
    let currentSpeed = speed;
    let lastMove = Date.now();

    const sizeHalf = cursor.offsetWidth / 2; // Вычисление половинного размера
    const scalePower = 1.5; // Коэффициент масштабирования при движении

    // Эффект наведения (ссылки, кнопки и кастомные .cursor-hoverable)
    document.addEventListener("pointermove", e => {
        const isHoverable = !!e.target.closest("a, button, audio, label, .cursor-hoverable");
        const isNotHoverable = !!e.target.closest(".cursor-not-hoverable");
        cursor.classList.toggle("pointer", isHoverable && !isNotHoverable);
    });

    // Анимация ускорения и масштабирования
    document.onmousemove = e => {
        x = e.clientX;
        y = e.clientY;
        lastMove = Date.now();
        currentSpeed = boosted;
    };

    function tick() {
        let target = (Date.now() - lastMove > 200) ? speed : boosted;
        currentSpeed += (target - currentSpeed) * 0.015;
        angle += currentSpeed * 0.016;
        let scale = 1.0 + currentSpeed * scalePower * 0.001;
        cursor.style.transform = `translate(${x - sizeHalf}px, ${y - sizeHalf}px) rotate(${angle}deg) scale(${scale})`;
        requestAnimationFrame(tick);
    }

    tick();
})();