use nalgebra::{Vector3, Point3, Matrix3, Isometry3};
use nphysics3d::object::{BodyStatus, RigidBodyDesc, RigidBody, Collider, DefaultBodyHandle, DefaultColliderHandle};
use nphysics3d::math::{Velocity, Inertia};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PhysicsBody {
    handle : DefaultBodyHandle,
}

impl PhysicsBody {
    pub fn new(handle : DefaultBodyHandle) -> Self {
        return Self{
            handle,
        }
    }
    pub fn get_handle(&self) -> &DefaultBodyHandle {
        return &self.handle;
    }
}

#[wasm_bindgen]
pub enum BodyType {
    Static,
    Dynamic,
    Kinematic,
}
