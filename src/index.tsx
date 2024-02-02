import React from 'react';

import { IPlugin } from '@veramo-community/agent-explorer-plugin';
import { IdentifierHoverComponent } from './IdentifierHoverComponent';
import { IdentifierTab} from './IdentifierTab';
import { Icon } from './Icon';

const Plugin: IPlugin = {
    init: () => {
        return {
          name: 'Verax',
          description: 'Verax attestations',
          requiredMethods: ['dataStoreORMGetIdentifiers'],
          icon: <Icon />,
          routes: [],
          menuItems: [],
          hasCss: true,
          getIdentifierHoverComponent: () => IdentifierHoverComponent,
          getIdentifierTabsComponents: () => {
            return [
              {
                label: 'Verax',
                component: IdentifierTab,
              },
            ]
          },
        }
    }
};

export default Plugin;
