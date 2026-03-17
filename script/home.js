import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";
import { client } from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { initEmailForms } from './email';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadHomeData(), loadSpotlightImages()]);

  initAnimations();
  initEmailForms();

  gsap.registerPlugin(ScrollTrigger, SplitText);

  gsap.set(".hero .hero-cards .card", { transformOrigin: "center center" });

  gsap.to(".hero .hero-cards .card", {
    scale: 1,
    duration: 0.75,
    delay: 0.25,
    stagger: 0.1,
    ease: "power4.out",
    onComplete: () => {
      gsap.set("#hero-card-1", { transformOrigin: "top right" });
      gsap.set("#hero-card-3", { transformOrigin: "top left" });
    },
  });

  const smoothStep = (p) => p * p * (3 - 2 * p);

  if (window.innerWidth > 1000) {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "75% top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const heroCardsContainerOpacity = gsap.utils.interpolate(
          1,
          0.5,
          smoothStep(progress)
        );
        gsap.set(".hero-cards", {
          opacity: heroCardsContainerOpacity,
        });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
          (cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (1 - delay * 0.1)
            );

            const y = gsap.utils.interpolate(
              "0%",
              "400%",
              smoothStep(cardProgress)
            );
            const scale = gsap.utils.interpolate(
              1,
              0.75,
              smoothStep(cardProgress)
            );

            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(
                0,
                -15,
                smoothStep(cardProgress)
              );
            } else if (index === 2) {
              x = gsap.utils.interpolate(
                "0%",
                "-90%",
                smoothStep(cardProgress)
              );
              rotation = gsap.utils.interpolate(
                0,
                15,
                smoothStep(cardProgress)
              );
            }

            gsap.set(cardId, {
              y: y,
              x: x,
              rotation: rotation,
              scale: scale,
            });
          }
        );
      },
    });

    ScrollTrigger.create({
      trigger: ".home-services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: ".home-services",
      pinSpacing: true,
    });

    ScrollTrigger.create({
      trigger: ".home-services",
      start: "top bottom",
      end: `+=${window.innerHeight * 4}`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
        const headerY = gsap.utils.interpolate(
          "300%",
          "0%",
          smoothStep(headerProgress)
        );
        gsap.set(".home-services-header", {
          y: headerY,
        });

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(
            0,
            1,
            (progress - delay * 0.1) / (0.9 - delay * 0.1)
          );

          const innerCard = document.querySelector(
            `${cardId} .flip-card-inner`
          );

          let y;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate(
              "-100%",
              "50%",
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate(
              "50%",
              "0%",
              smoothStep(normalizedProgress)
            );
          } else {
            y = "0%";
          }

          let scale;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            scale = gsap.utils.interpolate(
              0.25,
              0.75,
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            scale = gsap.utils.interpolate(
              0.75,
              1,
              smoothStep(normalizedProgress)
            );
          } else {
            scale = 1;
          }

          let opacity;
          if (cardProgress < 0.2) {
            const normalizedProgress = cardProgress / 0.2;
            opacity = smoothStep(normalizedProgress);
          } else {
            opacity = 1;
          }

          let x, rotate, rotationY;
          if (cardProgress < 0.6) {
            x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
            rotationY = 0;
          } else if (cardProgress < 1) {
            const normalizedProgress = (cardProgress - 0.6) / 0.4;
            x = gsap.utils.interpolate(
              index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
              "0%",
              smoothStep(normalizedProgress)
            );
            rotate = gsap.utils.interpolate(
              index === 0 ? -5 : index === 1 ? 0 : 5,
              0,
              smoothStep(normalizedProgress)
            );
            rotationY = smoothStep(normalizedProgress) * 180;
          } else {
            x = "0%";
            rotate = 0;
            rotationY = 180;
          }

          gsap.set(cardId, {
            opacity: opacity,
            y: y,
            x: x,
            rotate: rotate,
            scale: scale,
          });

          gsap.set(innerCard, {
            rotationY: rotationY,
          });
        });
      },
    });
  }

  const spotlightImages = document.querySelector(".home-spotlight-images");
  const containerHeight = spotlightImages.offsetHeight;
  const viewportHeight = window.innerHeight;

  const initialOffset = containerHeight * 0.05;
  const totalMovement = containerHeight + initialOffset + viewportHeight;

  const spotlightHeader = document.querySelector(".spotlight-mask-header h3");
  let headerSplit = null;

  if (spotlightHeader) {
    headerSplit = SplitText.create(spotlightHeader, {
      type: "words",
      wordsClass: "spotlight-word",
    });

    gsap.set(headerSplit.words, { opacity: 0 });
  }

  ScrollTrigger.create({
    trigger: ".home-spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 7}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.5) {
        const animationProgress = progress / 0.5;

        const startY = 5;
        const endY = -(totalMovement / containerHeight) * 100;

        const currentY = startY + (endY - startY) * animationProgress;

        gsap.set(spotlightImages, {
          y: `${currentY}%`,
        });
      }

      const maskContainer = document.querySelector(
        ".spotlight-mask-image-container"
      );
      const maskImage = document.querySelector(".spotlight-mask-image");

      if (maskContainer && maskImage) {
        if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;
          const maskSize = `${maskProgress * 475}%`;

          const imageScale = 1.25 - maskProgress * 0.25;

          maskContainer.style.setProperty("-webkit-mask-size", maskSize);
          maskContainer.style.setProperty("mask-size", maskSize);

          gsap.set(maskImage, {
            scale: imageScale,
          });
        } else if (progress < 0.25) {
          maskContainer.style.setProperty("-webkit-mask-size", "0%");
          maskContainer.style.setProperty("mask-size", "0%");

          gsap.set(maskImage, {
            scale: 1.25,
          });
        } else if (progress > 0.75) {
          maskContainer.style.setProperty("-webkit-mask-size", "475%");
          maskContainer.style.setProperty("mask-size", "475%");

          gsap.set(maskImage, {
            scale: 1,
          });
        }
      }

      if (headerSplit && headerSplit.words.length > 0) {
        if (progress >= 0.75 && progress <= 0.95) {
          const textProgress = (progress - 0.75) / 0.2;
          const totalWords = headerSplit.words.length;

          headerSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.75) {
          gsap.set(headerSplit.words, { opacity: 0 });
        } else if (progress > 0.95) {
          gsap.set(headerSplit.words, { opacity: 1 });
        }
      }
    },
  });

  const outroHeader = document.querySelector(".outro h3");
  let outroSplit = null;

  if (outroHeader) {
    outroSplit = SplitText.create(outroHeader, {
      type: "words",
      wordsClass: "outro-word",
    });

    gsap.set(outroSplit.words, { opacity: 0 });
  }

  const outroStrips = document.querySelectorAll(".outro-strip");
  const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top top",
    end: `+=${window.innerHeight * 3}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      if (outroSplit && outroSplit.words.length > 0) {
        if (progress >= 0.25 && progress <= 0.75) {
          const textProgress = (progress - 0.25) / 0.5;
          const totalWords = outroSplit.words.length;

          outroSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.25) {
          gsap.set(outroSplit.words, { opacity: 0 });
        } else if (progress > 0.75) {
          gsap.set(outroSplit.words, { opacity: 1 });
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top bottom",
    end: `+=${window.innerHeight * 6}px`,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      outroStrips.forEach((strip, index) => {
        if (stripSpeeds[index] !== undefined) {
          const speed = stripSpeeds[index];
          const movement = progress * 100 * speed;

          gsap.set(strip, {
            x: `${movement}%`,
          });
        }
      });
    },
  });
});

async function loadSpotlightImages() {
  try {
    const query = `*[_type == "project" && defined(mainImage)] | order(year desc, _createdAt desc)[0...9]{
      mainImage,
      slug,
      visibility,
      title
    }`;
    const projects = await client.fetch(query);

    const imageHolders = document.querySelectorAll('.home-spotlight-image.image-holder');

    projects.forEach((project, index) => {
      const holder = imageHolders[index];
      if (!holder) return;

      const img = holder.querySelector('img');
      if (img && project.mainImage) {
        img.src = urlFor(project.mainImage).width(800).auto('format').url();
        
        if (project.visibility === 'private') {
          img.classList.add('project-private-blur');
          holder.classList.add('project-private-container');
          
          const overlay = document.createElement('div');
          overlay.className = 'project-private-overlay';
          overlay.innerHTML = `
            <p class="mono">Private</p>
            <h4>${project.title || 'Project'}</h4>
          `;
          holder.appendChild(overlay);
        }

        if (project.slug) {
          // If no link exists, create one
          let link = holder.querySelector('a');
          if (!link) {
            link = document.createElement('a');
            link.className = 'spotlight-project-link';
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
          }
          link.href = `/project.html?id=${project.slug.current}`;
        }
      }
    });
  } catch (error) {
    console.error("Error fetching spotlight images:", error);
  }
}

async function loadHomeData() {
  try {
    const data = await client.fetch(`*[_type == "homePage"][0]`);
    if (!data) return;

    // Hero
    const heroName = document.querySelector('.hero-header h1');
    if (heroName && data.heroName) heroName.textContent = data.heroName;
    const heroCopy = document.querySelector('.hero-footer-copy p');
    if (heroCopy && data.heroCopy) heroCopy.textContent = data.heroCopy;
    const heroTags = document.querySelectorAll('.hero-footer-tags p');
    if (heroTags[0] && data.heroTag1) heroTags[0].innerHTML = `<span>&#9654;</span> ${data.heroTag1}`;
    if (heroTags[1] && data.heroTag2) heroTags[1].innerHTML = `<span>&#9654;</span> ${data.heroTag2}`;

    // Skillset header & cards
    const skillsetHeader = document.querySelector('.home-about-header h3');
    if (skillsetHeader && data.skillsetHeader) skillsetHeader.textContent = data.skillsetHeader;
    if (data.skillsets && data.skillsets.length > 0) {
      const cardLabels = document.querySelectorAll('.home-about-card p.mono');
      const cardTitles = document.querySelectorAll('.home-about-card h4');
      data.skillsets.forEach((item, i) => {
        if (cardLabels[i]) cardLabels[i].textContent = item.label;
        if (cardTitles[i]) cardTitles[i].textContent = item.title;
      });
    }

    // Services intro & flip cards
    const servicesIntro = document.querySelector('.home-services-header p');
    if (servicesIntro && data.servicesIntro) servicesIntro.textContent = data.servicesIntro;
    if (data.services && data.services.length > 0) {
      const cards = document.querySelectorAll('.cards .card');
      data.services.forEach((service, i) => {
        const card = cards[i];
        if (!card) return;
        card.querySelectorAll('.card-title p.mono').forEach(p => {
          p.textContent = p.textContent.trim().length <= 2 ? service.number : service.title;
        });
        const backCopy = card.querySelector('.card-copy');
        if (backCopy && service.items) backCopy.innerHTML = service.items.map(item => `<p>${item}</p>`).join('');
      });
    }

    // Spotlight text & mask image
    const spotlightIntro = document.querySelector('.spotlight-intro-header h3');
    if (spotlightIntro && data.spotlightIntroText) spotlightIntro.textContent = data.spotlightIntroText;
    const maskImg = document.querySelector('.spotlight-mask-image img');
    if (maskImg && data.spotlightMaskImage) maskImg.src = urlFor(data.spotlightMaskImage).url();
    const maskHeader = document.querySelector('.spotlight-mask-header h3');
    if (maskHeader && data.spotlightMaskHeader) maskHeader.textContent = data.spotlightMaskHeader;

    // Outro
    const outroHeader = document.querySelector('.outro h3');
    if (outroHeader && data.outroText) outroHeader.textContent = data.outroText;
    if (data.outroSkills && data.outroSkills.length > 0) {
      const strips = document.querySelectorAll('.outro-strip');
      const variants = ['skill-var-1', 'skill-var-2', 'skill-var-3'];
      const perStrip = Math.ceil(data.outroSkills.length / strips.length);
      strips.forEach((strip, si) => {
        strip.innerHTML = '';
        data.outroSkills.slice(si * perStrip, (si + 1) * perStrip).forEach((skill, i) => {
          strip.innerHTML += `<div class="skill ${variants[i % 3]}"><p class="mono">${skill}</p></div>`;
        });
      });
    }
  } catch (e) {
    console.error('Error loading home data:', e);
  }
}
