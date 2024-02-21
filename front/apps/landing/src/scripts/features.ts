import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger);

function animate() {
    const features = document.querySelectorAll('.feature');

    gsap.fromTo(features, { scale: .95, opacity: 0, y: 50 }, {
        scrollTrigger: {
            trigger: '#features',
            start: "top 70%",
            end: "top 70%",
        },
        opacity: 1,
        scale: 1,
        ease: 'power1.inOut',
        duration: .6,
        stagger: .2,
        y: 0,
    })

}

animate();


