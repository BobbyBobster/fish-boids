import * as THREE from 'three';
import { createFishGeometry, createFishMaterial } from './assets/fish.js';
const fishGeometry = createFishGeometry();
fishGeometry.scale(0.3, 0.3, 0.3);
const fishMaterial = createFishMaterial();

export default class Boid {
  static MAX_VELOCITY = 4;
  static MIN_VELOCITY = 1;
  static NEIGHBOR_RADIUS = 10;
  static SEPARATION_RADIUS = 5;

  static ALIGNMENT_FACTOR = 0.1;
  static COHESION_FACTOR = 0.01;

  constructor(scene, position = new THREE.Vector3(), velocity = new THREE.Vector3()) {
    this.position = position.clone();
    this.velocity = velocity.clone().normalize().multiplyScalar(Boid.MIN_VELOCITY);

    let fishSize = new THREE.Box3().setFromBufferAttribute(fishGeometry.attributes.position);
    fishMaterial.userData.uniforms.totalLength.value = fishSize.max.x;

    this.mesh = new THREE.Mesh(
      //new THREE.ConeGeometry(0.2, 1, 8),
      fishGeometry,
      //fishMaterial,
      new THREE.MeshNormalMaterial(),
      //new THREE.MeshPhongMaterial( { color: 0x999999, shininess: 0, specular: 0x222222 } ),
    );
    //this.mesh.rotation.x = Math.PI / 2; // Make the cone face forward
    scene.add(this.mesh);
  }



  update(boids, deltaTime, centrism = new THREE.Vector3(0, 0, 0)) {
    const separation = new THREE.Vector3();
    const alignment = new THREE.Vector3();
    const cohesion = new THREE.Vector3();
    let neighborCount = 0;

    // Flocking behavior
    for (const other of boids) {
      if (other === this) continue;

      const distance = this.position.distanceTo(other.position);
      if (distance < Boid.NEIGHBOR_RADIUS) {
        // Separation: Avoid overcrowding
        if (distance < Boid.SEPARATION_RADIUS) {
          const diff = this.position.clone().sub(other.position).normalize().divideScalar(distance);
          separation.add(diff);
        }

        // Alignment: Match velocity
        alignment.add(other.velocity);

        // Cohesion: Move toward group center
        cohesion.add(other.position);

        neighborCount++;
      }
    }

    if (neighborCount > 0) {
      alignment.divideScalar(neighborCount).sub(this.velocity).multiplyScalar(Boid.ALIGNMENT_FACTOR);
      cohesion.divideScalar(neighborCount).sub(this.position).multiplyScalar(Boid.COHESION_FACTOR);
    }


    let centrismForce = new THREE.Vector3(0, 0, 0);
    // TODO: Remove hardcoded dependency on "fishbowl" size.
    if (this.position.length() > 90 || this.position.y > 75) {
      const forceMultiplier = THREE.MathUtils.clamp(Math.random() * 0.01, 0.005, 0.01);
      centrismForce = centrism.clone().sub(this.position).multiplyScalar(forceMultiplier);
    }

    this.velocity.add(separation).add(alignment).add(cohesion).add(centrismForce);
    this.velocity.clampLength(Boid.MIN_VELOCITY, Boid.MAX_VELOCITY);
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    // Align rotation with velocity
    this.alignWithVelocity();
  }

  // Smoothly align rotation to velocity using quaternion slerp
  alignWithVelocity() {
    if (this.velocity.lengthSq() === 0) return;

    //const forward = new THREE.Vector3(0, 1, 0); // Default forward direction of the Cone mesh
    const forward = new THREE.Vector3(-1, 0, 0); // Default forward direction of the Fish mesh
    const direction = this.velocity.clone().normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(forward, direction);

    // Smoothly rotate toward the target
    this.mesh.quaternion.slerp(targetQuaternion, 0.1);
    this.mesh.position.copy(this.position);
  }
}

