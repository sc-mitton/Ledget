import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateScreen() {
  var tl = gsap.timeline({});
  const screen1Elements = gsap.utils.toArray('.screen1');
  const screen2Elements = gsap.utils.toArray('.screen2');

  // First tap on the phone
  tl.to('.phone__touch', {
    opacity: 0.3,
    duration: 0.5,
    delay: 2,
  })
    .to('.phone__touch', {
      scale: 0.5,
      duration: 0.2,
    })
    .to('.phone__touch', {
      scale: 1,
      duration: 0.2,
    })
    .to(
      '.phone__touch',
      {
        opacity: 0,
        duration: 1,
        delay: 0.5,
      },
      'touch1-end'
    );

  // Transition from screen 1 to screen 2
  tl.to(
    screen1Elements,
    {
      opacity: 0,
      duration: 0.3,
    },
    'touch1-end'
  );

  tl.to(
    screen2Elements,
    {
      opacity: 1,
      duration: 0.3,
    },
    'touch1-end'
  );

  // Second tap on the phone
  tl.set('.phone__touch', {
    left: '28.5%',
    delay: 2,
  })
    .to('.phone__touch', {
      opacity: 0.3,
      duration: 0.5,
    })
    .to('.phone__touch', {
      scale: 0.5,
      duration: 0.2,
    })
    .to('.phone__touch', {
      scale: 1,
      duration: 0.2,
    })
    .to(
      '.phone__touch',
      {
        opacity: 0,
        duration: 1,
        delay: 0.5,
      },
      'touch2-end'
    );

  // Transition back to screen 1
  tl.to(
    screen2Elements,
    {
      opacity: 0,
      duration: 0.3,
    },
    'touch2-end'
  );

  tl.to(
    screen1Elements,
    {
      opacity: 1,
      duration: 0.3,
    },
    'touch2-end'
  );

  tl.repeat(-1);
}

function animatePhone() {
  // Scale Phone on Scroll
  gsap.to('.phone', {
    scrollTrigger: {
      trigger: '.phone',
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: true,
    },
    yoyo: true,
    repeat: 1,
  });
  gsap.to('.phone__glare>span', {
    opacity: 1,
    transform: 'translate(50%, 50%)',
    scrollTrigger: {
      trigger: '.phone',
      start: 'top 50%',
      end: 'bottom 30%',
      scrub: true,
    },
    duration: 1.5,
  });
}

function main() {
  // Add resize observer that will trigger the animation
  // when the window is 768px or less

  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.contentRect.width <= 768) {
        animatePhone();
      } else {
        // Remove the animation
        gsap.killTweensOf('.phone');
      }
    }
  });
  resizeObserver.observe(document.body);

  animateScreen();
}

main();
