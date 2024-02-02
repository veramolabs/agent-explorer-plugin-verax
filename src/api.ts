import { Schema, VeraxSdk } from "@verax-attestation-registry/verax-sdk"

export const getAddressAttestations = async (address: string): Promise<Array<any>> => {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND);
  const r = await veraxSdk.attestation.findBy(100,0, {
    subject: address,
  })
  return r
}

export const getSchema= async (schema: string): Promise<Schema | undefined> => {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND);
  const r = await veraxSdk.schema.findOneById(schema )
  return r
}

