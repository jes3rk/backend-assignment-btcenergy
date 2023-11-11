import { container, DependencyContainer } from "tsyringe";
import { BlockService } from "./block.service";

describe("BlockService", () => {
  let service: BlockService;
  let ctx: DependencyContainer;

  beforeEach(() => {
    ctx = container.createChildContainer();

    ctx.register(BlockService, BlockService);

    service = ctx.resolve(BlockService);
  });

  afterEach(() => {
    ctx.dispose();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
