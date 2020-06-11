const { User } = require('../../models/user');
const cloudinaryUpload = require('../../services/cloudinary');
const formidable = require('formidable')

async function setProfilePic(req, res) {

    const form = new formidable.IncomingForm();
    form.parse(req, async(formError, fields, files) => {
        if(formError){
            console.error(form);
            return res.status(400).json(formError);
        }

        req.body = files;

        let user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(400).json({ "error": "User not found" });

        if(files.photo){
            const {secure_url, err} = await cloudinaryUpload(files.photo.path);
            if(err) {
                console.error(err);
                res.status(400).json({ "error": err });
            }

            user.photo = secure_url;
        }

        await user.save();
        res.status(200).json({"error": null });
    });

}

module.exports = setProfilePic;