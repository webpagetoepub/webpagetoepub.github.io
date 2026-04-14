export default interface Client {
  requestTextContent(url: string): Promise<string>;
  loadFileFrom(url: string): Promise<Blob>;
}
