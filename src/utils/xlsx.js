import { saveAs } from "file-saver";
import Excel from "exceljs/dist/es5/exceljs.browser";

export function getColumnIndexString(index) {
  const ordA = "A".charCodeAt(0);
  const ordZ = "Z".charCodeAt(0);
  const len = ordZ - ordA + 1;
  let columnIndexString = "";
  while (index >= 0) {
    columnIndexString =
      String.fromCharCode((index % len) + ordA) + columnIndexString;
    index = Math.floor(index / len) - 1;
  }
  return columnIndexString;
}

export function canvas2metaMap(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = Array.from(imageData.data);
  // 快速构建二维数组
  const metaMap = Array.from(new Array(canvas.height)).map(
    (value, heightIndex) =>
      Array.from(new Array(canvas.width)).map((value, widthIndex) => {
        const start = (heightIndex * canvas.width + widthIndex) * 4;
        const rgba = data.slice(start, start + 4);
        return rgba;
      })
  );
  return metaMap;
}

export async function metaMap2excel(metaMap) {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet("image", {
    properties: {
      defaultColWidth: 1.5
    }
  });
  metaMap.forEach((row, rowIndex) => {
    row.forEach((rgba, columnIndex) => {
      const cellId = `${getColumnIndexString(columnIndex)}${rowIndex + 1}`;
      const [r, g, b, a] = rgba;
      sheet.getCell(cellId).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: [a, r, g, b]
            .map(value => value.toString(16))
            .join("")
            .toUpperCase()
        }
      };
    });
  });
  const arrayBuffer = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([arrayBuffer.buffer]), "image.xlsx");
}
