import * as THREE from "three";
import * as base from "./base";
import * as physics from "./physics";
import * as wasm from "../../wasm/physics-wasm/pkg"

class Cube extends base.MeshObject {
    size : number;

    constructor(parent : base.GameObject | null, size: number) {
        let geometry = new THREE.BoxBufferGeometry(size, size, size);
        let material = new THREE.MeshBasicMaterial({color : 0xffffff});
        let mesh = new THREE.Mesh(geometry, material);
        super(parent, mesh);
        this.size = size;

    }
    update(delta : number) {
    }
}

class mygame extends base.Game {
    testbody1 : wasm.PhysicsBody;
    testbody2 : wasm.PhysicsBody;
    constructor(parent: Element) {
        super(parent)

        let floor_physics = new physics.PhysicsObject(this.gameRoot, wasm.BodyType.Static);
        let floor_graphics = new Cube(floor_physics, 2);
        floor_physics.set_global_transform(new THREE.Matrix4().setPosition(new THREE.Vector3(0, -2, 0)))

        let box_physics = new physics.PhysicsObject(this.gameRoot, wasm.BodyType.Dynamic);
        let box_graphics = new Cube(box_physics, 2);
        box_physics.set_global_transform(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 2, 0)))

    }
    step() {
        super.step();
    }
}

export {mygame};