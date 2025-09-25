const User = require('../models/User');

const fetchUser = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user in the database
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const userProfile = {
            name: user.username,
            email: user.email,
            imageUrl: user.profilePicture,
        };
        
        res.status(200).json({ userProfile });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { fetchUser };
