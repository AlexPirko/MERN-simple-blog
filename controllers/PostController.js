import PostSchema from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostSchema.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get article',
        });
    }
};

export const getAllPopular = async (req, res) => {
    try {
        const popular = await PostSchema.find()
            .sort({ viewsCount: -1 })
            .populate('user')
            .exec();
        res.json(popular);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get article',
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostSchema.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get tags',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostSchema.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
        )
            .populate('user')
            .then((doc, err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Failed to return the article',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'The article not found',
                    });
                }
                res.json(doc);
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostSchema({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create article',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostSchema.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
        );
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update the article',
        });
    }
};

export const removeOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostSchema.findOneAndDelete({
            _id: postId,
        }).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Failed to remove the article',
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'The article not found',
                });
            }
            res.json({
                success: true,
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error',
        });
    }
};
