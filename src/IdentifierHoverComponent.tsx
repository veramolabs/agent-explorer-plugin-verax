/* eslint-disable */

import React, { useMemo } from 'react';
import { IIdentifierHoverComponentProps } from "@veramo-community/agent-explorer-plugin";
import { IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { useQueries, useQuery } from 'react-query';
import { Spin, Typography } from 'antd';
import { getEthereumAddress, computeEntryHash } from '@veramo/utils'
import { Icon } from './Icon';
import { getAddressAttestations, getAddressStamps } from './api';
import { Attestation } from '@verax-attestation-registry/verax-sdk';

export const IdentifierHoverComponent: React.FC<IIdentifierHoverComponentProps> = ({did}) => {
  const { agent } = useVeramo<IDataStoreORM>()

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
    <Typography.Text>
      <Icon small/> attestations: {isLoading ? <Spin /> : attestations.length}
    </Typography.Text>
  )
}


