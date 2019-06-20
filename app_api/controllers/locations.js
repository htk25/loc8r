var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

//#region Helper functions
function metersToMiles(i) {
  return i*0.000621371192;
}
function milesToMeters(i) {
  return i*1609.344;
}

function sendJsonResponse (res, status, content) {
  res.status(status);
  res.json(content);
};
//#endregion

//Completed
module.exports.locationsListByDistance = function(req,res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDis = parseFloat(req.query.maxDistance);
  if ( lng == null || lat == null || maxDis == null) {
    sendJsonResponse(res, 404, {message: "lng, lat and maxDis query parameters are required"});
    return;
  }
  //This is a geoJSON object
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  
  Loc
    .aggregate([{
      $geoNear: {
        //The "origin" point
        near: point,
        //Distance unit is meters when near is a geoJSON object
        spherical: true,
        maxDistance: milesToMeters(maxDis),// Within maxDis miles
        distanceField: "dist.calculated",
        num:10
      }
    }])
    .exec(function(err, results){
      //call back function when the computation is done
      if(err){
        sendJsonResponse(res,400,err);  
        return;
      }
      var locations = []
      results.forEach(result=>{
        locations.push(
          {
            distance : metersToMiles(result.dist.calculated),
            name: result.name,
            address: result.address,
            rating: result.rating,
            facilities: result.facilities,
            _id: result._id
          }
        );
      });
      sendJsonResponse(res,200,locations);
    })

  // Loc.geoNear(point, geoOptions, function(err, results, stats){
       
    
    
  // });

  // sendJsonResponse(res,200,{"status":"success"});
};

//Completed
module.exports.locationsCreate = function(req,res){
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    //rating: req.body.rating,   Not used for some reasons?
    facilities: req.body.facilities.split(","),
    coords:[parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
      }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  },function(err, doc){
    if(err)
      sendJsonResponse(res,400,err);
    sendJsonResponse(res,201,doc);
  });

  
};

//Completed
module.exports.locationsReadOne = function(req,res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .exec(function(error, location){
        //location is just a JSON object
        if(!location)
          sendJsonResponse(res,404,{
            "message":"locationid not found"
          });
        else if(error)
          sendJsonResponse(res,400,error);
        else
          sendJsonResponse(res,200,location);
      });
  }
  else{
    sendJsonResponse(res, 404,{
      "message": "No locationid in request"
    });
  }

  
};

//Completed
module.exports.locationsUpdateOne = function(req,res){
  if(!req.params.locationid){
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid is required"
      });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      function(err, location){
        if (!location) {
          sendJsonResponse(res, 404, {
          "message": "locationid not found"
          });
          return;
        } 
        else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        else{
          location.name = req.body.name;
          location.address = req.body.address;
          location.facilities = req.body.facilities.split(",");
          location.coords = [parseFloat(req.body.lng),
            parseFloat(req.body.lat)];
          location.openingTimes = [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
          }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
          }];
          location.save(
            function(err, location){
              if (err) {
                sendJsonResponse(res, 404, err);
              } 
              else {
                sendJsonResponse(res, 200, location);
              }
            }
          )
        }
      }
    );
  
};

//Completed
module.exports.locationsDeleteOne = function(req,res){
  var locationid = req.params.locationid;
  if(!locationid){
    sendJsonResponse(res,404,{"message":"No location ID"});  
  }
  else{
    Loc
      .findById(locationid)
      .exec(function(err, location){
        if(!location)
          sendJsonResponse(res,404,{"message":"Location Not Found"});  
        else if(err)
          sendJsonResponse(res,400,err);  
        else{
          Loc
            .remove(locationid)
            .exec(
              function(err, location){
                if(err)
                  sendJsonResponse(res,400,err);  
                else{
                  sendJsonResponse(res,204,null);  
                }
              }
            );
        }
      });
  }
  sendJsonResponse(res,200,{"status":"success"});
};


