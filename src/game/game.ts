import * as THREE from "three";
import * as base from "./base";
import * as physics from "./physics";
import * as wasm from "../../wasm/physics-wasm/pkg"

class Planet extends base.MeshObject {
    radius : number;
    orbit_radius : number;
    speed : number;
    lifespan : number;
    constructor(parent : base.GameObject | null, radius: number, orbit_radius: number, speed: number) {
        let geometry = new THREE.SphereBufferGeometry(radius);
        let material = new THREE.MeshBasicMaterial({color : 0xffffff});
        let mesh = new THREE.Mesh(geometry, material);
        super(parent, mesh);
        this.radius = radius;
        this.orbit_radius = orbit_radius;
        this.speed = speed;
        this.lifespan = 0;
    }

    update(delta: number) {
        this.lifespan += delta;
        this.transform.setPosition(new THREE.Vector3(this.orbit_radius*Math.cos(this.lifespan*this.speed/this.orbit_radius), this.orbit_radius*Math.sin(this.lifespan*this.speed/this.orbit_radius), 0));
    }
    
}

class Game {
    parentElement : Element;
    renderer : THREE.WebGLRenderer;
    camera : THREE.Camera;
    width : number;
    height: number;
    resizeObserver: ResizeObserver;
    gameRoot : base.SceneObject;
    gameClock : THREE.Clock;
    physicsServer3d : wasm.PhysicsServer3d;

    constructor(parent : Element) {
        this.physicsServer3d = wasm.PhysicsServer3d.new();

        this.parentElement = parent;
        this.width = Math.floor(this.parentElement.clientWidth/16)*16;
        this.height = this.width*9/16;
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(75, this.width/this.height, 0.1, 1000);
        this.parentElement.appendChild(this.renderer.domElement);
        this.resizeObserver = new ResizeObserver(this._resize_callback);
        this.resizeObserver.observe(this.parentElement);
        this.gameClock = new THREE.Clock();
        this.gameClock.start();
        this.camera.position.z = 5;
        this.gameRoot = new base.SceneObject(null);
        let sun = new Planet(this.gameRoot, 1, 0, 0);
        let planet = new Planet(sun, 0.4, 3, 3);
        let moon = new Planet(planet, 0.2, 1, 4);
    }
    _resize_callback = () => {
        this.width = Math.floor(this.parentElement.clientWidth/16)*16;
        this.height = this.width*(9/16);
        this.renderer.setSize(this.width, this.height);
    }
    run = () => {
        requestAnimationFrame(this.run);
        this.gameRoot._update(this.gameClock.getDelta());
        this.renderer.render(this.gameRoot.scene, this.camera);
    }
}

export {Game};