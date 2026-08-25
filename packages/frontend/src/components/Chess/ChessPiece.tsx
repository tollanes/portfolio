"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import StandardMesh from "@components/3D/StandardMesh";
import { Piece, PieceColor } from "@lib/BoardGame/Piece";
import { Vector3 } from "three";
import { black, hover, selected, white } from "@lib/BoardGame/Materials";
import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { ChessContext } from "@components/Chess/chessProvider";

const ChessPiece = observer(({ piece, onPieceClick }: { piece: Piece; onPieceClick?: (piece: Piece) => void }) => {
  const gltf = useLoader(GLTFLoader, `/models/${piece.type}.glb`);
  const { game, board } = useContext(ChessContext);

  const [isHovered, setIsHovered] = useState(false);

  if (!board) {
    return null;
  }

  const onHover = (e: any, value: boolean) => {
    e.stopPropagation();
    setIsHovered(value);
  };

  const onClick = () => {
    handlePieceClick();
    if (onPieceClick) {
      onPieceClick(piece);
    }
  };

  const handlePieceClick = () => {
    const isGameActive = game && board;
    const isPieceSelected = board.selectedPiece !== undefined;
    const isSameColor = board.selectedPiece?.color === piece.color;
    const isSamePiece = board.selectedPiece?.position.equals(piece.position);

    if (isGameActive && isPieceSelected && !isSamePiece && !isSameColor) {
      console.log(`Moved a piece from ${board.selectedPiece!.position.toString()} to ${piece.position.toString()}`);

      return game.movePiece(board.selectedPiece!.position, piece.position);
    }

    if (game?.currentPlayer.color !== piece.color || piece.captured) {
      return;
    }

    board.selectPiece(piece);
  };

  const getMaterial = () => {
    if (!piece.captured && board.selectedPiece?.position.equals(piece.position)) {
      return selected;
    } else if (isHovered) {
      return hover;
    } else {
      return piece.color === PieceColor.White ? white : black;
    }
  };

  return (
    <StandardMesh
      onPointerOver={(e) => onHover(e, true)}
      onPointerOut={(e) => onHover(e, false)}
      onClick={() => onClick()}
      gltf={gltf}
      position={new Vector3(piece.position.currentPosition.y / 5 - 0.7, 0, piece.position.currentPosition.x / 5 - 0.7)}
      material={getMaterial()}
    />
  );
});

export default ChessPiece;
