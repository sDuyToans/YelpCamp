const { campgroundSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { reviewSchema } = require('./schemas');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
            return next();
    }
    req.flash('error', 'You must be signed in first!');
    req.session.returnTo = req.originalUrl; 
    res.redirect('/login');
}


module.exports.validateCampground = (req, res, next) =>{
    const { error } = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
    next();
    }
}

module.exports.isAuthor = async (req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user.id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}