use nalgebra::Vector3;
use nphysics3d::object::{DefaultBodySet, DefaultColliderSet};
use nphysics3d::world::{DefaultGeometricalWorld, DefaultMechanicalWorld};
use nphysics3d::joint::DefaultJointConstraintSet;
use nphysics3d::force_generator::DefaultForceGeneratorSet;
use wasm_bindgen::prelude::*;
pub mod shapes;

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
}

struct PhysicalWorld {
    pub mechanical_world : DefaultMechanicalWorld<f32>,
    pub geometrical_world : DefaultGeometricalWorld<f32>,
    pub bodies : DefaultBodySet<f32>,
    pub colliders : DefaultColliderSet<f32>,
    pub joint_constraints : DefaultJointConstraintSet<f32>,
    pub force_generators : DefaultForceGeneratorSet<f32>,
}

#[wasm_bindgen]
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
    fn update(&mut self) {
        self.mechanical_world.step(
            &mut self.geometrical_world, 
            &mut self.bodies, 
            &mut self.colliders, 
            &mut self.joint_constraints, 
            &mut self.force_generators);
    }
}