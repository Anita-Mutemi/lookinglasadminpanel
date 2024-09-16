import { Typography, Chip, Box, Avatar } from '@mui/material';

export const SelectedProjects = ({ projects, onDeselect }) => {
  return (
    <Box>
      {projects?.length > 0 && (
        <Typography variant={'h5'} sx={{ fontSize: '12px' }}>
          Selected projects: {projects?.length}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 0.5, m: 0 }}>
        {projects.map((project, index) => (
          <Chip
            key={index}
            avatar={<Avatar src={project?.logo}>{project?.title[0]}</Avatar>}
            label={project?.title}
            onDelete={() => onDeselect(project.id)}
            sx={{ m: 0.5 }}
            clickable
          />
        ))}
      </Box>
    </Box>
  );
};
