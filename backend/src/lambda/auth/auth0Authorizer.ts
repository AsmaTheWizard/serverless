import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { JwtPayload } from '../../auth/JwtPayload'


const logger = createLogger('auth')


const cert =`-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJe1al19n2NePHMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1lbHN4ZHd6eC5hdXRoMC5jb20wHhcNMTkxMTMwMDkxMjUyWhcNMzMw
ODA4MDkxMjUyWjAhMR8wHQYDVQQDExZkZXYtZWxzeGR3enguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4ti0f1uPNFNZsUwtnAchv+n/
re3i6Zux8SpMyNncVIDBHzG1h1HqMG4rspvdn0rE+0tqNHIFLQqeZJm17RsoPdSP
o7OjgcHg039hbllRenyfi4TjNo6nIA2D/6ApEg+qvXkz2YaSa+DIeN5qpARTk06L
d0ST+mnn37atEjyj+SnNsuH4BZDVxD9cgoBf5igEy1aISXGJPLItJniveJcH1yza
58EEDkfe6pXR/982lWzdICtm7FS2dGdwLQT+kHugl0PxAxToCpiTvkCrKdoVQ+4J
+nLXo57eMmYitH+BuJ8nrlbEIzwmoajBs9BCdDJW6ZEiGP0BckFjdFY9qkt/JQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSjXNDsePMOnBrfDPQS
lUfAIItLfDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBALuSd344
gPXYNWuLgPsr7a+byr/rKGMzSzNG0/9WkYMN3/U/g1tNPstA7gpty+cvjl7i1afe
Nss5kNSMuTlZQfmZvjD3+/67N/4yyeRucghEzw3IhTnjfRvS2z+hBUoQ1MKJXvaX
8keM9jO250MxEJ4RfGOXUTTmtG29Ul6bPnXq09SH9VeL4QTe4kDRu/baSpcK13NQ
EXxJcK9rNZfSbMzYU1Ht9kBEFLAYg8qsSyb3FLaJBBz9FW4haXNKCx+ljxUHyOnH
FKD3tzXrYIyrnrrL9tpXr5LSOjSY0BJuNrR7isX5V/OHrgffdSrps0ZBcAFl2sTe
vmuZOsTqLWVXdGA=
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {

    const jwtToken =  verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}




function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  }


