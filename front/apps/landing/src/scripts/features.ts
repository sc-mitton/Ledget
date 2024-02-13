import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger);

function animate() {
    const features = document.querySelectorAll('.feature');

    gsap.fromTo(features, { scale: .85, opacity: 0, y: -20 }, {
        scrollTrigger: {
            trigger: '#features',
            start: "top 70%",
            end: "top 70%",
        },
        opacity: 1,
        scale: 1,
        ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.253,0.931 0.44,1.043 0.648,1.168 0.745,1 1,1 "),
        duration: .4,
        stagger: .3,
        y: 0,
    })

}

animate();


