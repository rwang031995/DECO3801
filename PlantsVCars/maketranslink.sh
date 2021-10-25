#!/bin/bash

# TransLink shape/route and stop data 

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

.import trips.txt Trips
.import routes.txt Routes
.import stops.txt StopsTmp
.import stop_times.txt StopTimes

CREATE VIEW RStmp AS 
    SELECT DISTINCT route_short_name, shape_id, trip_id, route_type
    FROM Routes, Trips 
    WHERE Routes.route_id = Trips.route_id; 

CREATE TABLE Stops AS
    SELECT CAST(stop_id AS INTEGER) AS stop_id, 
        CAST(stop_lat AS REAL) AS lat, CAST(stop_lon AS REAL) AS lon
    FROM StopsTmp;

CREATE VIEW BSTmp AS
    SELECT DISTINCT StopTimes.stop_id
    FROM RStmp, StopTimes
    WHERE (RSTmp.trip_id = StopTimes.trip_id)
        AND ((RSTmp.route_type = 3) OR (RSTmp.route_type = 6));

CREATE TABLE BusStops AS
    SELECT CAST(Stops.stop_id AS INTEGER) AS stop_id, lat, lon
    FROM BSTmp, Stops
    WHERE (BSTmp.stop_id = Stops.stop_id);


CREATE VIEW TSTmp AS
    SELECT DISTINCT StopTimes.stop_id
    FROM RStmp, StopTimes
    WHERE (RSTmp.trip_id = StopTimes.trip_id)
        AND (RSTmp.route_type < 3);

CREATE TABLE TrainStations AS
    SELECT CAST(Stops.stop_id AS INTEGER) AS stop_id, lat, lon
    FROM TSTmp, Stops
    WHERE (TSTmp.stop_id = Stops.stop_id);

DROP VIEW  RStmp;
DROP VIEW  BStmp;
DROP VIEW  TStmp;
DROP TABLE Trips;
DROP TABLE Routes;
DROP TABLE StopsTmp;
DROP TABLE Stops;
DROP TABLE StopTimes;
VACUUM;
.dump
" | sqlite3 | sqlite3 "$2"


# removed: 
# .import shapes.txt Shapes
# CREATE TABLE RouteShapes AS 
#     SELECT DISTINCT route_short_name AS route, 
#         CAST(shape_pt_lat AS REAL) AS lat, CAST(shape_pt_lon AS REAL) AS lon 
#     FROM RStmp, Shapes 
#     WHERE Shapes.shape_id = RStmp.shape_id; 
# CREATE INDEX idx_loc ON RouteShapes (lat, lon); 
