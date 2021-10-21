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

.import shapes.txt Shapes 
.import trips.txt Trips
.import routes.txt Routes
.import stops.txt StopsTmp

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

CREATE TABLE Stops AS
    SELECT CAST(stop_id AS INTEGER) AS stop_id, 
        CAST(stop_lat AS REAL) AS lat, CAST(stop_lon AS REAL) AS lon
    FROM StopsTmp;

DROP VIEW  RStmp;
DROP TABLE Shapes;
DROP TABLE Trips;
DROP TABLE Routes;
DROP TABLE StopsTmp;
VACUUM;
.dump
" | sqlite3 | sqlite3 "$2"

