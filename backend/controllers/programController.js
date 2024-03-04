const Program = require('../models/program');
const cloudinary = require('cloudinary');

exports.newProgram = async (req, res, next) => {
    const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
const imagesLinks = [];

for (let i = 0; i < images.length; i++) {
  const imageDataUri = images[i];

  try {
    const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
      folder: 'programs', // Change folder name if needed
      width: 150,
      crop: "scale",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url      
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading images to Cloudinary'
    });
  }
}

req.body.images = imagesLinks;
// req.body.user = req.user.id;

try {
  const program = await Program.create(req.body);

  if (!program) {
    return res.status(400).json({
      success: false,
      message: 'Program not created'
    });
  }

  res.status(201).json({
    success: true,
    program
  });

} catch (error) {
  console.error(error.message);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
}

};


exports.getPrograms = async (req, res, next) => {
    try {
        const programs = await Program.find();
        res.status(200).json({
            success: true,
            programs,
        });
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

exports.getSingleProgram = async (req, res, next) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).json({
                success: false,
                message:'Program not found',
            });
        }
        res.status(200).json({
            success: true,
            program,
        });
    } catch (error) {
        console.error('Error fetching single Program:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

exports.updateProgram = async (req, res, next) => {
	let program = await Program.findById(req.params.id);
	// console.log(req.body)
	if (!program) {
		return res.status(404).json({
			success: false,
			message: 'Program not found'
		})
	}
	let images = []

	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}
	if (images !== undefined) {
		for (let i = 0; i < program.images.length; i++) {
			try {
				let imageDataUri = program.images[i]
			const result = await cloudinary.v2.uploader.destroy(`${imageDataUri.public_id}`)
			} catch (error) {
				console.log(error)
			}
		}
	}
	let imagesLinks = [];
	for (let i = 0; i < images.length; i++) {
		try {
			let imageDataUri = images[i]
		const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
			folder: 'programs',
			width: 150,
			crop: "scale",
		});
		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url
		})
		} catch (error) {
			console.log(error)
		}
		

	}
	req.body.images = imagesLinks
	program = await Program.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!program)
		return res.status(400).json({
			success: false,
			message: 'Program not updated'
		})
	// console.log(product)
	return res.status(200).json({
		success: true,
		program
	})
}


exports.deleteProgram = async (req, res, next) => {
	const programs = await Program.findByIdAndDelete(req.params.id);
	if (!programs) {
		return res.status(404).json({
			success: false,
			message: 'Program not found'
		})
	}

	res.status(200).json({
		success: true,
		message: 'Program deleted'
	})
}