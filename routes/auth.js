const express = require("express");
const router = express.Router();

function checkUser(req, res, next){  
    if(!req.session.user){
        req.session.message = {
            title: "접근 금지!",
            message: "로그인 이후에 이용가능한 서비스입니다. 로그인 이후 다시 시도해 주시기 바랍니다."
        }
        res.redirect("/sign-in");
    }
    else next();
}

function checkGuest(req, res, next){
    if(req.session.user){
        req.session.message = {
            title: "접근 금지!",
            message: "로그인 이후에는 이용할 수 없는 서비스입니다. 로그아웃 이후 다시 시도해 주시기 바랍니다."
        }
        res.redirect("/");
    }
    else next();
}


/**
 * User
 */
router.get("/mypage", checkUser);
router.get("/movies/recommend", checkUser);


/**
 * Guest
 */
router.get("/sign-in", checkGuest);
router.get("/sign-up", checkGuest);


module.exports = router;