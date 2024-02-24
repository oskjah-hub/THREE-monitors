import * as THREE from "three";
import { useMemo, useContext, createContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Merged,
  RenderTexture,
  PerspectiveCamera,
  Text,
} from "@react-three/drei";
import { SpinningBox } from "./SpinningBox";
THREE.ColorManagement.legacyMode = false;

/*
Author: Rafael Rodrigues (https://sketchfab.com/RafaelBR873D)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063
Title: Old Computers
*/

const context = createContext();
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF("/computers_1-transformed.glb");
  const instances = useMemo(
    () => ({
      Object: nodes.Object_4,
      Object1: nodes.Object_16,
      Object3: nodes.Object_52,
      Object13: nodes.Object_172,
      Object14: nodes.Object_174,
      Object23: nodes.Object_22,
      Object24: nodes.Object_26,
      Object32: nodes.Object_178,
      Object36: nodes.Object_28,
      Object45: nodes.Object_206,
      Object46: nodes.Object_207,
      Object47: nodes.Object_215,
      Object48: nodes.Object_216,
      Sphere: nodes.Sphere,
    }),
    [nodes]
  );
  return (
    <Merged castShadow receiveShadow meshes={instances} {...props}>
      {(instances) => (
        <context.Provider value={instances} children={children} />
      )}
    </Merged>
  );
}

export function SingleComputer(props) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null}>
      <ScreenInteractive
        frame="Object_206"
        panel="Object_207"
        position={[0.27, 1.53, -2.61]}
      />
      {/* <ScreenText
        frame="Object_215"
        panel="Object_216"
        position={[0.27, 1.53, -2.61]}
        rotation={[0, -Math.PI / 9, 0]}
      /> */}
      <Leds instances={instances} />
    </group>
  );
}

function Screen({ frame, panel, children, ...props }) {
  const { nodes, materials } = useGLTF("/computers_1-transformed.glb");
  return (
    <group {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes[frame].geometry}
        material={materials.Texture}
      />
      <mesh geometry={nodes[panel].geometry}>
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture width={512} height={512} attach="map" anisotropy={16}>
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

/* Renders a monitor with some text */
function ScreenText({ invert, x = 0, y = 1.2, ...props }) {
  const textRef = useRef();
  const rand = Math.random() * 10000;
  // useFrame(
  //   (state) =>
  //     (textRef.current.position.x =
  //       x + Math.sin(rand + state.clock.elapsedTime / 4) * 8)
  // );
  return (
    <Screen {...props}>
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1 / 1}
        position={[0, 0, 15]}
      />
      <color attach="background" args={[invert ? "black" : "#35c19f"]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} />
      <Text
        font="/Inter-Medium.woff"
        position={[x, y, 0]}
        ref={textRef}
        fontSize={1}
        letterSpacing={-0.1}
        color={!invert ? "black" : "#35c19f"}
      >
        Upload Listen
      </Text>
    </Screen>
  );
}

/* Renders a monitor with a spinning box */
function ScreenInteractive(props) {
  return (
    <Screen {...props}>
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1 / 1}
        position={[0, 0, 10]}
      />
      <color attach="background" args={["orange"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.75} />
      <pointLight position={[-10, -10, -10]} />
      <SpinningBox position={[-3.15, 0.75, 0]} scale={0.5} />
    </Screen>
  );
}

// Renders flashing LED's
function Leds({ instances }) {
  const ref = useRef();
  const { nodes } = useGLTF("/computers_1-transformed.glb");
  useMemo(() => {
    nodes.Sphere.material = new THREE.MeshBasicMaterial();
    nodes.Sphere.material.toneMapped = false;
  }, []);
  useFrame((state) => {
    ref.current.children.forEach((instance) => {
      const rand = Math.abs(2 + instance.position.x);
      const t = Math.round(
        (1 + Math.sin(rand * 10000 + state.clock.elapsedTime * rand)) / 2
      );
      instance.color.setRGB(0, t * 1.1, t);
    });
  });
  return (
    <group ref={ref}>
      <instances.Sphere
        position={[-0.41, 1.1, -2.21]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[0.59, 1.32, -2.22]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[1.77, 1.91, -1.17]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[2.44, 1.1, -0.79]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[4.87, 3.8, -0.1]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[1.93, 3.8, -3.69]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[-2.35, 3.8, -3.48]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[-4.71, 4.59, -1.81]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[-3.03, 2.85, 1.19]}
        scale={0.005}
        color={[1, 2, 1]}
      />
      <instances.Sphere
        position={[-1.21, 1.73, -1.49]}
        scale={0.005}
        color={[1, 2, 1]}
      />
    </group>
  );
}

{
  /* <ScreenText
        invert
        frame="Object_212"
        panel="Object_213"
        x={-5}
        y={5}
        position={[-2.73, 0.63, -0.52]}
        rotation={[0, 1.09, 0]}
      />
      <ScreenText
        invert
        frame="Object_215"
        panel="Object_216"
        position={[1.84, 0.38, -1.77]}
        rotation={[0, -Math.PI / 9, 0]}
      />
      <ScreenText
        invert
        frame="Object_218"
        panel="Object_219"
        x={-5}
        position={[3.11, 2.15, -0.18]}
        rotation={[0, -0.79, 0]}
        scale={0.81}
      />
      <ScreenText
        frame="Object_221"
        panel="Object_222"
        y={5}
        position={[-3.42, 3.06, 1.3]}
        rotation={[0, 1.22, 0]}
        scale={0.9}
      />
      <ScreenText
        invert
        frame="Object_224"
        panel="Object_225"
        position={[-3.9, 4.29, -2.64]}
        rotation={[0, 0.54, 0]}
      />
      <ScreenText
        frame="Object_227"
        panel="Object_228"
        position={[0.96, 4.28, -4.2]}
        rotation={[0, -0.65, 0]}
      />
      <ScreenText
        frame="Object_230"
        panel="Object_231"
        position={[4.68, 4.29, -1.56]}
        rotation={[0, -Math.PI / 3, 0]}
      /> */
}
