// Geography related functions and such

import kdTree from 'k-d-tree';

import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import * as Crypto from 'expo-crypto';
import * as TaskManager from 'expo-task-manager';
import {Asset} from 'expo-asset';

import * as LRUCache from 'lru-cache';

function distanceApproxJSON(pointA, pointB){
    /* 
        Points A, B in lat/lon GeoJson
        Distance in metres
    */
    return distanceApprox(pointA.coordinates[0], pointA.coordinates[1], pointB.coordinates[0], pointB.coordinates[1])
}

function distanceApprox(lonA, latA, lonB, latB){
    /* Coordinates in degrees
       Distance in metres
       Equirectangular approximation
    */
    
    let _lonA = lonA * Math.PI / 180;
    let _latA = latA * Math.PI / 180;
    let _lonB = lonB * Math.PI / 180;
    let _latB = latB * Math.PI / 180;
    
    
    // longitudinal difference scales by latitude
    // (approximation by average latitude)
    let x = (_lonB - _lonA) * Math.cos((_latA + _latB)/2);
    
    // difference in latitudes doesn't need to be scaled
    let y = (_latB - _latA);
    
    // finally scale hypotenuse by radius of spherical Earth in metres
    return 6378137.0 * Math.hypot(x, y);
}

// Calculate the area of the triangle 
// use points, not side length, to better handle collinearity
function triangleAreaPoints(a, b, c){
    return 0.5 *  Math.abs(a[0]*(b[1] - c[1]) + b[0]*(c[1] - a[1]) + c[0]*(a[1] - b[1]));
}

function triangleMetric(self, tree){
    points = tree.nearest(self, 2);
    left = points[0][0].coordinates;
    right = points[1][0].coordinates;
    base = Math.hypot((left[0] - right[0]) + (left[1] - right[1]));
    return triangleAreaPoints(self.coordinates, left, right)/base;
}


var gtfs_db;

async function prepareShapesDb() {
    /** update 'translink.db' to be dbAsset
     *  @param dbAsset: the asset reference via require() 
     */

  let dirinfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite");

  if (!(dirinfo.exists && dirinfo.isDirectory)){
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/translink.db')).uri,
    FileSystem.documentDirectory + 'SQLite/translink.db'
  );
  
  gtfs_db = SQLite.openDatabase('translink.db');
}

var stopsTree = new kdTree([], distanceApproxJSON);

function prepareStops(){
    dbQuery(gtfs_db, "SELECT * FROM Stops;", [],
        (t, r) => {
            let points = []
            for (i = 0; i < r.rows.length; i++){
                let x = r.rows.item(i);
                stopsTree.insert({"type": "Point", "coordinates": [x.lon, x.lat], 
                    "properties" : {"stop_id" : x.stop_id}});
            }
        });
}

function dbQuery(database, statement, args, success, failure){
    /** A wrapper for database.transaction(tx => {tx.executeSql(_____)}) 
     *  @param database: an Expo SQLite database
     *  @param statement: the SQL statement (use ? for binding)
     *  @param args: an array of arguments to be bound
     *  @param success: the success callback
     *  @param error: the error callback
     */ 
    database.transaction(tx => {tx.executeSql(statement, args, success, failure)}, 
        (e) => {console.warn(e, "in Geography.dbQuery")},
        () => {/*console.log('finished DB query')*/});
}

var _pointsBuffer = []; // [[longitude, latitude, timestamp], ...]

var _travelHistory = [];

var thisSegFlavour = "";

function getRoutesForPoints(pbuf, db){
    // We have to consider a bunch of routes within the bounding box of the segment    
    
    console.log("Searching for PT routes across ", pbuf.length, "points");
    
    bboxMinLon = pbuf.reduce((prev, curr) => Math.min(prev, curr[0]), 999);
    bboxMaxLon = pbuf.reduce((prev, curr) => Math.max(prev, curr[0]), -999);
    bboxMinLat = pbuf.reduce((prev, curr) => Math.min(prev, curr[1]), 999);
    bboxMaxLat = pbuf.reduce((prev, curr) => Math.max(prev, curr[1]), -999);
    
    console.log("Bounding box: ", bboxMinLon, bboxMinLat, bboxMaxLon, bboxMaxLat);
    
    var shapesTrees = {};
    
    dbQuery(db, "SELECT * FROM RouteShapes WHERE (lon >= ?) AND (lon <= ?) AND (lat >= ?) AND (lat <= ?);",
    [bboxMinLon, bboxMaxLon, bboxMinLat, bboxMaxLat],
        (t, r) => {
            console.log(t);
            console.log(r);
        }
    )
    
    return {"error": 0, "route": "DERP"};

}

