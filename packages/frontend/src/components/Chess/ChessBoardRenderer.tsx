"use client";

import Renderer from "@components/3D/Renderer";
import Lighting from "@components/3D/Lighting";
import Controls from "@components/3D/Controls";

import ChessTilesMesh from "@components/Chess/ChessTilesMesh";
import ChessBoardBaseMesh from "@components/Chess/ChessBoardBaseMesh";
import ChessPieces from "@components/Chess/ChessPieces";
import CapturedPieces from "@components/Chess/CapturedPieces";

const ChessBoardRenderer = () => (
  <Renderer>
    <Lighting />
    <Controls />
    <ChessBoardBaseMesh />
    <ChessTilesMesh />
    <ChessPieces />
    <CapturedPieces />
  </Renderer>
);

export default ChessBoardRenderer;
