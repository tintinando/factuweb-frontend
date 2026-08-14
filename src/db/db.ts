import { Dexie, type EntityTable } from "dexie";

interface Producto {
  id: number;
  idCliente: number;
  cantidad: number;
  articulo: string;
  descripcion: string;
  precio: number;
}

interface Clientes {
  id: number;
  nombre: string;
  cuit: string;
}

export const db = new Dexie("factuweb") as Dexie & {
  productos: EntityTable<Producto, "id">;
  clientes: EntityTable<Clientes, "id">;
};

db.version(1).stores({
  productos: "++id, idCliente, cantidad, articulo, descripcion, precio",
  clientes: "++id, nombre, cuit",
});

export type { Producto };
