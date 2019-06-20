var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};



var mongoose = require('mongoose').set('debug',true);
var Loc = mongoose.model('Location');

function doAddReview(req,res,location){
  if (!location) {
    sendJsonResponse(res, 404, {
      "message": "locationid not found"
    });
  } 
  else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location) {
      var thisReview;
      if (err) {
        sendJsonResponse(res, 400, err);
      } 
      else {
        //This function should require database connection.
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
}

function updateAverageRating(locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(function(err, location) {
      if (!err) {
        doSetAverageRating(location);
      }
      else{
        console.log("updateAverageRatingError!");
      }
  });
}

function doSetAverageRating(location) {
  var reviewCount, ratingAverage, sumRating;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    sumRating = 0;
    for (let i = 0; i < reviewCount; i++) {
      sumRating += location.reviews[i].rating;
    }
    ratingAverage = parseInt(sumRating / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if (err) 
        console.log(err);
      else 
        console.log("Average rating updated to", ratingAverage);
    });
  }
}

//Completed
module.exports.reviewsCreate = function(req,res){
  var locationid = req.params.locationid;
  if(locationid){
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(function(err, location){
        if(err)
          sendJsonResponse(res,400,err);
        else
          doAddReview(req, res, location);
      });
  }
  else{
    sendJsonResponse(res,404,{
      "Message":"Not found, locationid required"
    });
  }
};

//Completed
module.exports.reviewsReadOne = function(req,res){

  if(req.params  && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(function(error, location){
        var response, review;

        if(!location){
          sendJsonResponse(res,404,{
            "message":"locationid not found"   
          });
          
        }
        else if(error)
          sendJsonResponse(res,400,error);
        else{
          if(location.reviews && location.reviews.length > 0){
            review = location.reviews.id(req.params.reviewid);
            if(review == null){
              
              sendJsonResponse(res, 404, {
                "message": "reviewid not found"
              });
              
            }
            else{
              response = {
                location : {
                  name : location.name,
                  id : req.params.locationid
                },
                review : review
              };
              sendJsonResponse(res, 200, response);
            }
          }
          else
            sendJsonResponse(res,404,{
              "message": "No reviews found"
            });
          }
      });
  }
  else{
    sendJsonResponse(res, 404,{
      "message": "Not found, locationid and reviewid are both required"
    });
  }

};

//Completed
module.exports.reviewsUpdateOne = function(req,res){
  if(!req.params.locationid||!req.params.reviewid){
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
      });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
      function(err, location) {
      var thisReview;

      if (!location) {
        sendJsonResponse(res, 404, {
          "message": "locationid not found"
        });
        return;
      } 

      if (err) {
        sendJsonResponse(res, 400, err);
        return;
      }

      if (location.reviews && location.reviews.length > 0) {
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          sendJsonResponse(res, 404, {
          "message": "reviewid not found"
          });
        } 
        else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(
            function(err, location) {
              if (err) {
                sendJsonResponse(res, 404, err);
              } 
              else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 200, thisReview);
              }
            }
          );
        }
      } 
      else {
        sendJsonResponse(res, 404, {
          "message": "No review to update"
        });
      }
    }
  );
};

module.exports.reviewsDeleteOne = function(req,res){
  if(!req.params.locationid || !req.params.reviewid){
    sendJsonResponse(res,404,{"message":"Not found, locationid and reviewid are both required"});  
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select("review")
    .exec(
      function(err,location){
        if (!location) {
          sendJsonResponse(res, 404, {"message": "locationid not found"});
          return;
        } 
        if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        if(location.reviews && location.reviews.length > 0){
          var thisReivew = location.reviews.id(req.params.reviewid);
          if(!thisReivew){
            sendJsonResponse(res, 404, {"message": "reviewid Not Found"});
            return;
          }
          thisReview.remove();
          location.save(
            function(err, location){
              if (err) {
                sendJsonResponse(res, 400, err);
                return;
              }
              updateAverageRating(req.params.locationid);
              sendJsonResponse(res, 204, null);
            }
          );
        }
        else{
          sendJsonResponse(res, 404, {"message": "No reviews to delete"});
        }
        
      }
    );

  sendJsonResponse(res,200,{"status":"success"});
};


