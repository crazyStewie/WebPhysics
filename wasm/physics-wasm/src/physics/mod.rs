use nalgebra as na;
use ncollide3d::shape;
use nphysics3d::object::{BodyPartHandle,ColliderDesc, Body, DefaultBodySet, DefaultColliderSet, RigidBodyDesc, BodyStatus};
use nphysics3d::world::{DefaultGeometricalWorld, DefaultMechanicalWorld};
use nphysics3d::joint::DefaultJointConstraintSet;
use nphysics3d::force_generator::DefaultForceGeneratorSet;
use wasm_bindgen::prelude::*;
pub mod physics_body;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

#[wasm_bindgen(js_namespace = THREE, module = "three")]
extern "C" {
    pub type Vector3;

    #[wasm_bindgen(constructor)]
    fn new(x : f32, y:f32, z:f32) -> Vector3;
    #[wasm_bindgen(method, getter)]
    fn x(this : &Vector3) -> f32;
    #[wasm_bindgen(method, getter)]
    fn y(this : &Vector3) -> f32;
    #[wasm_bindgen(method, getter)]
    fn z(this : &Vector3) -> f32;
}

#[wasm_bindgen]
pub struct PhysicsServer3d {
    world : PhysicalWorld,
}

#[wasm_bindgen]
impl PhysicsServer3d {
    pub fn new() -> Self {
        let mut result = Self {
            world : PhysicalWorld::new(),
        };
        return result;
    }
    pub fn update(&mut self) {
        self.world.update();
    }
    pub fn new_physics_body(&mut self, body_type: physics_body::BodyType) -> physics_body::PhysicsBody{
        let mut rigid_body = RigidBodyDesc::<f32>::new().build();
        match body_type {
            physics_body::BodyType::Dynamic => rigid_body.set_status(BodyStatus::Dynamic),
            physics_body::BodyType::Kinematic => rigid_body.set_status(BodyStatus::Kinematic),
            physics_body::BodyType::Static => rigid_body.set_status(BodyStatus::Static),
        }
        let handle = self.world.bodies.insert(rigid_body);
        let shape = shape::ShapeHandle::new(shape::Cuboid::new(na::Vector3::new(1f32, 1f32, 1f32)));
        let collider = ColliderDesc::new(shape).density(1.0).build(BodyPartHandle(handle, 0));
        self.world.colliders.insert(collider);
        return physics_body::PhysicsBody::new(handle);
    }

    pub fn get_body_position(&mut self, body: &physics_body::PhysicsBody) -> Vector3 {
        let rigid_body = self.world.bodies.rigid_body(*body.get_handle()).unwrap();
        let translation = rigid_body.position().translation;
        return Vector3::new(translation.x, translation.y, translation.z);
    }
    pub fn set_body_position(&mut self, body: &physics_body::PhysicsBody, position : Vector3) {
        log(format!("({}, {}, {})", position.x(), position.y(), position.z()).as_str());
        let rigid_body = self.world.bodies.rigid_body_mut(*body.get_handle()).unwrap();
        let old_isometry = rigid_body.position();
        let mut new_isometry = *old_isometry;
        new_isometry.translation = na::Translation3::from(na::Vector3::new(position.x(), position.y(), position.z()));
        rigid_body.set_position(new_isometry);

    }
}

struct PhysicalWorld {
    mechanical_world : DefaultMechanicalWorld<f32>,
    geometrical_world : DefaultGeometricalWorld<f32>,
    bodies : DefaultBodySet<f32>,
    colliders : DefaultColliderSet<f32>,
    joint_constraints : DefaultJointConstraintSet<f32>,
    force_generators : DefaultForceGeneratorSet<f32>,
}

impl PhysicalWorld {
    fn new() -> Self {
        Self {
            mechanical_world : DefaultMechanicalWorld::new(na::Vector3::new(0.0, -9.81, 0.0)),
            geometrical_world : DefaultGeometricalWorld::new(),
            bodies : DefaultBodySet::new(),
            colliders : DefaultColliderSet::new(),
            joint_constraints : DefaultJointConstraintSet::new(),
            force_generators : DefaultForceGeneratorSet::new(),
        }
    }
    pub fn update(&mut self) {
        log("Updating");
        self.mechanical_world.step(
            &mut self.geometrical_world, 
            &mut self.bodies, 
            &mut self.colliders, 
            &mut self.joint_constraints, 
            &mut self.force_generators);
    }

}