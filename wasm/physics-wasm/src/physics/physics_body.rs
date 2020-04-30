use nalgebra::{Vector3, Point3, Matrix3, Isometry3};
use nphysics3d::object::{BodyStatus, RigidBodyDesc, RigidBody, Collider, DefaultBodyHandle, DefaultColliderHandle};
use nphysics3d::math::{Velocity, Inertia};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PhysicsBody {
    handle : DefaultBodyHandle,
}

#[wasm_bindgen]
pub struct CollisionShape {
    handle : DefaultColliderHandle,
}

#[wasm_bindgen]
pub enum BodyType {
    Static,
    Dynamic,
    Kinematic,
}
