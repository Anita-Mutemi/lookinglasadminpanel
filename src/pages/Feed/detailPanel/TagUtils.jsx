
import {
  TagOutlined,
  RadarChartOutlined,
  DatabaseOutlined,
  ShopOutlined,
  BulbOutlined,
  WarningOutlined,
  FireOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import { groupBy } from 'lodash';

export const tagTypeIcons = {
  competing_space: <RadarChartOutlined />,
  industries: <DatabaseOutlined />,
  product_types: <ShopOutlined />,
  company_types: <TagOutlined />,
  strengths: <BulbOutlined />,
  weaknesses: <WarningOutlined />,
  opportunities: <FireOutlined />,
  uncategorized: <QuestionCircleOutlined />,
};

export const tagColors = {
  competing_space: 'purple',
  industries: 'blue',
  product_types: 'magenta',
  company_types: 'red',
  strengths: 'green',
  weaknesses: 'volcano',
  opportunities: 'orange',
  uncategorized: 'gray',
};

export const groupTagsByType = (tags) => {
  return groupBy(tags, 'tag_type');
};
