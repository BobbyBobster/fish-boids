import * as THREE from 'three';
import Flock from './flock.js';
import FishBowl from './fishbowl.js'

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const helpers = new THREE.Group()


/* Scene */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.set(100, 100, 100);

const path = './assets/Bridge2/';
const format = '.jpg';
const urls = [
  path + 'posx' + format, path + 'negx' + format,
  path + 'posy' + format, path + 'negy' + format,
  path + 'posz' + format, path + 'negz' + format
];
const textureCube = new THREE.CubeTextureLoader().load( urls );
scene.background = textureCube;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);



/* Lighting */
const spotLight = new THREE.SpotLight( 0xffffff, 0.5, 500, Math.PI / 5, 0.3 );
spotLight.position.set(0, 200, 300);
spotLight.castShadow = true;
helpers.add(new THREE.SpotLightHelper(spotLight));
scene.add(spotLight);

const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5);
dirLight.castShadow = true;
dirLight.position.set(200, 300, 200);
helpers.add(new THREE.DirectionalLightHelper(dirLight));
scene.add(dirLight);



/* Adding objects */
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(500, 500, 500),
  new THREE.MeshPhongMaterial({ 
    color: 0x87ceeb, 
    emissive: 0x585858,
    shininess: 20, 
    specular: 0xeeeeee, 
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  })
);
scene.add(walls);
helpers.add(new THREE.BoxHelper(walls, 0x2200dd))

const fishbowl = new FishBowl();
scene.add( fishbowl );
helpers.add(new THREE.BoxHelper(fishbowl, 0xdd00dd));

const flock = new Flock(scene, 500);



/* Controls */
helpers.visible = false;
scene.add(helpers);

const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 60;
controls.maxDistance = 180;
controls.minPolarAngle = Math.PI / 5;
controls.maxPolarAngle = Math.PI / 1.5;
controls.minAzimuthAngle = - Math.PI / 1.5;
controls.maxAzimuthAngle = Math.PI / 1.5;
controls.update();

const gui = new GUI();
const params = {
  neighbor_radius: 10,
  separation_radius: 5,
  alignment_factor: 0.1,
  cohesion_factor: 0.01,
  showFishBowl: true,
  showHelpers: false,
};
gui.add(params, 'neighbor_radius', 1, 30).step(1).name('neighbor radius').onChange((value) => { Flock.Boid.NEIGHBOR_RADIUS = value; });
gui.add(params, 'separation_radius', 1, 20).step(1).name('separation radius').onChange((value) => { Flock.Boid.SEPARATION_RADIUS = value; });
gui.add(params, 'alignment_factor', -0.05, 1).step(0.05).name('alignment factor').onChange((value) => { Flock.Boid.ALIGNMENT_FACTOR = value; });
gui.add(params, 'cohesion_factor', -0.02, 0.1).step(0.01).name('cohesion factor').onChange((value) => { Flock.Boid.COHESION_FACTOR = value; });
gui.add(params, 'showFishBowl').name('showfishbowl').onChange((value) => { fishbowl.visible = value; });
gui.add(params, 'showHelpers').name('show helpers').onChange((value) => { helpers.visible = value; });



/* Animation */
const clock = new THREE.Clock();

function animate() {
  const deltaTime = clock.getDelta();
  flock.update(deltaTime*5);

	renderer.render(scene, camera);
}

