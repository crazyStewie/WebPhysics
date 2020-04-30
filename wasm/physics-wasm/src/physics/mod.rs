use nalgebra::Vector3;
use nphysics3d::object::{DefaultBodySet, DefaultColliderSet};
use nphysics3d::world::{DefaultGeometricalWorld, DefaultMechanicalWorld};
use nphysics3d::joint::DefaultJointConstraintSet;
use nphysics3d::force_generator::DefaultForceGeneratorSet;
use wasm_bindgen::prelude::*;
pub mod shapes;
pub mod physics_body;

#[wasm_bindgen]
pub struct PhysicsServer3d {
    world : PhysicalWorld,
}

#[wasm_bindgen]
impl PhysicsServer3d {
    pub fn new() -> Self {
        Self {
            world : PhysicalWorld::new(),
        }
    }
    pub fn update(&mut self) {
        self.world.update();
    }
    pub fn new_physics_body() {
        
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
            mechanical_world : DefaultMechanicalWorld::new(Vector3::new(0.0, -9.81, 0.0)),
            geometrical_world : DefaultGeometricalWorld::new(),
            bodies : DefaultBodySet::new(),
            colliders : DefaultColliderSet::new(),
            joint_constraints : DefaultJointConstraintSet::new(),
            force_generators : DefaultForceGeneratorSet::new(),
        }
    }
    pub fn update(&mut self) {
        self.mechanical_world.step(
            &mut self.geometrical_world, 
            &mut self.bodies, 
            &mut self.colliders, 
            &mut self.joint_constraints, 
            &mut self.force_generators);
    }

}