import comp001 from "@/assets/renders/comp001.jpg";
import render01 from "@/assets/renders/render01.jpg";
import render01b from "@/assets/renders/render01b.jpg";
import render01c from "@/assets/renders/render01c.jpg";
import render02 from "@/assets/renders/render02.jpg";
import test05 from "@/assets/renders/test05.jpg";
import test06 from "@/assets/renders/test06.jpg";
import test07 from "@/assets/renders/test07.jpg";
import test08 from "@/assets/renders/test08.jpg";

/**
 * The 3D gallery, in reading order down the masonry columns. Shown in colour —
 * the .grayscale treatment the system asks of photographs is waived here,
 * because the colour is the work.
 */
export const renders = [
  { image: render01, alt: "Interior visualisation, double-height living space" },
  { image: test06, alt: "Interior test render" },
  { image: render01b, alt: "Interior visualisation" },
  { image: comp001, alt: "Composited visualisation" },
  { image: render01c, alt: "Interior visualisation" },
  { image: test07, alt: "Test render" },
  { image: render02, alt: "Interior visualisation" },
  { image: test08, alt: "Test render" },
  { image: test05, alt: "Vertical test render" }
];

/** The single render that fronts the 3D section on the landing page. */
export const featuredRender = { image: test06, alt: "Architectural interior visualisation" };
