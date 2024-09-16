import { Box, Typography } from '@mui/material';
import { FaLinkedin } from 'react-icons/fa';
import { Typography as TypographyAnt } from 'antd';
import { Tag } from 'antd';
import { GeneralErrorBoundary } from '../../components/UI/GeneralErrorBoundry';

const { Paragraph, Text } = TypographyAnt;

const getVerticals = (tags) => {
  if (tags?.length == 0 || !tags)
    return <span color='grey'>No tags available</span>;
  if (tags?.length == 0)
    return <span color='grey'>No verticals available</span>;

  const verticals = tags.filter(
    (tag) =>
      tag.type === 'verticals' &&
      ['gpt3.5', 'llama', 'gpt4'].includes(tag.source),
  );

  return verticals.length ? (
    verticals.map((vertical) => vertical.value).join(', ')
  ) : (
    <span color='grey'>Tags are outdated</span>
  );
};

export const columns = [
  {
    accessorFn: function (row) {
      return row?.title || 'Data not available';
    },
    id: 'name',
    header: 'Name',
    enableColumnFilterModes: true,
    Cell: ({ row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          alt='avatar'
          height={30}
          src={row.original?.logo || ''}
          loading='lazy'
          style={{ borderRadius: '50%' }}
        />
        <span>
          {row.original?.website ? (
            <a
              href={row.original.website}
              target='_blank'
              style={{ color: '#535bf2' }}
            >
              {row.original.title || 'Data not available'}
            </a>
          ) : (
            row.original?.title || 'Data not available'
          )}
        </span>
      </Box>
    ),
  },
  {
    accessorFn: (row) => row?.status,
    id: 'status',
    header: 'Status',
    sortDescFirst: true,
    Cell: ({ row }) => row.original?.status,
  },
  {
    accessorFn: (row) => row?.is_startup,
    id: 'type',
    header: 'Type',
    Cell: ({ row }) => (
      <>
        {row.original?.is_startup ? (
          <Tag key={'startup'} color='orange'>
            Startup
          </Tag>
        ) : (
          ''
        )}
        {row.original?.is_b2b ? (
          <Tag key={'b2b'} color='blue'>
            B2B
          </Tag>
        ) : (
          ''
        )}
      </>
    ),
  },
  {
    accessorFn: (row) => row?.uuid,
    id: 'uuid',
    header: 'UUID',
    sortDescFirst: true,
    Cell: ({ row }) => row.original?.uuid,
  },
  {
    accessorFn: (row) => (
      <GeneralErrorBoundary>
        {getVerticals(row?.analytics?.verticals)}
      </GeneralErrorBoundary>
    ),
    id: 'categories',
    header: 'Verticals',
  },
  {
    accessorFn: (row) => row?.funds,
    id: 'fundsInterested',
    header: 'Funds Interested',
    Cell: ({ row }) =>
      row.original.funds?.length > 0 ? (
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {row.original.funds.map((f) => f.name).join(', ')}
        </Paragraph>
      ) : (
        <Text>No Funds Interested</Text>
      ),
  },
  {
    accessorFn: (row) => new Date(row?.status_changed || row?.discovered_date),
    id: 'lastParsed',
    header: 'Date Updated',
    sortDescFirst: true,
    Cell: ({ row }) =>
      row.original?.status_changed
        ? new Date(row.original?.status_changed).toLocaleString()
        : row.original?.discovered_date
        ? new Date(row.original?.discovered_date).toLocaleString()
        : 'no data',
  },
  // {
  //   accessorFn: (row) => row?.source || 'Data not available',
  //   id: 'source',
  //   header: 'Source',
  //   size: 5,
  //   Cell: ({ row }) => (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         justifyContent: 'flex-start',
  //         gap: '1rem',
  //       }}
  //     >
  //       {row.original?.source?.toLowerCase() === 'linkedin' ? (
  //         row.original.linkedin?.linkedin_profile?.urls[0] ? (
  //           <a href={row.original.linkedin.linkedin_profile.urls[0]} target='_blank'>
  //             <FaLinkedin style={{ transform: 'scale(1.5)' }} />
  //           </a>
  //         ) : (
  //           <Typography variant='body2' color='textSecondary'>
  //             LinkedIn URL not available
  //           </Typography>
  //         )
  //       ) : (
  //         <Typography variant='body2' color='textSecondary'>
  //           Data not available
  //         </Typography>
  //       )}
  //     </Box>
  //   ),
  // },
];
