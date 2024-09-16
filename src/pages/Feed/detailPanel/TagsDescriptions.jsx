import { Card, Col, Row, Space, Tag } from 'antd';
import { groupTagsByType, tagColors, tagTypeIcons } from './TagUtils';
import { NoTagsUI } from './NoData';

const TagsDescriptions = ({ tags }) => {
  const groupedTags = groupTagsByType(tags);

  if (!tags?.length) {
    return <NoTagsUI />;
  }

  return (
    <>
      <h3 style={{ marginTop: '1.5rem' }}>Tags</h3>
      <Row gutter={[16, 16]}>
        {Object.entries(groupedTags).map(([tagType, tagGroup], index) => (
          <Col key={index} style={{ width: '100%' }}>
            <Card
              title={
                <Space>
                  {tagTypeIcons[tagType] || tagTypeIcons.uncategorized}
                  <strong>{tagType}</strong>
                </Space>
              }
              style={{ overflow: 'auto' }}
            >
              {tagGroup.map((tag) => (
                <Tag color={tagColors[tagType] || 'gray'} key={tag.tag_name}>
                  #{tag.tag_name}
                </Tag>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default TagsDescriptions;
