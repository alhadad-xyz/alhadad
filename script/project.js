import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "./anime";
import { client } from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { revealManager } from './reveal';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

document.addEventListener("DOMContentLoaded", async () => {
  gsap.registerPlugin(ScrollTrigger);

  // If no slug provided, redirect to work page
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id');
  if (!slug) {
    window.location.replace('/work.html');
    return;
  }

  // Show page hidden initially to prevent content flash
  document.body.style.opacity = '0';

  await loadProjectData(slug);

  initAnimations();

  // Fade in once all data is injected
  gsap.to(document.body, { opacity: 1, duration: 0.4, ease: 'power2.out' });

  setTimeout(() => {
    initSnapshotsScroll();
  }, 100);
});

async function loadProjectData(slug) {
  try {
    const params = new URLSearchParams(window.location.search);
    // Single GROQ query — fetch current project + all project slugs + site settings
    const [project, allProjects, settings] = await Promise.all([
      client.fetch(
        `*[_type == "project" && slug.current == $slug][0]{
          title, slug, client, year, role, liveUrl,
          mainImage, gallery, longDescription, stack,
          clientReviewText, visibility
        }`,
        { slug }
      ),
      client.fetch(
        `*[_type == "project"] | order(year desc){ title, slug, liveUrl, year, role, client, visibility }`,
      ),
      client.fetch(`*[_type == "siteSettings"][0]{ globalRevealKey, globalRevealExpires }`)
    ]);

    // Project not found
    if (!project) {
      showNotFound();
      return;
    }

    // Handle URL reveal parameter
    const urlRevealKey = params.get('reveal');
    if (urlRevealKey && revealManager.validateKey(settings, urlRevealKey)) {
      revealManager.persistReveal();
    }

    const isRevealed = revealManager.isRevealed();

    // ── Title & SEO meta ─────────────────────────────
    document.title = `${project.title} | Alhadad`;
    setMeta('og:title', `${project.title} | Alhadad`);
    setMeta('og:type', 'website');
    setMeta('og:url', window.location.href);
    setMeta('description', project.longDescription || project.title);
    setMeta('og:description', project.longDescription || project.title);
    if (project.mainImage) {
      setMeta('og:image', urlFor(project.mainImage).width(1200).url());
    }

    // ── Header ───────────────────────────────────────
    document.querySelector('.project-title h3').textContent = project.title;

    const metaCols = document.querySelectorAll('.project-meta-col p');
    if (metaCols.length >= 6) {
      // Live URL — render as clickable anchor
      const urlHost = project.liveUrl ? new URL(project.liveUrl).hostname : '';
      const urlCell = metaCols[0];
      if (project.liveUrl) {
        const a = document.createElement('a');
        a.href = project.liveUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = urlHost;
        a.style.textDecoration = 'underline';
        a.style.color = 'inherit';
        urlCell.textContent = '';
        urlCell.appendChild(a);
      } else {
        urlCell.textContent = '';
      }
      metaCols[2].textContent = project.year || '';
      metaCols[3].textContent = project.role || '';
      metaCols[5].textContent = project.client || '';
    }

    if (project.mainImage) {
      const bannerImg = document.querySelector('.project-banner-img img');
      bannerImg.src = urlFor(project.mainImage).url();
      
      const bannerContainer = bannerImg.parentElement;

      if (project.visibility === 'private' && !isRevealed) {
        bannerImg.classList.add('project-private-blur');
        bannerContainer.classList.add('project-private-container');
        
        let overlay = bannerContainer.querySelector('.project-private-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'project-private-overlay';
          bannerContainer.appendChild(overlay);
        }
        
        overlay.innerHTML = `
          <p class="mono">Confidential</p>
          <h4>PRIVATE PROJECT</h4>
        `;

        const revealBtn = revealManager.createRevealButton(settings, () => {
          window.location.reload();
        });
        overlay.appendChild(revealBtn);
      } else {
        bannerImg.classList.remove('project-private-blur');
        bannerContainer.classList.remove('project-private-container');
        const overlay = bannerContainer.querySelector('.project-private-overlay');
        if (overlay) overlay.remove();
      }
    }

    // ── Long description ─────────────────────────────
    const descriptionP = document.querySelector('.project-overview-copy p:last-child');
    if (descriptionP) {
      descriptionP.textContent = project.longDescription || '';
    }

    // ── Stack ────────────────────────────────────────
    const stackContainer = document.querySelector('.project-stack');
    if (stackContainer && project.stack && project.stack.length > 0) {
      stackContainer.querySelectorAll('p:not(.mono)').forEach(p => p.remove());
      project.stack.forEach((tech, i) => {
        const p = document.createElement('p');
        p.textContent = tech;
        p.setAttribute('data-animate-type', 'line-reveal');
        p.setAttribute('data-animate-delay', (0.3 + i * 0.1).toFixed(1));
        p.setAttribute('data-animate-on-scroll', 'true');
        stackContainer.appendChild(p);
      });
    }

    // ── Client review ────────────────────────────────
    document.querySelectorAll('.project-info-copy p:not(.mono)').forEach(p => p.remove());
    if (project.clientReviewText) {
      const reviewContainer = document.querySelector('.project-info-copy');
      const p = document.createElement('p');
      p.textContent = project.clientReviewText;
      p.setAttribute('data-animate-type', 'line-reveal');
      p.setAttribute('data-animate-delay', '0.25');
      p.setAttribute('data-animate-on-scroll', 'true');
      reviewContainer.appendChild(p);
    }

    // ── Gallery snapshots ────────────────────────────
    const snapshotsWrapper = document.querySelector('.project-snapshots-wrapper');
    if (snapshotsWrapper && project.gallery && project.gallery.length > 0) {
      snapshotsWrapper.innerHTML = '';
      project.gallery.forEach(img => {
        const div = document.createElement('div');
        div.className = 'project-snapshot';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'project-snapshot-img-wrapper';
        wrapper.style.width = '65%';
        wrapper.style.height = '65%';
        wrapper.style.position = 'relative';
        wrapper.style.borderRadius = '8px';
        wrapper.style.overflow = 'hidden';
        
        const imageEl = document.createElement('img');
        imageEl.src = urlFor(img).url();
        imageEl.style.width = '100%';
        imageEl.style.height = '100%';

        if (project.visibility === 'private' && !isRevealed) {
          wrapper.classList.add('project-private-container');
          imageEl.classList.add('project-private-blur');
          
          const overlay = document.createElement('div');
          overlay.className = 'project-private-overlay';
          overlay.innerHTML = `
            <p class="mono">Gallery Locked</p>
            <h4>PRIVATE</h4>
          `;
          
          const revealBtn = revealManager.createRevealButton(settings, () => {
            window.location.reload();
          });
          overlay.appendChild(revealBtn);
          wrapper.appendChild(overlay);
        }
        
        wrapper.appendChild(imageEl);
        div.appendChild(wrapper);
        snapshotsWrapper.appendChild(div);
      });
    }

    // ── Next project (from already-loaded list) ──────
    if (allProjects && allProjects.length > 0) {
      const currentIdx = allProjects.findIndex(p => p.slug.current === slug);
      if (currentIdx !== -1) {
        const next = allProjects[(currentIdx + 1) % allProjects.length];

        const nextTitle = document.querySelector('.next-project-title h3');
        if (nextTitle) nextTitle.textContent = next.title;

        const nextMetaCols = document.querySelectorAll('.next-project-meta-col p');
        if (nextMetaCols.length >= 6) {
          nextMetaCols[0].textContent = next.liveUrl ? new URL(next.liveUrl).hostname : '';
          nextMetaCols[2].textContent = next.year || '';
          nextMetaCols[3].textContent = next.role || '';
          nextMetaCols[5].textContent = next.client || '';
        }

        const nextSection = document.querySelector('.next-project');
        if (nextSection) {
          nextSection.style.cursor = 'pointer';
          nextSection.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = `/project.html?id=${next.slug.current}`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
          });
        }
      }
    }
  } catch (error) {
    console.error("Error loading project data", error);
    showNotFound();
  }
}

