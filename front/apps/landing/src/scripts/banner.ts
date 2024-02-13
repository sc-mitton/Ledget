import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animate() {
    gsap.to('.mobile', {
        scrollTrigger: {
            trigger: '.mobile',
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
        },
        scale: 1.2,
        yoyo: true,
        repeat: 1
    })
}

function main() {

    // Add resize observer that will trigger the animation
    // when the window is 768px or less

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width <= 768) {
                animate();
            } else {
                // Remove the animation
                gsap.killTweensOf('.mobile');
                // Reset the scale
                gsap.set('.mobile', { scale: 1 });
            }
        }
    });

    resizeObserver.observe(document.body);
}

main();


