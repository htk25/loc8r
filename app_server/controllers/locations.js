var request = require("request");
var apiOptions = {server : "http://localhost:3000"};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = 'https://loc8r4.herokuapp.com';
}

function renderHomepage(req,res,responseBody){
  var message;
  if(!(responseBody instanceof Array)){
    message = "API look up error";
    if(responseBody.message != null)
      message = responseBody.message;
    responseBody = [];
  }
  else{
    //If the returned locations array is empty
    if(!responseBody.length){
      message = "No places found nearby";
    }
  }
  res.render('location-list', 
    { 
      title: 'Loc8r - find a place to work with wifi',
      pageHeader:{
        title:'Loc8r',
        strapline:'Find places to work with wifi near you!'
      },
      sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
      locations: responseBody,
      message: message
    }
  );
}

function renderDetailpage(req,res,responseBody){
  res.render('location-info', { 
    title: responseBody.name,
    pageHeader:{title: responseBody.name},
    sidebar:{
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t  please leave a review to help other people just like you.'
    },
    location: responseBody
  });
}

function renderReviewForm(req,res,location){
  res.render('location-review-form', { 
    title: 'Review '+ location.name +' on Loc8r',
    pageHeader:{
      title: 'Review '+ location.name
    }, 
    error: req.query.err
  });
}

function _showError (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

function getLocationInfo(req,res,callback){
  var requestOptions = {
    url: apiOptions.server+"/api/locations/"+req.params.locationid,
    method:"GET",
    json:{}
  };

  request(requestOptions, 
    function(err, response, body){
      if(err)
        console.log(err);
      else{
        var data = body;
        //console.log(req);
        if(response.statusCode == 200){
          callback(req,res,data);
        }
        else{
          _showError(req,res,response.statusCode);
        }
      }
      
    }
  )
}

/* GET home page */
module.exports.homelist = function(req, res){
  var requestOptions = {
    url: apiOptions.server+"/api/locations",
    method:"GET",
    json:{},
    qs:{
      lng : -0.7992599,
      lat : 51.378091,
      maxDistance : 10
    }
  };
  //Making API call to get a list of locations nearby
  //and pass it to the renderHomepage function in the callback(once
  //the API call is completed)
  request(requestOptions, 
    function(err, response, body){
      if(err)
        console.log(err);
      else{
        if(response.statusCode === 200 && body)
          for(let i = 0; i < body.length; i++){
            //Round to 1 digit after the decimal
            body[i].distance = body[i].distance.toFixed(1)+" miles";
          }
        
      }
      renderHomepage(req,res,body);
    }
  )
};

/* GET 'Location info'/the detail page */
module.exports.locationInfo = function(req, res){
  getLocationInfo(req,res,renderDetailpage);
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  getLocationInfo(req,res,renderReviewForm);
};

/* POST 'Add review' page */
module.exports.doAddReview = function(req, res){
  
  var requestOptions, locationid = req.params.locationid;
  requestOptions = {
    url: apiOptions.server+"/api/locations/"+locationid+"/reviews",
    method: "POST",
    json: {
      author: req.body.name,
      rating: parseInt(req.body.rating, 10),
      reviewText: req.body.review
    }
  };
  //Inputs validations, make sure not empty
  if (!requestOptions.json.author || (!requestOptions.json.rating && requestOptions.json.rating != 0 )|| !requestOptions.json.reviewText) {
    res.redirect('/location/' + locationid + '/reviews/new?err=val');
    return;
  }

  request(requestOptions, 
    function(err, response, body){
      console.log(response);
      if(response.statusCode === 201)
        res.redirect('/location/'+locationid);
      else if(response.statusCode===400 && body.name && body.name === "ValidationError")
        res.redirect("/location/"+locationid+"/reviews/new?err=val");
      else
        _showError(req,res,response.statusCode);
    }
  )
};