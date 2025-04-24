const { OAuth2Client } = require('google-auth-library');
const User = require('../models/AuthModel');
const jwt = require('jsonwebtoken');
const catchAsyncError = require('../middleware/catchAsyncError');
const errorHandler = require('../middleware/errorHandler');
const { deleteOldUserFile } = require('../middleware/editFiles');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Generating JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SEC,
        { expiresIn: '7d' }
    );
};

// register
exports.register = catchAsyncError(async (req, res, next) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
        return next(new errorHandler('Please enter name, email and password', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new errorHandler('User already exists', 400));
    }

    let profilePicture = '';
    if (req.file) {
        const filename = req.file.filename;
        profilePicture = `${process.env.BACKEND_URL}/upload/${filename}`;
    }

    const user = await User.create({
        email,
        password,
        name,
        role,
        profilePicture,
    });

    const token = generateToken(user);

    res.status(201).json({
        success: true,
        message: "Registered Successfully!",
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture,
        }
    });
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorHandler('Please enter both email and password', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new errorHandler('User not found', 404));
    }

    if (user.googleId && !user.password) {
        return next(new errorHandler('Please login with Google', 400));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new errorHandler('Invalid credentials', 401));
    }

    const token = generateToken(user);

    res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture || ''
        }
    });
});


// Google OAuth login
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email_verified, email, name, picture, sub: googleId } = ticket.getPayload();
        console.log("Picture from Google:", picture);

        if (!email_verified) {
            return res.status(400).json({ message: 'Google email not verified' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                googleId,
                profilePicture: picture || '',
            });
            await user.save();
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture || user.profilePicture;
                await user.save();
            }
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Google login failed', error: error.message });
    }
};


// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Failed to get user', error: error.message });
    }
}

// Update profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // If a new profile picture is uploaded
    if (req.file) {
        if (user.profilePicture) {
            await deleteOldUserFile(user.profilePicture);
        }

        user.profilePicture = `${process.env.BACKEND_URL}/upload/${req.file.filename}`;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture || '',
        }
    });
});

//get all users
exports.getAllClients = catchAsyncError(async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password'); 

        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
})