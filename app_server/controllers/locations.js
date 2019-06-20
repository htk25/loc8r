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
  res.render('location-info', { 
    title: 'Starcups',
    pageHeader:{title: 'Starcups'},
    sidebar:{
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t  please leave a review to help other people just like you.'
    },
    location:{
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      coords:{lat:51.455041, lng: -0.9690884},
      openingTimes: [
      { 
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false,
      },
      {
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false,
      },
      {
        days: 'Sunday',
        closed: true,
      }],
      reviews: [{
        author: 'Simon Holmes',
        rating: 5,
        timestamp: '16 July 2013',
        reviewText: 'What a great place. I can\'t say enough good things about it.'  
      }]
    }
  });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  res.render('location-review-form', { 
    title: 'Review Starcups on Loc8r',
    pageHeader:{
      title: 'Review Starcups'
    } 
  });
};