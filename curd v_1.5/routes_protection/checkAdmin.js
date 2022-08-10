const checkAdmin = (req, res, next)=>{
    if(req.session.userType === 'isAdmin'){
        next();
    }else{
        res.redirect('/dashboard')
    }
}

module.exports = { checkAdmin };