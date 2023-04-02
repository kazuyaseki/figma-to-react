import { makeFragmentData } from '@/shared/generated/graphql';
import { CoinType } from '@/shared/generated/graphql/graphql';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import {
  StorePaymentCompletePage,
  StorePaymentCompletePageIncentiveFragment,
  StorePaymentCompletePageIncentivePurchaseCompleteSettingFragment,
} from './StorePaymentCompletePage';

const communityId = 'aymNltm8ChEzglwQW89n';
const incentiveId = 'bBNZDsp6njiAVFOJP16ZycegFwGZ7Zab';

export default {
  title: 'features/store/StorePaymentCompletePage',
  component: StorePaymentCompletePage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        path: '/incentive/[community_id]/[incentive_id]/complete',
        asPath: "",
        query: {
          community_id: communityId,
          incentive_id: incentiveId,
        },
      },
    },
  },
} as Meta<typeof StorePaymentCompletePage>;