import '@emotion/react'
import { DiscoveryTheme } from 'themes'

declare module '@emotion/react' {
  export interface Theme extends DiscoveryTheme {}
}
