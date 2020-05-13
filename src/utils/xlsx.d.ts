declare type MetaMap = Array<Array<[number, number, number]>>;

declare function getColumnIndexString(index: number): string;

declare function canvas2metaMap(canvas: HTMLCanvasElement): MetaMap;

declare function metaMap2excel(metaMap: MetaMap): void;