// ── Helper: inject/update <meta> tags ────────────────
function setMeta(name, content) {
  const isOg = name.startsWith('og:');
  const selector = isOg
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    isOg ? el.setAttribute('property', name) : el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// ── Show a user-friendly "project not found" state ───
function showNotFound() {
  const main = document.querySelector('.project-header');
  if (main) {
    main.querySelector('.project-title h3').textContent = 'Not Found';
    const meta = main.querySelector('.project-meta');
    if (meta) meta.innerHTML = `
      <div class="project-meta-col">
        <p>This project doesn't exist.</p>
        <p><a href="/work.html" style="text-decoration:underline;color:inherit;">← Back to Work</a></p>
      </div>`;
  }
  // Hide sections that have no content to show
  ['.project-banner-img', '.project-overview', '.project-snapshots',
   '.project-info', '.next-project'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.display = 'none';
  });
}

function initSnapshotsScroll() {
  const wrapper = document.querySelector(".project-snapshots-wrapper");
  const snapshotsSection = document.querySelector(".project-snapshots");

  if (!wrapper || !snapshotsSection) return;

  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "snapshots-progress-bar";

  for (let i = 0; i < 30; i++) {
    const indicator = document.createElement("div");
    indicator.className = "progress-indicator";
    progressBarContainer.appendChild(indicator);
  }

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBarContainer.appendChild(progressBar);

  snapshotsSection.appendChild(progressBarContainer);

  ScrollTrigger.refresh();

  const calculateDimensions = () => {
    return -(wrapper.offsetWidth - window.innerWidth);
  };

  let moveDistance = calculateDimensions();

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  ScrollTrigger.create({
    trigger: ".project-snapshots",
    start: "top top",
    end: () => `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: isSafari && isIOS ? 0.5 : 1,
    invalidateOnRefresh: true,
    onRefresh: () => { moveDistance = calculateDimensions(); },
    onUpdate: (self) => {
      gsap.set(wrapper, {
        x: self.progress * moveDistance,
        force3D: true,
        transformOrigin: "left center",
      });
      if (progressBar) {
        gsap.set(progressBar, { width: `${self.progress * 100}%` });
      }
    },
  });

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      moveDistance = calculateDimensions();
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => setTimeout(handleResize, 500));

  if (isIOS) {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", () => setTimeout(setVh, 500));
  }
}
