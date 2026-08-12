import ExcelJS from "exceljs";

export interface Column<T extends object> {
  header: string;
  key: keyof T & string;
  width?: number;
}

/**
 * Convierte un array de objetos en una planilla excel. Devuelve la instancia URL
 *
 * @param data array de datos para cada fila
 * @param columns propiedades para cada columna
 * @returns string con la url a descargar
 */
export async function exportTableToExcel<T extends object>(
  data: T[],
  columns: Column<T>[],
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Datos");

  worksheet.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));

  worksheet.addRows(data);

  const buffer = await workbook.xlsx.writeBuffer();

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * Lee una planilla XLSX y devuelve sus filas como objetos.
 *
 * La primera hoja del archivo se utiliza como fuente de datos y la primera
 * fila se interpreta como encabezado. Solo se importan las columnas declaradas
 * en `columns`; las demás columnas presentes en el archivo son ignoradas.
 *
 * Se espera que el archivo haya sido generado previamente mediante
 * `exportTableToExcel`, por lo que los valores de las celdas se consideran
 * compatibles con los tipos definidos en `T`.
 *
 * @param file archivo xslx a importar
 * @param columns columnas que se deben obtener del xslx
 * @returns array de objetos con las propiedades encontradas.
 * Cada objeto es Partial<T> porque la fila puede no tener dato
 *
 * @throws {Error} si la planilla no contiene ninguna hoja
 */
export async function importTableFromExcel<T extends object>(
  file: File,
  columns: Column<T>[],
): Promise<Partial<T>[]> {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error("La planilla no contiene ninguna hoja");
  }

  const keyByHeader = new Map(
    columns.map((column) => [column.header, column.key]),
  );

  const records: Partial<T>[] = [];
  const headers: string[] = [];

  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = cell.value?.toString().trim() || "";
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData: Partial<T> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber];
      const key = keyByHeader.get(header);

      if (key) {
        // se asume que el XSLX respeta el esquema de columnas exportado
        rowData[key] = cell.value as T[typeof key];
      }
    });

    records.push(rowData);
  });

  return records;
}
