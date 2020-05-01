import * as wasm from "../../wasm/physics-wasm/pkg"
import * as base from "./base"
import * as THREE from "three"


class PhysicsObject extends base.GameObject3d{
    private body_type : wasm.BodyType;
    body : wasm.PhysicsBody;
    constructor(parent: base.GameObject, type : wasm.BodyType) {
        super(parent);
        this.body_type = type;
        this.body = PhysicsObject.game.physicsServer3d.new_physics_body(this.body_type);
    }

    _update(delta: number) {
        super._update(delta);
        let new_transform = new THREE.Matrix4().premultiply((this.get_global_transform())).setPosition(PhysicsObject.game.physicsServer3d.get_body_position(this.body));
        super.set_global_transform(new_transform)
    }

    set_global_transform(new_transform : THREE.Matrix4) {
        super.set_global_transform(new_transform);
        PhysicsObject.game.physicsServer3d.set_body_position(this.body, new THREE.Vector3().setFromMatrixPosition(new_transform));
    }
}

export {PhysicsObject}