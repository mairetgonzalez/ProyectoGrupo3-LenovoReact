import { http } from "./api"; // o usa fetch directo, según tu config

// trae todas las categorías
export async function listCategorias() {
  return http("GET", "/categorias");
}

// crear nueva
export async function createCategoria(payload) {
  return http("POST", "/categorias", payload);
}

// actualizar
export async function updateCategoria(id, payload) {
  return http("PUT", `/categorias/${id}`, payload);
}

// eliminar
export async function deleteCategoria(id) {
  return http("DELETE", `/categorias/${id}`);
}
