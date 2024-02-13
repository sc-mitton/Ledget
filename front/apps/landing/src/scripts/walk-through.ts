import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/all';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const motionPath1 = [
    { x: 0, y: 0 },
    { x: 20, y: -40 },
    { x: 0, y: -80 },
    { x: -20, y: -120 },
    { x: 0, y: -160 }
]

const motionPath2 = [
    { x: 0, y: 0 },
    { x: -20, y: -40 },
    { x: 0, y: -80 },
    { x: 20, y: -120 },
    { x: 0, y: -160 }
]

export function animate() {

    var circles = gsap.utils.toArray('.progress--circle') as HTMLDivElement[];
    var text = gsap.utils.toArray('.step') as HTMLHeadingElement[];
    var emojis = gsap.utils.toArray('.emoji') as HTMLSpanElement[];

    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#product-walk-through',
            start: 'top 50%',
            toggleActions: 'play none none none',
        }
    })

    tl.to(circles[0], { backgroundColor: 'var(--blue-sat)' })
        .to('.progress--top-bar', { bottom: '50%', delay: 2 }, 'start')
        .to(circles[1], { backgroundColor: 'var(--blue-sat)' })
        .to('.progress--bottom-bar', { bottom: '.5em', delay: 2 }, 'middle')
        .to(circles[2], { backgroundColor: 'var(--blue-sat)' })

    tl.fromTo(text[0], { opacity: .1 }, { opacity: 1, duration: .2 }, 'start')
        .fromTo(text[1], { opacity: .1 }, { opacity: 1, duration: .2 }, 'middle')
        .fromTo(text[2], { opacity: .1 }, { opacity: 1, duration: .2 })

    emojis.forEach((emoji, i) => {
        tl.to(emoji, {
            opacity: 0,
            motionPath: { path: Math.random() > .5 ? motionPath1 : motionPath2, align: 'self' },
            duration: 4,
            ease: 'power1.inOut',
            delay: Math.random() * 2,
        }, 'start')
    })

}

animate();
