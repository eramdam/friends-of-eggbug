export async function readInputFile(file: File) {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(String(e.target?.result));
    };
    fileReader.readAsText(file);
  });
}
