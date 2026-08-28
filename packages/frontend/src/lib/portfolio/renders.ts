import bathroomBlackTile from "@/assets/renders/bathroom-black-tile.jpg";
import bathroomMarbleShower from "@/assets/renders/bathroom-marble-shower.jpg";
import bathroomStoneWall from "@/assets/renders/bathroom-stone-wall.jpg";
import bathroomVanityDetail from "@/assets/renders/bathroom-vanity-detail.jpg";
import bedroomDesk from "@/assets/renders/bedroom-desk.jpg";
import comp001 from "@/assets/renders/comp001.jpg";
import deskLamp from "@/assets/renders/desk-lamp.jpg";
import houseExteriorDusk from "@/assets/renders/house-exterior-dusk.jpg";
import livingRoomCathedral from "@/assets/renders/living-room-cathedral.jpg";
import livingRoomPanelled from "@/assets/renders/living-room-panelled.jpg";
import mustangFastback from "@/assets/renders/mustang-fastback.png";
import neonLoopLamp from "@/assets/renders/neon-loop-lamp.jpg";
import oakWallPanel from "@/assets/renders/oak-wall-panel.jpg";
import pineconePendant from "@/assets/renders/pinecone-pendant.jpg";
import render01 from "@/assets/renders/render01.jpg";
import render01b from "@/assets/renders/render01b.jpg";
import render01c from "@/assets/renders/render01c.jpg";
import render02 from "@/assets/renders/render02.jpg";
import rpgLaunchers from "@/assets/renders/rpg-launchers.jpg";
import test05 from "@/assets/renders/test05.jpg";
import test06 from "@/assets/renders/test06.jpg";
import test07 from "@/assets/renders/test07.jpg";
import test08 from "@/assets/renders/test08.jpg";

/**
 * The 3D gallery, newest work first — it reads down the masonry columns in this
 * order. Shown in colour; the .grayscale wrapper the system asks of
 * photographs is waived here, because the colour is the work.
 */
export const renders = [
  { image: render01, alt: "Double-height living space behind full-height glazing" },
  { image: comp001, alt: "Modern house at dusk, lit from inside" },
  { image: render01b, alt: "Open-plan kitchen and dining room in pale oak" },
  { image: render01c, alt: "Coastal bedroom in blue and white" },
  { image: render02, alt: "Bedroom with a charcoal duvet and a round mirror" },
  { image: test05, alt: "Bedroom in dusty pink, seen wide" },
  { image: test07, alt: "Pillows and linen in close-up" },
  { image: test06, alt: "Duvet and throw in close-up" },
  { image: test08, alt: "Bed from above, with the throw folded back" },

  // — Older work, from the ArtStation archive —
  { image: bathroomStoneWall, alt: "Bathroom with a stone feature wall, a backlit round mirror and a marble bath" },
  { image: houseExteriorDusk, alt: "Two-storey house at dusk, white render against stained timber cladding" },
  { image: livingRoomCathedral, alt: "Living room under a cathedral window, with a stacked stone chimney breast" },
  { image: rpgLaunchers, alt: "RPG-7 launchers and warheads, laid out as a studio render" },
  { image: livingRoomPanelled, alt: "Living room with dark panelled walls, arched windows and a herringbone floor" },
  { image: oakWallPanel, alt: "Faceted oak wall panelling, rendered as a repeating tile" },
  { image: neonLoopLamp, alt: "Table lamp — a looped light tube held between brass posts, against concrete" },
  { image: pineconePendant, alt: "Pendant lamp built from layered plywood petals" },
  { image: bathroomVanityDetail, alt: "Bathroom vanity in detail: chrome mirror, sconces and a marble top" },
  { image: bathroomMarbleShower, alt: "Bathroom with a marble walk-in shower beside a white vanity" },
  { image: mustangFastback, alt: "Ford Mustang fastback, product render" },
  { image: bedroomDesk, alt: "Small bedroom with a built-in desk, bookshelves and afternoon light" },
  { image: bathroomBlackTile, alt: "Bathroom in black tile with a white double vanity" },
  { image: deskLamp, alt: "Articulated desk lamp, product render" }
];

/** The single render that fronts the 3D section on the landing page. */
export const featuredRender = { image: render01, alt: "Double-height living space behind full-height glazing" };
