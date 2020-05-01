import * as THREE from "three";
import * as wasm from "../../wasm/physics-wasm/pkg"
import { Matrix4, Vector3 } from "three";

class Game {
    parentElement : Element;
    renderer : THREE.WebGLRenderer;
    camera : THREE.Camera;
    width : number;
    height: number;
    resizeObserver: ResizeObserver;
    gameRoot : RootObject;
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
        this.camera.position.z = 8;
        this.gameRoot = new RootObject(this);
    }
    _resize_callback = () => {
        this.width = Math.floor(this.parentElement.clientWidth/16)*16;
        this.height = this.width*(9/16);
        this.renderer.setSize(this.width, this.height);
    }
    step() {
        this.gameRoot._step(this.gameClock.getDelta());
        this.physicsServer3d.update();
        this.renderer.render(this.gameRoot.scene, this.camera);
    }
}

class GameObject {
    parent: GameObject | null;
    children : GameObject[];
    public static game : Game;
    constructor(parent: GameObject | null) {
        this.parent = parent;
        this.children = [];
        if(this.parent) {
            this.parent.children.push(this);
        }
    }

    _step(delta : number) {
        this._update(delta);
        this._update_children(delta);
    }

    _update(delta: number) {
        this.update(delta);
    }

    _update_children(delta: number) {
        this.children.forEach(function(child){
            child._step(delta);
        });
    }

    update(delta: number) {
        
    }
}

class GameObject3d extends GameObject {
    private transform : THREE.Matrix4;
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
        super._update(delta);
        if (this.parent instanceof GameObject3d) {
            this._global_transform.multiplyMatrices(this.parent._global_transform, this.transform)
        }
    }

    get_transform() : THREE.Matrix4 {
        let result = new Matrix4().premultiply(this.transform);
        return result
    }

    set_transform(new_transform : THREE.Matrix4) {
        this.transform.identity().premultiply(new_transform);
        let new_children_global_transform = new THREE.Matrix4().multiplyMatrices(this._global_transform, this.transform);
        this.children.forEach(function(child) {
            if (child instanceof GameObject3d) {
                child.set_global_transform(new_children_global_transform);
            }
        })
    }

    get_global_transform() : THREE.Matrix4 {
        let result = new Matrix4().premultiply(this._global_transform);
        return result;
    }

    set_global_transform(new_transform : THREE.Matrix4) {
        this._global_transform.identity().premultiply(new_transform);
        if (this.parent instanceof GameObject3d){
            let reverse_parent = new THREE.Matrix4().getInverse(this.parent._global_transform);
            this.transform.multiplyMatrices(this._global_transform, reverse_parent);
        }
        else {
            this.transform.identity().premultiply(this._global_transform);
        }
        this.children.forEach(function (child) {
            if (child instanceof GameObject3d) {
                child.set_global_transform(new THREE.Matrix4().multiplyMatrices(new_transform, child.transform));
            }
        })
    } 
}

class MeshObject extends GameObject3d {
    mesh : THREE.Mesh;
    constructor(parent:GameObject | null, mesh: THREE.Mesh) {
        super(parent);
        this.mesh = mesh;
        this.mesh.matrixAutoUpdate = false;
        this.mesh.matrix = this.get_transform();
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
        this.mesh.matrix = this.get_global_transform();
        
    }
}

class SceneObject extends GameObject {
    scene: THREE.Scene
    constructor(parent : GameObject | null) {
        super(parent);
        this.scene = new THREE.Scene();
    }
}

class RootObject extends SceneObject {
    constructor(game: Game) {
        super(null);
        GameObject.game = game;
    }
}
export {Game, GameObject, GameObject3d, MeshObject, SceneObject}