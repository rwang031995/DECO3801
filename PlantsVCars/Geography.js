// Geography related functions and such

import kdTree from 'k-d-tree';

import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import * as Crypto from 'expo-crypto';
import * as TaskManager from 'expo-task-manager';

import * as LRUCache from 'lru-cache';

async function prepareShapesDb(dbAsset) {
    /** update 'shapes.db' to be dbAsset
     *  @param dbAsset: the asset reference via require() 
     */
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/shapes.db')).exists) {  
      await FileSystem.downloadAsync(
        dbAsset.uri,
        FileSystem.documentDirectory + 'SQLite/shapes.db'
      );
  }
  return true;
}

function dbQuery(database, statement, args, success, failure){
    /** A wrapper for database.transaction(tx => {tx.executeSql(_____)}) 
     *  @param database: the database
     *  @param statement: the SQL statement (use ? for binding)
     *  @param args: an array of arguments to be bound
     *  @param success: the success callback
     *  @param error: the error callback
     */ 
    database.transaction(tx => {tx.executeSql(statement, args, success, failure)});
}

function getRoutesForPoints(){}


/** 
 * The background task that handles location updates (registered on first import of
 * Geography module). Requires Location.requestBackgroundPermissionsAsync() to be 
 * successfully granted BEFORE activation with Location.startLocationUpdatesAsync().
 * Balanced accuracy is fine. 
 */
const LOCATION_UPDATES_TASK = "LOCATION_UPDATES";
TaskManager.defineTask(LOCATION_UPDATES, ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    console.log(error.message);
    return;
  }
  // THIS IS WHERE THE MAGIC HAPPENS
  console.log('Received new locations', locations);
  
  // update locations buffer
  
  // figure out WTF we're doing right now
  
  // run getRoutesForPoints if relevant
   
});


export {dbQuery, prepareShapesDb, LOCATION_UPDATES_TASK /* todo: bus route history */};