const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_jwt_secret_for_dev', {
        expiresIn: '30d',
    });
};

// Only configure Google strategy if credentials are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                scope: ['profile', 'email']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // Update login statistics
                        user.lastLogin = Date.now();
                        user.loginCount += 1;
                        await user.save();
                        
                        return done(null, user);
                    }

                    // Check if email already exists
                    if (profile.emails && profile.emails.length > 0) {
                        const existingUser = await User.findOne({ email: profile.emails[0].value });
                        
                        if (existingUser) {
                            // Link Google account to existing account
                            existingUser.googleId = profile.id;
                            existingUser.lastLogin = Date.now();
                            existingUser.loginCount += 1;
                            
                            if (!existingUser.profilePicture && profile.photos && profile.photos.length > 0) {
                                existingUser.profilePicture = profile.photos[0].value;
                            }
                            
                            await existingUser.save();
                            return done(null, existingUser);
                        }
                    }

                    // Create new user
                    const username = profile.displayName.replace(/\s+/g, '') + 
                                   Math.floor(Math.random() * 1000); // Ensure uniqueness

                    user = new User({
                        googleId: profile.id,
                        username: username,
                        email: profile.emails ? profile.emails[0].value : `${username}@gmail.com`,
                        profilePicture: profile.photos ? profile.photos[0].value : '',
                        lastLogin: Date.now(),
                        loginCount: 1
                    });

                    await user.save();
                    return done(null, user);

                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
} else {
    console.warn('Google OAuth is disabled: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables');
}

// Serialization and deserialization for sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;