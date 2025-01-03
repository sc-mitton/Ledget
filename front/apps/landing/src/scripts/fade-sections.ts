import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function fadeSections() {
  const divs = gsap.utils.toArray(
    'main>div:not(:nth-last-of-type(-n+1))'
  ) as HTMLElement[];

  for (let div of divs) {
    gsap.to(div, {
      opacity: 0.3,
      scrollTrigger: {
        trigger: div,
        start: 'bottom center',
        end: 'bottom center-=10%',
        toggleActions: 'restart none none none',
        scrub: true,
      },
    });
  }
}

fadeSections();
