const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
// const sendEmail = require('../utils/sendEmail');
// const cloudinary = require('cloudinary')
// const crypto = require('crypto')
// const bcrypt = require('bcryptjs');
// const  {google} = require('googleapis')
// const {OAuth2} = google.auth;

// const client = new OAuth2('920213136950-8j3ng8qursis2pib3qhav9q2larqfu89.apps.googleusercontent.com')

exports.registerUser = async (req, res, next) => {
    try {

        // Repeat the process for images if needed

        const { name, phone, address, email, password, role } = req.body;
        const user = await User.create({
            name,
            phone,
            address,
            email,
            password
            // role,
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'User not created'
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error in registration process' });
    }
};


exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' })
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    sendToken(user, 200, res)
}

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

// exports.forgotPassword = async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return res.status(404).json({ error: 'User not found with this email' })
//         // return next(new ErrorHandler('User not found with this email', 404));
//     }
//     // Get reset token
//     const resetToken = user.getResetPasswordToken();
//     await user.save({ validateBeforeSave: false });
//     // Create reset password url
//     const resetUrl = `${req.protocol}://localhost:3001/password/reset/${resetToken}`;
//     const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'Applitech Reset Password',
//             message
//         })

//         res.status(200).json({
//             success: true,
//             message: `Email sent to: ${user.email}`
//         })

//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;
//         await user.save({ validateBeforeSave: false });
//         return res.status(500).json({ error: error.message })
//         // return next(new ErrorHandler(error.message, 500))
//     }
// }

// exports.resetPassword = async (req, res, next) => {
//     // Hash URL token
//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
//     const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() }
//     })

//     if (!user) {
//         return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
//         // return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
//     }

//     if (req.body.password !== req.body.confirmPassword) {
//         return res.status(400).json({ message: 'Password does not match' })
//         // return next(new ErrorHandler('Password does not match', 400))
//     }

//     // Setup new password
//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();
//     sendToken(user, 200, res);
// }

// exports.getUserProfile = async (req, res, next) => {
//     const user = await User.findById(req.user.id);

//     res.status(200).json({
//         success: true,
//         user
//     })
// }

// exports.updatePassword = async (req, res, next) => {
//     const user = await User.findById(req.user.id).select('password');
//     const isMatched = await user.comparePassword(req.body.oldPassword)
//     if (!isMatched) {
//         return res.status(400).json({ message: 'Old password is incorrect' })
//     }
//     user.password = req.body.password;
//     await user.save();
//     sendToken(user, 200, res)

// }

// exports.updateProfile = async (req, res, next) => {
//     try {
//       const newUserData = {
//         name: req.body.name,
//         email: req.body.email
//       };
  
//       if (req.files && req.files.avatar) {
//         const user = await User.findById(req.user.id);
  
//         if (Array.isArray(req.files.avatar)) {
//           const uploadedAvatars = [];
//           for (const file of req.files.avatar) {
//             const result = await cloudinary.v2.uploader.upload(file.path, {
//               folder: 'avatars',
//               width: 150,
//               crop: 'scale'
//             });
  
//             uploadedAvatars.push({
//               public_id: result.public_id,
//               url: result.secure_url
//             });
//           }
//           newUserData.avatar = uploadedAvatars;
  
//           // Delete previous avatars from Cloudinary
//           if (user.avatar && user.avatar.length > 0) {
//             for (const avatar of user.avatar) {
//               await cloudinary.v2.uploader.destroy(avatar.public_id);
//             }
//           }
//         } else {
//           const result = await cloudinary.v2.uploader.upload(req.files.avatar.path, {
//             folder: 'avatars',
//             width: 150,
//             crop: 'scale'
//           });
  
//           newUserData.avatar = [{
//             public_id: result.public_id,
//             url: result.secure_url
//           }];
  
//           // Delete the previous avatar from Cloudinary
//           if (user.avatar && user.avatar.length > 0) {
//             await cloudinary.v2.uploader.destroy(user.avatar[0].public_id);
//           }
//         }
//       }
  
//       const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
//         new: true,
//         runValidators: true,
//       });
  
//       if (!updatedUser) {
//         return res.status(401).json({ success: false, message: 'User Not Updated' });
//       }
  
//       res.status(200).json({
//         success: true,
//         user: updatedUser
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: 'Server Error' });
//     }
//   };
  


// exports.allUsers = async (req, res, next) => {
//     const users = await User.find();
//     res.status(200).json({
//         success: true,
//         users
//     })
// }

// exports.getUserDetails = async (req, res, next) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//         return res.status(400).json({ message: `User does not found with id: ${req.params.id}` })
//         // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
//     }

//     res.status(200).json({
//         success: true,
//         user
//     })
// }

// exports.updateUser = async (req, res, next) => {
//     console.log('User ID:', req.params.id); // Log user ID
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true,
//         runValidators: true,
//         // useFindAndModify: false
//     })

//     if (!user) {
//         console.log('User not found'); // Log if user is not found
//         return res.status(404).json({
//             success: false,
//             error: 'User not found'
//         });
//     }

//     return res.status(200).json({
//         success: true
//     });
// }

// exports.deleteUser = async (req, res, next) => {
//     const user = await User.findById(req.params.id);

// if (!user) {
//     return res.status(401).json({ message: `User not found with id: ${req.params.id}` });
// }

// // Check if the user has an avatar and get its public_id
// const image_id = user.avatar && user.avatar.length > 0 ? user.avatar[0].public_id : null;

// // If the user has an avatar, remove it from Cloudinary
// if (image_id) {
//     await cloudinary.v2.uploader.destroy(image_id);
// }

// // Remove the user from the database
// await User.findByIdAndRemove(req.params.id);

// return res.status(200).json({ success: true });

// }

// exports.googleLogin = async (req, res) => {
//     try {
//         const { tokenId } = req.body;

//         const verify = await client.verifyIdToken({ idToken: tokenId, audience:"920213136950-8j3ng8qursis2pib3qhav9q2larqfu89.apps.googleusercontent.com" });

//         const { email_verified, email, name, picture } = verify.payload;

//         if (!email_verified) return res.status(400).json({ msg: "Email verification failed." });

//         let user = await User.findOne({ email });

//         if (!user) {
//             const passwordHash = await bcrypt.hash(email, 12);

//             const newUser = new User({
//                 name,
//                 email,
//                 password: passwordHash,
//                 avatar: {
//                     public_id: 'default',
//                     url: picture
//                 }
//             });

//             await newUser.save();

//             user = newUser;
//         }

//         sendToken(user, 200, res);
//     } catch (err) {
//         console.error(err);
//         if (err.response) {
//             console.error('Response data:', err.response.data);
//             console.error('Response status:', err.response.status);
//         }
//         return res.status(500).json({ msg: err.message });
//     }
//   };
