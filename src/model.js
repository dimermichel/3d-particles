import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

class Model {
    constructor (obj) {
        // console.log(obj);
        this.name = obj.name;
        this.file = obj.file;
        this.scene = obj.scene;
        this.placeOnLoad = obj.placeOnLoad; 
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath( './draco/' );
        this.loader.setDRACOLoader( this.dracoLoader );

        this.init();
    }

    init() {
        this.loader.load(this.file, (response) => {
            /*------------------------------
            Original Mesh
            ------------------------------*/
            this.mesh = response.scene.children[0];

            /*------------------------------
            Material Mesh
            ------------------------------*/
            this.material = new THREE.MeshBasicMaterial({
                color: 'red',
                wireframe: true
            });
            this.mesh.material = this.material;

            /*------------------------------
            Geometry Mesh
            ------------------------------*/
            this.geometry = this.mesh.geometry;

            /*------------------------------
            Particles Material
            ------------------------------*/
            this.particlesMaterial = new THREE.PointsMaterial( { 
                color: 'red', 
                size: 0.02
            } );


            /*------------------------------
            Particles Geometry
            ------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build();
            const numParticles = 20000;
            this.particlesGeometry = new THREE.BufferGeometry();
            const particlesPosition = new Float32Array(numParticles * 3);

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3;
                sampler.sample(newPosition);
                particlesPosition.set([
                    newPosition.x, // 0 - 3
                    newPosition.y, // 1 - 4
                    newPosition.z  // 2 - 5
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position',
            new THREE.BufferAttribute(particlesPosition, 3));

            console.log(this.particlesGeometry);


            /*------------------------------
            Particles
            ------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);


            // Place On Load
            this.placeOnLoad && this.add();
        });
    }

    add() {
        this.scene.add(this.particles);
    }

    remove() {
        this.scene.remove(this.particles);
    }
}

export default Model;