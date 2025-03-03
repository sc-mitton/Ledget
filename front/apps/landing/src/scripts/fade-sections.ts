import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function fadeSections() {
  const divs = gsap.utils.toArray('.scroll-fade-in') as HTMLElement[];

  gsap.set(divs, { opacity: 0 });
  for (let div of divs) {
    if (div === divs[0]) {
      continue;
    }
    if (div !== divs[divs.length - 1]) {
      gsap.fromTo(
        div,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: div,
            start: 'center center-=20%',
            end: 'bottom center-=30%',
            toggleActions: 'restart none none none',
            scrub: true,
          },
        }
      );
    }

    gsap.fromTo(
      div,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: div,
          start: 'top bottom-=10%',
          end: 'bottom center+=20%',
          toggleActions: 'restart none none none',
          scrub: true,
        },
      }
    );
  }

  const firstDiv = divs[0];
  gsap.fromTo(
    firstDiv,
    { opacity: 1 },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: firstDiv,
        start: 'center center-=20%',
        end: 'bottom center-=30%',
        toggleActions: 'restart none none none',
        scrub: true,
      },
    }
  );
}

fadeSections();
