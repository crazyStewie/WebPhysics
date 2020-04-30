use wasm_bindgen::prelude::*;
use std::vec::Vec;
pub enum ShapeType {
    Cube(f32),
    Sphere(f32),
    Capsule(f32, f32),
    Plane(f32),
    Mesh(Vec<f32>),
}

#[wasm_bindgen]
pub struct CollisionShape {
    shape_type : ShapeType,
}
