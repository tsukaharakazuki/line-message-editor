import type { FlexComponent, FlexBox, FlexText, FlexImage, FlexButton, FlexIcon, FlexSeparator, FlexFiller } from '../../../types/line'
import BoxProps from './properties/BoxProps'
import TextProps from './properties/TextProps'
import ImageProps from './properties/ImageProps'
import ButtonProps from './properties/ButtonProps'
import SimpleProps from './properties/SimpleProps'

interface Props {
  component: FlexComponent
  onChange: (component: FlexComponent) => void
}

export default function PropertyPanel({ component, onChange }: Props) {
  switch (component.type) {
    case 'box':
      return <BoxProps box={component as FlexBox} onChange={(v) => onChange(v)} />
    case 'text':
      return <TextProps text={component as FlexText} onChange={(v) => onChange(v)} />
    case 'image':
      return <ImageProps image={component as FlexImage} onChange={(v) => onChange(v)} />
    case 'button':
      return <ButtonProps button={component as FlexButton} onChange={(v) => onChange(v)} />
    case 'icon':
    case 'separator':
    case 'filler':
      return <SimpleProps component={component as FlexIcon | FlexSeparator | FlexFiller} onChange={onChange} />
    default:
      return <p className="text-xs text-gray-400 p-2">No properties available for this component type.</p>
  }
}
