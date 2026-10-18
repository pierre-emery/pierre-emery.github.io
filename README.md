# Random topographic maps

I built this portfolio around a simple idea: generating mountain landscapes from mathematical functions. See it live at [pierre-emery.github.io](https://pierre-emery.github.io).

## The math

Everything comes from a single random number, the *seed*: the same seed always gives the same map (`?s=123456`).

1. **Density field.** A few range centres are drawn at random, and summits are sampled from a Gaussian mixture around them, rejecting any that fall too close to an existing one.
2. **Height field.** The ground is fractal Perlin noise (fBm) plus ridged noise, with a Gaussian bump at each summit. The coordinates are first distorted by more noise (domain warping) so the mountains look natural rather than perfectly round.
3. **Map rendering.** Contour lines are traced with marching squares, slopes are shaded from their gradient as if lit from the north-west, and everything below a water level becomes a lake.

The 3D version uses the same ingredients, plus a ridge. A smooth curve (a spline) is drawn from the trailhead to the summit, and the height of each point depends on its distance *d* to that curve. The sum of e^(−d/w), which comes to a point and gives a sharp crest, and e^(−d²/w²), which is rounded and gives wide flanks, produces a narrow arête resting on broad shoulders. The height of the crest itself increases along the curve up to the summit. The result is rendered with [three.js](https://threejs.org/).

## The site built around it

- **Home page:** each summit is one of my projects. Its height reflects the project's size, and a trail links the summits in chronological order. A new terrain is generated on every visit.
- **Itinerary:** my education and experience are checkpoints along a trail that climbs a generated 3D ridge, placed by date, up to "you are here" and what's next.

**To reuse this as a template :** Fork the repo and replace the content of `content.js` (name, projects, itinerary, photos) with your own; the maps adapt to whatever you put in. There's no build step: run `python3 -m http.server` and open <http://localhost:8000> to preview it. The shared noise and contour code lives in `common.js` if you want to modify it.

## Inspiration

The idea for this portfolio came to me after coming across [Lingdong Huang](https://github.com/LingDong-)'s repo [{Shan, Shui}\*](https://github.com/LingDong-/shan-shui-inf), which generates endless Chinese landscape paintings from mathematical functions in JavaScript. This project borrows the idea, not the code.
