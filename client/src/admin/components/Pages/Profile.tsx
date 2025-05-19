import { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, Typography, Avatar, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { AppDispatch, RootState } from '../../../redux/store';
import { getCurrentUser, updateProfile } from '../../../redux/slices/authSlice';
import { useSnackbar } from 'notistack';
import Breadcrumb from '../../../common/Breadcrumb';


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
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const handleOpen = () => {
    // Reset form values when opening modal
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture || null);
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setProfilePicture(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSaveChanges = () => {
    if (!user) return;

    setIsSubmitting(true);

    const formData = new FormData();

    // Add the selected file if it exists
    if (selectedFile) {
      formData.append('profilePicture', selectedFile);
    }

    // Only append changed values to reduce payload size
    if (name !== user.name) {
      formData.append('name', name);
    }

    if (email !== user.email) {
      formData.append('email', email);
    }

    // Only dispatch if there are actual changes
    if (formData.has('profilePicture') || formData.has('name') || formData.has('email')) {
      dispatch(updateProfile(formData))
        .unwrap()
        .then(() => {
          enqueueSnackbar('Profile updated successfully!', {
            variant: 'success', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            }
          });
          handleClose();
        })
        .catch((error) => {
          const errorMessage = error.message || 'Failed to update profile. Please try again.';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      // No changes to save
      setIsSubmitting(false);
      handleClose();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <>
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}> */}
      <Box sx={{ display: 'flex',  flexDirection:'column',justifyContent: 'center', mt: 5 }}>
      <Breadcrumb pageName="Profile" />
        <Card sx={{  p: 3, textAlign: 'center' }}>

          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Avatar
              alt={user.name}
              src={profilePicture || ''}
              sx={{ width: 100, height: 100, margin: '0 auto' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                p: 0.5,
                cursor: 'pointer'
              }}
              onClick={handleOpen}
            >
              <PhotoCameraIcon sx={{ color: 'white', fontSize: 18 }} />
            </Box>
          </Box>
          <Typography variant="h5" gutterBottom>{user.name}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{user.email}</Typography>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpen}>
            Edit Profile
          </Button>
        </Card>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" gutterBottom>
              Profile Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                alt={name}
                src={profilePicture || ''}
                sx={{ width: 80, height: 80, mb: 1 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="profile-picture-upload">
                <Button
                  variant="outlined"
                  component="span"
                  size="small"
                  startIcon={<PhotoCameraIcon />}
                >
                  Change Photo
                </Button>
              </label>
            </Box>

            <TextField
              fullWidth
              margin="normal"
              label="Name"
              value={name}
              onChange={handleNameChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default Profile;