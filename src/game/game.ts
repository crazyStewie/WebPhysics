import * as THREE from "three";
import * as wasm from "../../wasm/physics-wasm/pkg"

class GameObject {
    parent: GameObject | null;
    children : GameObject[];
    constructor(parent: GameObject | null) {
        this.parent = parent;
        this.children = [];
        if(this.parent) {
            this.parent.children.push(this);
        }
    }

    _update(delta: number) {
        this.update(delta)
        this.children.forEach(function(child){
            child._update(delta);
        })
    }

    update(delta: number) {
        
    }
}

class MeshGameObject extends GameObject{
    mesh : THREE.Mesh;
    constructor(mesh: THREE.Mesh,scene: THREE.Scene, parent: GameObject | null) {
        super(parent);
        this.mesh = mesh;
        if (this.parent instanceof MeshGameObject) {
            this.parent.mesh.add(this.mesh)
        }
        else {
            scene.add(this.mesh);
        }
    }
}

class MyCube extends MeshGameObject {
    lifetime : number
    constructor(scene: THREE.Scene, parent: GameObject | null, color : THREE.Color = new THREE.Color(0xffffff)) {
        let geometry = new THREE.BoxGeometry()
        let material = new THREE.MeshBasicMaterial({color : color})
        let mesh = new THREE.Mesh(geometry, material);
        super(mesh, scene, parent);
        this.lifetime = 0
    }

    update(delta:number) {
        this.mesh.rotation.x += 5*delta;
        this.mesh.rotation.y += 3*delta;
        this.lifetime += delta;
        this.mesh.position.y = 2*Math.sin(2*this.lifetime);
        this.mesh.position.x = 2*Math.cos(2*this.lifetime);
    }
}

class Game {
    parentElement : Element;
    renderer : THREE.WebGLRenderer;
    camera : THREE.Camera;
    scene : THREE.Scene;
    width : number;
    height: number;
    resizeObserver: ResizeObserver;
    gameRoot : GameObject;
    gameClock : THREE.Clock;
    physicsServer3d : wasm.PhysicsServer3d;

    constructor(parent : Element) {
        this.physicsServer3d = wasm.PhysicsServer3d.new();

        this.parentElement = parent;
        this.width = Math.floor(this.parentElement.clientWidth/16)*16;
        this.height = this.width*9/16;
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width/this.height, 0.1, 1000);
        this.parentElement.appendChild(this.renderer.domElement);
        this.resizeObserver = new ResizeObserver(this._resize_callback);
        this.resizeObserver.observe(this.parentElement);
        this.gameClock = new THREE.Clock();

        this.gameRoot = new MyCube(this.scene, null);
        this.gameClock.start();
        this.camera.position.z = 5;
    }
    _resize_callback = () => {
        this.width = Math.floor(this.parentElement.clientWidth/16)*16;
        this.height = this.width*(9/16);
        this.renderer.setSize(this.width, this.height);
    }
    run = () => {
        requestAnimationFrame(this.run);
        this.gameRoot._update(this.gameClock.getDelta());
        this.renderer.render(this.scene, this.camera);
    }
}

export {Game};