const proxyAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "eas",
        "type": "address",
        "internalType": "contract IEAS"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_attester",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addAttestationType",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "schemaId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "rewarder",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "attestByDelegation",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delegatedRequest",
        "type": "tuple",
        "internalType": "struct DelegatedProxyAttestationRequest",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple",
            "internalType": "struct AttestationRequestData",
            "components": [
              {
                "name": "recipient",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "expirationTime",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revocable",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "refUID",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signature",
            "type": "tuple",
            "internalType": "struct Signature",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "attester",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "attestationTypes",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "schemaId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "rewarder",
        "type": "address",
        "internalType": "contract IRewarder"
      },
      {
        "name": "enabled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "attester",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAttestTypeHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getAttester",
    "inputs": [
      {
        "name": "uid",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainSeparator",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getEAS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEAS"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getName",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRevokeTypeHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "multiAttestByDelegation",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "multiDelegatedRequests",
        "type": "tuple[]",
        "internalType": "struct MultiDelegatedProxyAttestationRequest[]",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple[]",
            "internalType": "struct AttestationRequestData[]",
            "components": [
              {
                "name": "recipient",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "expirationTime",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revocable",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "refUID",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signatures",
            "type": "tuple[]",
            "internalType": "struct Signature[]",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "attester",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "multiAttestByDelegation",
    "inputs": [
      {
        "name": "multiDelegatedRequests",
        "type": "tuple[]",
        "internalType": "struct MultiDelegatedProxyAttestationRequest[]",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple[]",
            "internalType": "struct AttestationRequestData[]",
            "components": [
              {
                "name": "recipient",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "expirationTime",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revocable",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "refUID",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signatures",
            "type": "tuple[]",
            "internalType": "struct Signature[]",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "attester",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "multiRevokeByDelegation",
    "inputs": [
      {
        "name": "multiDelegatedRequests",
        "type": "tuple[]",
        "internalType": "struct MultiDelegatedProxyRevocationRequest[]",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple[]",
            "internalType": "struct RevocationRequestData[]",
            "components": [
              {
                "name": "uid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signatures",
            "type": "tuple[]",
            "internalType": "struct Signature[]",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "revoker",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "multiRevokeByDelegation",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "multiDelegatedRequests",
        "type": "tuple[]",
        "internalType": "struct MultiDelegatedProxyRevocationRequest[]",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple[]",
            "internalType": "struct RevocationRequestData[]",
            "components": [
              {
                "name": "uid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signatures",
            "type": "tuple[]",
            "internalType": "struct Signature[]",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "revoker",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeByDelegation",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "delegatedRequest",
        "type": "tuple",
        "internalType": "struct DelegatedProxyRevocationRequest",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple",
            "internalType": "struct RevocationRequestData",
            "components": [
              {
                "name": "uid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signature",
            "type": "tuple",
            "internalType": "struct Signature",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "revoker",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "revokeByDelegation",
    "inputs": [
      {
        "name": "delegatedRequest",
        "type": "tuple",
        "internalType": "struct DelegatedProxyRevocationRequest",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple",
            "internalType": "struct RevocationRequestData",
            "components": [
              {
                "name": "uid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signature",
            "type": "tuple",
            "internalType": "struct Signature",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "revoker",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "rewardToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract DiamondToken"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAttestationTypeRewarder",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "rewarder",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAttestationTypeStatus",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "enabled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAttester",
    "inputs": [
      {
        "name": "_attester",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userAttestations",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "userAuthentication",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "attestationType",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "userAuthenticationCount",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "attestationType",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "version",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "AttestationTypeAdded",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "schemaId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "rewarder",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AttestationTypeRewarderUpdated",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "rewarder",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AttestationTypeStatusUpdated",
    "inputs": [
      {
        "name": "id",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "enabled",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AttesterUpdated",
    "inputs": [
      {
        "name": "attester",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AccessDenied",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AttestationTypeDoesNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AttestationTypeExists",
    "inputs": []
  },
  {
    "type": "error",
    "name": "DeadlineExpired",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Disabled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "DisabledAttestationType",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEAS",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidLength",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidSchemaId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotFound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UsedSignature",
    "inputs": []
  }
] as const

export default proxyAbi;
