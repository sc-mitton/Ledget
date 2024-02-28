import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateProducts() {
    ScrollTrigger.create({
        trigger: 'body',
        onUpdate: (self) => {
            if (self.scroll() === 0 && self.direction === -1) {
                gsap.to('.phone', {
                    y: Math.max(Math.min(self.getVelocity() / 100, -10), -40),
                    duration: Math.min(Math.max(-1 * self.getVelocity() / 5000, .15), .3),
                    yoyo: true,
                    repeat: 1,
                })
                gsap.to('.web', {
                    y: Math.max(Math.min(self.getVelocity() / 120, -5), -30),
                    duration: Math.min(Math.max(-1 * self.getVelocity() / 5500, .15), .2),
                    yoyo: true,
                    repeat: 1,
                })
            }
        }
    });
}

animateProducts();
