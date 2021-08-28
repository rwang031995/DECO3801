# Garden Layout

We need: 

[ ] a template layout for items to go in 
[ ] a data structure of items 
[ ] a mechanism to apply datastructure to layout 

## Defining the layout

## Defining the data structure

Presumably this is some sort of JSON. 

Fields: 

- item type
    - can have a manifest of images in `./images`
        - the yak shaving begins

## Loading and saving 

Load:
- read the structure into an im-memory object
- go through the IMO and put that into the template

Model->View setup dealio


## Image bundler 

A mechanism now exists for you to create images by name! 

See `images/bundler.py` and `images/manifest.js`, which it produces