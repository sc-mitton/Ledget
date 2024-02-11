import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animate() {

    var tl = gsap.timeline()

    var circles = gsap.utils.toArray('.progress--circle') as HTMLDivElement[];
    const firstCircle = circles[0];
    const lastCircle = circles[circles.length - 1];
    const middleCircle = circles[Math.floor(circles.length / 2)];


    tl.to(firstCircle, {
        scrollTrigger: {
            trigger: '.progress',
            start: 'top 50%',
            end: 'top 50%',
            scrub: true,
        },
        backgroundColor: 'var(--blue-sat)',
    }).to('.progress--top-bar', {
        scrollTrigger: {
            trigger: '.progress',
            start: 'top 50%',
            end: 'center 50%',
            scrub: true,
        },
        bottom: '50%',
    }).to(
        middleCircle, {
        scrollTrigger: {
            trigger: '.progress',
            start: 'center 50%',
            end: 'center 50%',
            scrub: true,
        },
        backgroundColor: 'var(--blue-sat)',
    }).to('.progress--bottom-bar', {
        scrollTrigger: {
            trigger: '.progress',
            start: 'center 50%',
            end: 'bottom 50%',
            scrub: true,
        },
        bottom: '0%',
    }).to(lastCircle, {
        scrollTrigger: {
            trigger: '.progress',
            start: 'bottom 50%',
            end: 'bottom 50%',
            scrub: true,
        },
        backgroundColor: 'var(--blue-sat)',
    });

}

animate();

