import * as THREE from 'three';
import { MeshTransmissionMaterial } from './assets/MeshTransmissionMaterial.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export default class FishBowl extends THREE.Group {
  constructor(scale = 1) {
    super();

    const bowlRadius = 100;

    const sphereGeometry = new THREE.SphereGeometry( bowlRadius, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.8 );
    sphereGeometry.rotateX(Math.PI);
    const topGeometry = new THREE.TorusGeometry( bowlRadius * 0.5, 10, 20, 100 );
    topGeometry.rotateX(Math.PI / 2);
    topGeometry.translate( 0, bowlRadius * 0.85 , 0 );
    const bottomGeometry = new THREE.CylinderGeometry( bowlRadius * 0.35, bowlRadius * 0.4,  10, 64, 32 );
    bottomGeometry.translate( 0, - bowlRadius * 0.95 , 0 );

    const bowlGeometry = BufferGeometryUtils.mergeGeometries([sphereGeometry, topGeometry, bottomGeometry]);

    bowlGeometry.scale(scale, scale, scale);

    const fishbowl = new THREE.Mesh( bowlGeometry );
    //this.geometry = bowlGeometry;
    fishbowl.material = Object.assign(new MeshTransmissionMaterial(10), {
      //side: THREE.FrontSide,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transmission: 0.9,
        chromaticAberration: 0.03,
        anisotrophicBlur: 0.45,
        // Set to > 0 for diffuse roughness
        roughness: 0,
        thickness: 4.5,
        ior: 1.5,
        // Set to > 0 for animation
        distortion: 0.4,
        distortionScale: 0.5,
        temporalDistortion: 1
      })

    const innerSphereGeometry = new THREE.SphereGeometry( bowlRadius * 0.99, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.8 );
    innerSphereGeometry.rotateX(Math.PI);
    const inner = new THREE.Mesh( innerSphereGeometry );
    inner.material = Object.assign(new MeshTransmissionMaterial(10), {
        side: THREE.BackSide,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transmission: 0.6,
        chromaticAberration: 0,
        anisotrophicBlur: 0.45,
        // Set to > 0 for diffuse roughness
        roughness: 0,
        thickness: 0,
        ior: 1,
        // Set to > 0 for animation
        distortion: 0,
        distortionScale: 0,
        temporalDistortion: 0,
      })

    this.add(fishbowl);
    this.add(inner);
  }
}

