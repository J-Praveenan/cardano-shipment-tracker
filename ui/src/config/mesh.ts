import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";

export const provider = new BlockfrostProvider(
  process.env.NEXT_PUBLIC_BLOCKFROST!
);

export const txBuilder = new MeshTxBuilder({
  fetcher: provider,
  submitter: provider,
  verbose: true,
});