function segmentPoints(){
    /* Iterate over the points buffer and classify into journeys.
        
        Business rules:
        
        * generally under 10km/h is active transport
        * 5 minutes spent in a 200m bounding box marks not a trip
        * faster trips get matched to bus routes
        * exact matches get credited
        * the hard part is distinguishing scoots vs cars
        * sustaining above 50 km/h for more than 30 seconds means motorised transport
        * generally prefer to not end trips 
        * passing through a transport stop is a mode-change possibility?
        * points older than two hours get removed
    */
    
    // we're going to disregard timestamps older than two hours for sanity 
    //  (our timestamps are in milliseconds)
    let timestamp = _pointsBuffer[_pointsBuffer.length - 1][2] - 7200000;
    
    let segments = [];
    
    let thisSegStart = 0;
    let thisSegDist = 0;
    let thisSegTime = 0;
    
    // we're going to average the last three points once we can
    let firSpeed = 0;
    
    for(i=1; i < _pointsBuffer.length; i++){
        let lon = _pointsBuffer[i][0];
        let lat = _pointsBuffer[i][1];
        let ts  = _pointsBuffer[i][2];
        
        if (ts < timestamp){
            continue; // disregard old timestamps and catch up
        }
        
        // find out if we've been in the same area for a while
        // we should only get updates every 100m, so if two updates ago is > 5 minutes ago
        // that qualifies
        if ((i > 2) && (ts - _pointsBuffer[i-2] > 300000)){
            // signal new segment
            console.log("new segment: stopped");
            // store old segment
            _travelHistory.push([thisSegFlavour, ts])
            // reset 
            thisSegStart = i;
            thisSegDist = 0;
            thisSegTime = 0;
            continue;
        }
        
        // previous...
        let prevLon = _pointsBuffer[i-1][0];
        let prevLat = _pointsBuffer[i-1][1];
        let prevTs  = _pointsBuffer[i-1][2];
        
        let dist = distanceApprox(prevLon, prevLat, lon, lat);
        let time = ts - prevTs;
        
        // speed in km/h. We have metres per millisecond by default, which is also km/s
        let speed = 3600 * dist / time;
        
        // we're basically segmenting based on recent average speed
        
        // just started a new segment
        if (thisSegTime == 0){ 
            thisSegDist += dist;
            thisSegTime += time;
            continue;
        } 

        let segSpeed = 3600 * thisSegDist / thisSegTime;
        
        console.log(i, " segSpeed: ", segSpeed, " inst speed: ", speed);
        
        if (segSpeed < 11){
            if (speed > 11){
                // no longer walking, new segment
                // store old segment
                console.log("new segment: faster")
                _travelHistory.push([thisSegFlavour, ts])
                // reset
                thisSegStart = i;
                thisSegDist = 0;
                thisSegTime = 0;
                thisSegFlavour = "";
                continue;
            }
        } 
        // same segment
        thisSegDist += dist;
        thisSegTime += time;
    }
    
    // delete former segments from points buffer when we're done with them
    if (thisSegStart > 0){
        _pointsBuffer.splice(0, Math.min(0, thisSegStart - 1));
    }

    // figure out if the most recent segment is public transport
        
    let res = getRoutesForPoints(_pointsBuffer, gtfs_db);
    
    if (res.error > 1000) {
        // probably not on PT
        if (segSpeed > 40) {
            // definitely motorised
            thisSegFlavour = "Private Vehicle"
        } else {
            // assume AT
            thisSegFlavour = "Active Transport"
        }
    } else {
        // assume PT
        thisSegFlavour = "Public Transport: " + res.route;
    }    
}

/** 
 * The background task that handles location updates (registered on first import of
 * Geography module). Requires Location.requestBackgroundPermissionsAsync() to be 
 * successfully granted BEFORE activation with Location.startLocationUpdatesAsync().
 * Balanced accuracy is fine. 
 */
let LOCATION_UPDATES_TASK = "LOCATION_UPDATES";
TaskManager.defineTask(LOCATION_UPDATES_TASK, ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    console.log(error.message);
    return;
  }
  // THIS IS WHERE THE MAGIC HAPPENS
//   console.log('Received new locations', locations);
  
  // update locations buffer
  
  let latitude = locations[locations.length - 1].coords.latitude;
  let longitude = locations[locations.length - 1].coords.longitude;
  let timestamp = locations[locations.length - 1].timestamp;
  
  _pointsBuffer.push([longitude, latitude, timestamp]);
  
  console.log("most recent location:", latitude, longitude)
    
//   console.log("nearest:", stopsTree.nearest({"type": "Point", "coordinates": [longitude, latitude]}, 1))
  
  segmentPoints();
   
});


export {dbQuery, prepareShapesDb, prepareStops, LOCATION_UPDATES_TASK, stopsTree, gtfs_db, distanceApprox /* todo: bus route history */};