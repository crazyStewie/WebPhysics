import * as THREE from "three";

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
        this.update(delta);
        this._update_children(delta);
    }

    _update_children(delta: number) {
        this.children.forEach(function(child){
            child._update(delta);
        });
    }

    update(delta: number) {
        
    }
}

class GameObject3d extends GameObject {
    transform : THREE.Matrix4;
    private _global_transform : THREE.Matrix4;
    constructor(parent: GameObject | null) {
        super(parent);
        this.transform = new THREE.Matrix4();
        this._global_transform = new THREE.Matrix4();
        if (this.parent instanceof GameObject3d ) {
            this._global_transform.multiplyMatrices(this.parent._global_transform, this.transform)
        }
    }

    _update(delta: number) {
        this.update(delta);
        if (this.parent instanceof GameObject3d) {
            this._global_transform.multiplyMatrices(this.parent._global_transform, this.transform)
        }
        super._update_children(delta);
    }

    get_global_transform() : THREE.Matrix4 {
        return this._global_transform;
    }
}

class MeshObject extends GameObject3d {
    mesh : THREE.Mesh;
    constructor(parent:GameObject | null, mesh: THREE.Mesh) {
        super(parent);
        this.mesh = mesh;
        this.mesh.matrixAutoUpdate = false;
        this.mesh.matrix = this.transform
        this.mesh.matrixWorld = this.get_global_transform();
        let parent_scene = this.parent;
        while (!(parent_scene instanceof SceneObject || parent_scene instanceof MeshObject)) {
            if (!parent_scene || !parent_scene.parent)
                throw new Error("No scene to instantiate object in");
            parent_scene = parent_scene.parent;
        }
        if (parent_scene instanceof SceneObject){
            parent_scene.scene.add(this.mesh);
        }
        else {
            parent_scene.mesh.add(this.mesh);
        }
    }

    _update(delta: number) {
        super._update(delta);
        this.mesh.matrixWorld = this.get_global_transform();
        this.mesh.matrix = this.transform;
    }
}

class SceneObject extends GameObject {
    scene: THREE.Scene
    constructor(parent : GameObject | null) {
        super(parent);
        this.scene = new THREE.Scene();
    }
}
export {GameObject, GameObject3d, MeshObject, SceneObject}