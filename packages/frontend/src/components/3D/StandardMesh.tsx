"use client";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ReactNode, Ref } from "react";
import { ObjectMap, ThreeEvent } from "@react-three/fiber";
import { Vector3, Euler, Mesh, Material, Group } from "three";
import { observer } from "mobx-react-lite";

const StandardMesh = observer(
  ({
    meshRef,
    onPointerOver,
    onPointerOut,
    onClick,
    children,
    gltf,
    material,
    position = new Vector3(0, 0, 0),
    rotation = new Euler(0, 0, 0),
    scale = new Vector3(1, 1, 1)
  }: {
    meshRef?: Ref<Group>;
    onPointerOver?: (e: any) => void;
    onPointerOut?: (e: any) => void;
    onClick?: (e: ThreeEvent<MouseEvent>) => void;
    children?: ReactNode;
    gltf: GLTF & ObjectMap;
    material?: Material;
    position?: Vector3;
    rotation?: Euler;
    scale?: Vector3;
  }) => {
    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <group ref={meshRef} position={position} rotation={rotation} scale={scale.multiplyScalar(10)}>
        {gltf.nodes &&
          Object.keys(gltf.nodes).map((key, index) => {
            const node = gltf.nodes[key] as Mesh;
            if (!node || !node.geometry) {
              return;
            }

            return (
              <mesh
                key={index}
                onPointerOver={onPointerOver ? onPointerOver : undefined}
                onPointerOut={onPointerOut ? onPointerOut : undefined}
                onClick={handleClick}
                receiveShadow
                castShadow
                geometry={node.geometry}
                material={material ? material : node.material}
              >
                {children}
              </mesh>
            );
          })}
      </group>
    );
  }
);

export default StandardMesh;
