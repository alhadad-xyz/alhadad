import { gsap } from 'gsap';

// Columns that each fall on their own clock under gravity, drawn as one strand-y edge into a
// clipPath (objectBoundingBox units). edge 2 keeps what is below the edge (a drain), -1 what is above it (a pour).
export function drips(path, edge, { count = 24, duration = [0.8, 1.2], lag = 0.3 } = {}) {
  const cols = Array.from({ length: count }, () => ({ y: 0 }));
  const dx = 1 / (cols.length - 1);
  const draw = () => {
    let d = `M0 ${edge}V${cols[0].y}`;
    for (let i = 1; i < cols.length; i++)
      d += `C${(i - 0.5) * dx} ${cols[i - 1].y} ${(i - 0.5) * dx} ${cols[i].y} ${i * dx} ${cols[i].y}`;
    path.setAttribute('d', `${d}V${edge}Z`);
  };
  draw();
  const tl = gsap.timeline({ onUpdate: draw });
  cols.forEach((c) => tl.to(c, { y: 1.2, duration: gsap.utils.random(...duration), ease: 'power2.in' }, gsap.utils.random(0, lag)));
  return tl;
}
