import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateSmall() {
    const features = document.querySelectorAll('.feature');
    gsap.killTweensOf(features);
    gsap.set(features, { opacity: 0, y: 50 });
    for (let feature of features) {
        gsap.to(feature, {
            scrollTrigger: {
                trigger: feature,
                start: "top 80%",
                end: "top 80%",
            },
            scale: 1,
            opacity: 1,
            y: 0,
        })
    }
}

function animateLarge() {
    const features = document.querySelectorAll('.feature');
    gsap.killTweensOf(features);
    gsap.to(features, {
        scrollTrigger: {
            trigger: '#features',
            start: "top 70%",
            end: "bottom 70%",
        },
        opacity: 1,
        scale: 1,
        ease: 'power1.inOut',
        stagger: .2,
        scrub: true,
        y: 0,
    })
}

function animate() {
    // If large screen
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width < 768) {
                animateSmall();
            } else {
                animateLarge();
            }
        }
    });

    gsap.to('#features', {
        opacity: .3,
        scrollTrigger: {
            trigger: '#features',
            start: "bottom center",
            end: "bottom center-=10%",
            toggleActions: 'restart none none none',
            scrub: true,
        }
    })

    resizeObserver.observe(document.body);
}

animate();


