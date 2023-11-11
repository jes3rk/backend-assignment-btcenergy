export class BlockchainApiException extends Error {
  constructor(
    public readonly code: number,
    public readonly status: string,
  ) {
    super(`Error response from blockchain api with status ${status}`);
    this.name = this.constructor.name;
  }
}
