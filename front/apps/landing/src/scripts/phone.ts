

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateScreen() {
    var tl = gsap.timeline({});

    // First tap on the phone
    tl.to('.phone__touch', {
        opacity: .3,
        duration: .5,
        delay: 2,
    }).to('.phone__touch', {
        scale: .5,
        duration: .2,
    }).to('.phone__touch', {
        scale: 1,
        duration: .2,
    }).to('.phone__touch', {
        opacity: 0,
        duration: 1,
        delay: .5,
    }, 'touch1-end')

    // Transition from screen 1 to screen 2
    tl.to('#phone_screen1', {
        opacity: 0,
        duration: .4,
    }, 'touch1-end')

    tl.to('#phone_nav1', {
        opacity: 0,
        duration: .4,
    }, 'touch1-end')

    tl.to('#phone_nav2', {
        opacity: 1,
        duration: .4,
    }, 'touch1-end')

    tl.to('#phone_screen2', {
        opacity: 1,
        duration: .4,
    }, 'touch1-end')

    // Second tap on the phone
    tl.set('.phone__touch', {
        left: '31.5%',
        delay: 2,
    }).to('.phone__touch', {
        opacity: .3,
        duration: .5,
    }).to('.phone__touch', {
        scale: .5,
        duration: .2,
    }).to('.phone__touch', {
        scale: 1,
        duration: .2,
    }).to('.phone__touch', {
        opacity: 0,
        duration: 1,
        delay: .5,
    }, 'touch2-end')

    // Transition back to screen 1
    tl.to('#phone_screen2', {
        opacity: 0,
        duration: .2,
    }, 'touch2-end')

    tl.to('#phone_nav1', {
        opacity: 1,
        duration: .2,
    }, 'touch2-end')

    tl.to('#phone_nav2', {
        opacity: 0,
        duration: .2,
    }, 'touch2-end')

    tl.to('#phone_screen1', {
        opacity: 1,
        duration: .2,
    }, 'touch2-end')

    tl.repeat(-1);
}

function animatePhone() {
    // Scale Phone on Scroll
    gsap.to('.phone', {
        scale: .75,
        scrollTrigger: {
            trigger: '.phone',
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: true,
        },
        yoyo: true,
        repeat: 1
    });
}

function main() {

    // Add resize observer that will trigger the animation
    // when the window is 768px or less

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width <= 768) {
                animatePhone();
            } else {
                // Remove the animation
                gsap.killTweensOf('.phone');
                // Reset the scale
                gsap.set('.phone', { scale: .625 });
            }
        }
    });
    resizeObserver.observe(document.body);

    animateScreen();
}



main();


