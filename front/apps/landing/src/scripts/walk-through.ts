import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/all';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

function animate() {
    var circles = gsap.utils.toArray('.steps--circle') as HTMLDivElement[];
    var text = gsap.utils.toArray('.steps--text') as HTMLHeadingElement[];
    // Query all emoji (#emoji-number) and convert to array
    var numberOfEmojis = gsap.utils.toArray('.emoji').length;

    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#product-walk-through',
            start: 'top 90%',
            toggleActions: 'restart none none none',
        },
        repeatDelay: 4,
    })

    tl.to(circles[0], { backgroundColor: 'var(--blue-sat)' })
        .to('.steps--top-bar', { bottom: '-1em', delay: 0 }, 'start')
        .to(circles[1], { backgroundColor: 'var(--blue-sat)' })
        .to('.steps--bottom-bar', { bottom: '-1em', delay: 0 }, 'middle')
        .to(circles[2], { backgroundColor: 'var(--blue-sat)' })

    tl.fromTo(text[0], { opacity: .2 }, { opacity: 1, duration: .2 }, 'start')
        .fromTo(text[1], { opacity: .2 }, { opacity: 1, duration: .2 }, 'middle')
        .fromTo(text[2], { opacity: .2 }, { opacity: 1, duration: .2 }, 'end')

    const duration = 2;
    const stagger = .1
    for (let i = 0; i < numberOfEmojis; i++) {
        tl.to(`#emoji-${i}`, {
            scale: 1,
            y: -200 + Math.random() * -40,
            duration: duration,
            delay: i * stagger,
        }, 'start')

        tl.to(`#emoji-${i}`, {
            opacity: 0,
            duration: duration * .5,
            delay: i * stagger + duration * .5,
        }, 'start')
    }

    const dollars = gsap.utils.toArray('.dollar') as HTMLDivElement[];
    tl.from(dollars, {
        scale: 0,
        duration: .6,
        stagger: .1,
        ease: CustomEase.create("custom", "M0,0 C0.11,0.494 0.144,0.975 0.328,1.065 0.455,1.126 0.504,1 1,1 "),
    }, 'end-=30%')
}

animate();

export { animate };
