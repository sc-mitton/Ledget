import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/all';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);

const motionPath1 = [
    { x: 5, y: -60 },
    { x: 0, y: -120 },
    { x: -5, y: -180 },
    { x: 0, y: -240 }
]

const motionPath2 = [
    { x: -5, y: -60 },
    { x: 0, y: -120 },
    { x: 5, y: -180 },
    { x: 0, y: -240 }
]

function animate() {
    var circles = gsap.utils.toArray('.progress--circle') as HTMLDivElement[];
    var text = gsap.utils.toArray('.step') as HTMLHeadingElement[];
    // Query all emoji (#emoji-number) and convert to array
    var numberOfEmojis = gsap.utils.toArray('.emoji').length;

    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#product-walk-through',
            start: 'top 90%',
            toggleActions: 'play none none none',
        }
    })

    tl.to(circles[0], { backgroundColor: 'var(--blue)' })
        .to('.progress--top-bar', { bottom: '50%', delay: 0 }, 'start')
        .to(circles[1], { backgroundColor: 'var(--blue)' })
        .to('.progress--bottom-bar', { bottom: '.5em', delay: .5 }, 'middle')
        .to(circles[2], { backgroundColor: 'var(--blue)' })

    tl.fromTo(text[0], { opacity: .2 }, { opacity: 1, duration: .2 }, 'start')
        .fromTo(text[1], { opacity: .2 }, { opacity: 1, duration: .2 }, 'middle')
        .fromTo(text[2], { opacity: .2 }, { opacity: 1, duration: .2 }, 'end')


    for (let i = 0; i < numberOfEmojis; i++) {
        tl.to(`#emoji-${i}`, {
            scale: window.innerWidth < 768 ? .75 : 1,
            opacity: 0,
            motionPath: { path: Math.random() > .5 ? motionPath1 : motionPath2, align: 'self' },
            duration: 7,
            delay: i,
            repeat: -1,
        }, 'start')
    }
}

animate();

export { animate };
