#!/bin/bash

# TransLink shape and route data 

USAGE="maketranslink.sh <gtfs_directory> <shapes_db>"

GTFSDIR=""
STOPSDB=""

# gotta be exactly two arguments
if [[ $# -ne 2 ]]; then
    echo "Usage: $USAGE"
    exit
fi

set -e

if [ -f "$2" ]; then
    rm "$2"
fi

echo ".cd '$1'
.mode csv

.import shapes.txt Shapes 
.import trips.txt Trips
.import routes.txt Routes

CREATE VIEW RStmp AS 
    SELECT DISTINCT route_short_name, shape_id 
    FROM Routes, Trips 
    WHERE Routes.route_id = Trips.route_id; 

CREATE TABLE RouteShapes AS 
    SELECT DISTINCT route_short_name AS route, 
        CAST(shape_pt_lat AS REAL) AS lat, CAST(shape_pt_lon AS REAL) AS lon 
    FROM RStmp, Shapes 
    WHERE Shapes.shape_id = RStmp.shape_id; 

CREATE INDEX idx_loc ON RouteShapes (lat, lon); 

DROP VIEW  RStmp;
DROP TABLE Shapes;
DROP TABLE Trips;
DROP TABLE Routes;

.dump
" | sqlite3 | sqlite3 "$2"

# then something like
# SELECT * FROM RouteShapes WHERE (lat BETWEEN foo AND bar) AND (lon BETWEEN baz AND qux);


# if for some reason we revert to going by stop location, not by shape:

# echo ".cd '$1'
# .mode csv
# 
# .import stops.txt Stops 
# .import stop_times.txt StopTimes 
# .import trips.txt Trips
# .import routes.txt Routes
# 
# CREATE VIEW RStmp AS 
#     SELECT DISTINCT route_id, stop_id 
#     FROM StopTimes, Trips 
#     WHERE StopTimes.trip_id = Trips.trip_id; 
# 
# CREATE TABLE RouteStops AS 
#     SELECT DISTINCT route_short_name AS route, Stops.stop_id AS stop_id, CAST(stop_lat AS REAL) AS lat, CAST(stop_lon AS REAL) AS lon 
#     FROM RStmp, Routes, Stops 
#     WHERE Routes.route_id = RStmp.route_id AND Stops.stop_id = RStmp.stop_id; 
# 
# CREATE INDEX idx_loc ON RouteStops (lat, lon); 
# DROP VIEW  RStmp;
# DROP TABLE Stops;
# DROP TABLE StopTimes;
# DROP TABLE Trips;
# DROP TABLE Routes;
# .dump
# " | sqlite3 | sqlite3 "$2"


