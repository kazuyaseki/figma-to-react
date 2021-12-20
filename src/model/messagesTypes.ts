import { CssStyle } from '../core/buildCssString'
import { UnitType } from '../core/buildSizeStringByUnit'
import { UserComponentSetting } from './userComponentSetting'
export type messageTypes =
  | { type: 'notify-copy-success' }
  | { type: 'new-css-style-set'; cssStyle: CssStyle }
  | { type: 'new-unit-type-set'; unitType: UnitType }
  | { type: 'set-shared-plugin-data'; key: any; value: any }
  | { type: 'update-node-properties'; nodeProperties: any }
  | { type: 'update-user-component-settings'; userComponentSettings: UserComponentSetting[] }
  | { type: 'store-provider-settings'; providerSettings: any }
  | { type: 'load-provider-settings' }
