import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, Typography, Avatar, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import { AppDispatch, RootState } from '../../../redux/store';
import { getCurrentUser } from '../../../redux/slices/authSlice'; 

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth); // <-- fix here

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Card sx={{ width: 400, p: 3, textAlign: 'center' }}>
        <Avatar 
          alt={user.name} 
          src={user.profilePicture || ''} 
          sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
        />
        <Typography variant="h5" gutterBottom>{user.name}</Typography>
        <Typography variant="body1" color="text.secondary">{user.email}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{user.role}</Typography>
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpen}>
          View / Edit Profile
        </Button>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Profile Details
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            defaultValue={user.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            defaultValue={user.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Role"
            defaultValue={user.role}
            disabled
          />
          {/* Optional: Add a file upload input for changing profile picture */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="secondary" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
