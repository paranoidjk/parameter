interface Parameter {
  a: string;
  b?: number;
  c: {
    childx: "x" | "y" | "z";
    childy: {
      foo: number;
      bar: string;
    }[];
  };
}
