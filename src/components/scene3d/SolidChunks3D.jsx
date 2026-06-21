import { useRef, useMemo } from "react";
import * as THREE from "three";

const SOLID_COLORS = {
  // 金属 (银白/紫红)
  Na: "#c0c0c0",
  K: "#b8b8b8",
  Mg: "#d0d0d0",
  Al: "#c8c8c8",
  Fe: "#707070",
  Fe_powder: "#484848",
  Zn: "#a8b0b8",
  Cu: "#b87333",
  Ag: "#c0c0c0",
  // 非金属
  C: "#1a1a1a",
  S: "#e8c820",
  P: "#a03020",
  Si: "#606870",
  I2: "#2d1a4e",
  // 盐 (白色为主)
  NaCl: "#f8f6f0",
  Na2CO3: "#f5f2ec",
  NaHCO3: "#f8f6f0",
  CaCO3: "#f0ede8",
  BaCO3: "#f0ede8",
  AgNO3: "#f0ede8",
  BaCl2: "#f0ede8",
  BaNO32: "#f0ede8",
  CaCl2: "#f0ede8",
  CuSO4: "#5b9ec9",
  CuNO32: "#4a8db5",
  FeSO4: "#7db87d",
  Fe2SO43: "#c8a050",
  FeCl3: "#a07828",
  FeCl2: "#88b088",
  FeNO33: "#c0a060",
  AlCl3: "#f0ede8",
  Al2SO43: "#f0ede8",
  Na2SO4: "#f0ede8",
  Na2SiO3: "#f0ede8",
  NaAlO2: "#f0ede8",
  KI: "#f0ede8",
  KCl: "#f0ede8",
  KClO3: "#f0ede8",
  KMnO4: "#6b21a8",
  K2MnO4: "#3d7a3d",
  K2CrO4: "#d4a017",
  K2Cr2O7: "#c0501d",
  NH4Cl: "#f0ede8",
  NH42SO4: "#f0ede8",
  NH4NO3: "#f0ede8",
  NH4HCO3: "#f0ede8",
  Na2S: "#f0ede8",
  Na2SO3: "#f0ede8",
  KSCN: "#f0ede8",
  PbNO32: "#f0ede8",
  FeS: "#4a3c30",
  CuCl2: "#4a8a5a",
  MgCl2: "#f0ede8",
  ZnSO4: "#f0ede8",
  ZnCl2: "#f0ede8",
  MnSO4: "#e8b0b0",
  // 碱 (白色/有色)
  NaOH: "#f0ede8",
  KOH: "#f0ede8",
  CaOH2: "#f5f2ec",
  BaOH2: "#f0ede8",
  MgOH2: "#f8f6f0",
  AlOH3: "#f0ede8",
  FeOH3: "#8b4513",
  FeOH2: "#90c890",
  CuOH2: "#4169e1",
  ZnOH2: "#f0ede8",
  // 氧化物
  CaO: "#f0ede8",
  Na2O: "#f0ede8",
  Na2O2: "#e0d080",
  MgO: "#f0ede8",
  Fe2O3: "#8b2500",
  Fe3O4: "#1a1a1a",
  CuO: "#1a1a1a",
  ZnO: "#f0ede8",
  Al2O3: "#f0ede8",
  MnO2: "#1a1a1a",
  SiO2: "#e8e4dc",
  P2O5: "#f0ede8",
  // 沉淀产物
  AgCl: "#f0ede8",
  BaSO4: "#f0ede8",
  CaSiO3: "#e8e4dc",
};

const PHASE_MAP = {
  Na: "solid", K: "solid", Mg: "solid", Al: "solid", Fe: "solid",
  Fe_powder: "solid", Zn: "solid", Cu: "solid", Ag: "solid",
  C: "solid", S: "solid", P: "solid", Si: "solid", I2: "solid",
  NaCl: "solid", Na2CO3: "solid", NaHCO3: "solid", CaCO3: "solid",
  BaCO3: "solid", AgNO3: "solid", BaCl2: "solid", CaCl2: "solid",
  CuSO4: "solid", FeSO4: "solid", FeCl3: "solid", FeCl2: "solid",
  AlCl3: "solid", Na2SO4: "solid", KI: "solid", KCl: "solid",
  KClO3: "solid", KMnO4: "solid", NH4Cl: "solid", Na2S: "solid",
  Na2SO3: "solid", KSCN: "solid", PbNO32: "solid",
  CaO: "solid", Na2O: "solid", Na2O2: "solid", MgO: "solid",
  Fe2O3: "solid", Fe3O4: "solid", CuO: "solid", ZnO: "solid",
  Al2O3: "solid", MnO2: "solid", SiO2: "solid",
};

function isSolid(id) {
  return PHASE_MAP[id] === "solid";
}

function getColor(id) {
  return SOLID_COLORS[id] || "#aaaaaa";
}

export default function SolidChunks3D({ contents, liquidHeight }) {
  const solidReagents = useMemo(() => contents.filter(isSolid), [contents]);

  const chunks = useMemo(() => {
    return solidReagents.map((id, i) => {
      const color = getColor(id);
      const baseY = -0.55;
      const angle = (i / Math.max(solidReagents.length, 1)) * Math.PI * 2;
      const dist = 0.1 + (i % 3) * 0.08;

      return {
        id,
        color,
        position: [
          Math.cos(angle) * dist,
          baseY + (i * 0.02) % 0.1,
          Math.sin(angle) * dist,
        ],
        size: 0.03 + (i % 3) * 0.01,
        rotation: [(i * 1.3) % Math.PI, (i * 0.7) % Math.PI, 0],
      };
    });
  }, [solidReagents]);

  if (chunks.length === 0) return null;

  return (
    <group>
      {chunks.map((chunk) => (
        <mesh
          key={chunk.id}
          position={chunk.position}
          rotation={chunk.rotation}
          castShadow
        >
          <dodecahedronGeometry args={[chunk.size, 0]} />
          <meshStandardMaterial
            color={chunk.color}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
