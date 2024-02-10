import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animate() {
    gsap.fromTo('.progress--line',
        { right: '100%' },
        {
            scrollTrigger: {
                trigger: '#walk-through',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true,
                pin: true,
                toggleActions: 'play none none none'
            },
            right: '0%',
            duration: 1
        }
    )
}

animate();

