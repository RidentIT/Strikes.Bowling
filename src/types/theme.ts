/** Brand colour tokens (from theme.css) usable as an accent. */
export type AccentColor =
  | 'brand-rose'
  | 'brand-crimson'
  | 'brand-coral'
  | 'brand-orange'
  | 'brand-violet'
  | 'brand-purple'
  | 'brand-indigo'
  | 'brand-blue'
  | 'brand-cyan'
  | 'brand-emerald'

/** An accent and the colour its gradients run towards. */
export interface Accent {
  from: AccentColor
  to: AccentColor
}
