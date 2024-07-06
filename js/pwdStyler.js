let container = document.querySelector(".container");
let passwordInput = document.querySelector("#lpwd");

function Strength(password) {
    let i = 0;

    if (password.length > 8) i++;
    if (password.length >= 10) i += 2;
    if (/[A-Z]/.test(password)) i++;
    if (/[a-z]/.test(password)) i++;
    if (/[0-9]/.test(password)) i++;
    if (/[^A-Za-z0-9]/.test(password)) i++;

    return i;
}

function updatePasswordStrength() {
    let password = passwordInput.value;
    let strength = Strength(password);

    if (strength <= 2) {
        container.classList.add("weak");
        container.classList.remove("moderate");
        container.classList.remove("strong");
    } else if (strength >= 3 && strength <= 4) {
        container.classList.remove("weak");
        container.classList.add("moderate");
        container.classList.remove("strong");
    } else {
        container.classList.remove("weak");
        container.classList.remove("moderate");
        container.classList.add("strong");
    }
}

passwordInput.addEventListener("keyup", updatePasswordStrength);

document.querySelectorAll('.password-field').forEach(field => {
    let input = field.querySelectorAll('input'),
        button = field.querySelector('button');

    button.addEventListener('click', e => {
        if (field.classList.contains('show')) {
            field.classList.remove('show');
            anime({
                targets: field.querySelector('svg .top'),
                d: 'M2 10.5C2 10.5 6.43686 5.5 10.5 5.5C14.5631 5.5 19 10.5 19 10.5',
                duration: 200,
                easing: 'easeInOutQuad'
            });
            anime({
                targets: field,
                '--eye-s': 1,
                '--eye-background': 0,
                '--eye-offset': '10px',
                duration: 350,
                easing: 'easeInOutQuad'
            });
            anime({
                targets: field.querySelector('.lashes'),
                opacity: 0,
                duration: 100,
                easing: 'easeOutQuad'
            });
            anime({
                targets: field.querySelector('.eye'),
                opacity: 1,
                duration: 200,
                easing: 'easeInOutQuad'
            });
            return;
        }
        field.classList.add('show');
        anime({
            targets: field.querySelector('svg .top'),
            d: 'M2 10.5C2 10.5 6.43686 15.5 10.5 15.5C14.5631 15.5 19 10.5 19 10.5',
            duration: 200,
            easing: 'easeInOutQuad'
        });
        anime({
            targets: field,
            '--eye-s': 0,
            '--eye-background': 1,
            '--eye-offset': '0px',
            duration: 350,
            easing: 'easeInOutQuad'
        });
        anime({
            targets: field.querySelector('.lashes'),
            opacity: 1,
            duration: 150,
            easing: 'easeInQuad'
        });
        anime({
            targets: field.querySelector('.eye'),
            opacity: 0,
            duration: 200,
            easing: 'easeInOutQuad'
        });
    });

    field.addEventListener('pointermove', e => {
        if (!field.classList.contains('show')) {
            const rect = button.getBoundingClientRect();
            const fullWidth = rect.width;
            const halfWidth = fullWidth / 2;
            const fullHeight = rect.height;
            const halfHeight = fullHeight / 2;
            let x = e.clientX - rect.left - halfWidth,
                y = e.clientY - rect.top - halfHeight;

            field.style.setProperty('--eye-x', (x < -halfWidth ? -halfWidth : x > fullWidth ? fullWidth : x) / 15 + 'px');
            field.style.setProperty('--eye-y', (y < -halfHeight ? -halfHeight : y > fullHeight ? fullHeight : y) / 25 + 'px');
        }
    });

    field.addEventListener('pointerleave', e => {
        field.style.setProperty('--eye-x', '0px');
        field.style.setProperty('--eye-y', '0px');
    });

    input.forEach(single => single.addEventListener('input', e => input.forEach(i => i.value = e.target.value)));
});