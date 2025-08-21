// tamagui.config.ts
import { createTamagui } from '@tamagui/core'
import { themes, tokens } from '@tamagui/config/v3'

const config = createTamagui({
  themes,
  tokens,
  shorthands: {
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
  },
})

export type Conf = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
