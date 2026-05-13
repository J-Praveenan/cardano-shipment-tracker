import cbor from "cbor";
import { resolvePlutusScriptAddress } from "@meshsdk/core";
import type { PlutusScript } from "@meshsdk/core";

import plutusBlueprint from "../data/plutus.json";

export const scriptCbor = cbor
  .encode(Buffer.from(plutusBlueprint.validators[0].compiledCode, "hex"))
  .toString("hex");

export const script: PlutusScript = {
  code: scriptCbor,
  version: "V3",
};

export const scriptAddress = resolvePlutusScriptAddress(script, 0);