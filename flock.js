import Boid from './boid.js';
import * as THREE from 'three';

export default class Flock {
  static Boid = Boid;
  constructor(scene, numBoids) {
    this.boids = [];
    this.scene = scene;

    // Initialize boids at random positions and velocities
    for (let i = 0; i < numBoids; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      const velocity = position.clone();
      this.boids.push(new Boid(scene, position, velocity));
    }
  }

  update(deltaTime) {
    for (const boid of this.boids) {
      boid.update(this.boids, deltaTime, new THREE.Vector3(0, 0, 0)); // Center is (0,0,0)
    }
  }
}

