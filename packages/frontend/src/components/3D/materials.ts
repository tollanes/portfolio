import { MeshPhysicalMaterial } from "three";

export const white = new MeshPhysicalMaterial({
  color: 0xffffff,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});
export const black = new MeshPhysicalMaterial({
  color: 0x000000,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});
export const hover = new MeshPhysicalMaterial({
  color: 0x00ff00,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});

export const selected = new MeshPhysicalMaterial({
  color: 0xff0000,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});

export const possible = new MeshPhysicalMaterial({
  color: 0x0000ff,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});

export const possibleHover = new MeshPhysicalMaterial({
  color: 0x00ffff,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});

export const possibleSelected = new MeshPhysicalMaterial({
  color: 0xff00ff,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});

export const wood = new MeshPhysicalMaterial({
  color: 0x8b4513,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});

export const woodDark = new MeshPhysicalMaterial({
  color: 0x5c3317,
  reflectivity: 0.5,
  roughness: 0.5,
  sheen: 0.9
});
