import { useVeramo } from '@veramo-community/veramo-react'
import { IResolver, UniqueVerifiableCredential } from '@veramo/core-types'
import { getEthereumAddress, computeEntryHash } from '@veramo/utils'
import React, { useMemo } from 'react'
import { useQueries, useQuery } from 'react-query'
import { getAddressAttestations, getSchema } from './api'
import { VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'
import { Card, List, Typography } from 'antd'
import { Attestation } from '@verax-attestation-registry/verax-sdk'


export const IdentifierTab: React.FC<{ did: string }> = ({  
  did,
}) => {

  const { agent } = useVeramo<IResolver>()


  const { data: resolutionResult, isLoading } = useQuery(
    ['identifier', did],
    () => agent?.resolveDid({ didUrl: did }),
  )

  const addresses: string[] = useMemo(() => {
    const addresses: string[] = []
    if (resolutionResult?.didDocument?.verificationMethod) {
      for (const vm of resolutionResult.didDocument.verificationMethod) {
        const address = getEthereumAddress(vm)
        if (address) {
          addresses.push(address)
        }
      }
    }
    return addresses
  }, [resolutionResult])

  const attestationQueries = useQueries(
    addresses.map(address => {
      return {
        queryKey: ['verax-attestations', address],
        queryFn: () => getAddressAttestations(address),
      }
    })
  )

  const attestations: Attestation[] = React.useMemo(() => {
    const attestations: Attestation[] = []
    for (const attestationQuery of attestationQueries) {
      if (attestationQuery.isSuccess && attestationQuery.data) {
        attestationQuery.data.forEach((attestation) => {
          attestations.push(attestation)
        })
      }
    }
    return attestations
  }, [attestationQueries])

  return (
    <List
      grid={{       
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 1,
        xxl: 1,
        column: 1,
      }}
      dataSource={attestations}
      renderItem={(item) => (
        <Card style={{ margin: 10 }}>
          <SchemaInfo schema={item.schemaId}/>

          <pre>
          {JSON.stringify(item.decodedPayload, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value, 2)}
          </pre>
      </Card>
      )}
    />
  )
}

const SchemaInfo = ({ schema }: { schema: string }) => {
  const { data, isLoading } = useQuery(
    ['verax-schema', schema],
    () => getSchema(schema), 
  )
  return (
    <div>
      {isLoading ? <div>Loading...</div> : <dev>{data?.name}</dev>}
    </div>
  )
}
