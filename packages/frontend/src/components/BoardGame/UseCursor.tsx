import { useRef, useState } from "react";
import { Group, Raycaster, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

const useCursor = () => {
  const meshRef = useRef<Group>(null);
  const [selected, setSelected] = useState(false);
  const { camera, mouse } = useThree();
  const cursorPosition = new Vector3();

  const handleClick = () => {
    setSelected(!selected);
  };

  useFrame(() => {
    if (meshRef.current && selected) {
      // Calculate the cursor position in world coordinates
      cursorPosition.set(mouse.x, mouse.y, 0);
      cursorPosition.unproject(camera);

      // Calculate the direction from the cursor position to the camera
      const direction = cursorPosition.clone().sub(camera.position).normalize();

      // Calculate the target position based on the initial distance and direction
      const initialDistance = meshRef.current.position.distanceTo(camera.position);
      const targetPosition = camera.position.clone().add(direction.multiplyScalar(initialDistance));

      // Restrict movement to the horizontal plane
      targetPosition.y = meshRef.current.position.y;

      // Update the position of the chess piece to the target position
      meshRef.current.position.copy(targetPosition);
    }
  });

  return { selected, handleClick, meshRef };
};

export default useCursor;
