#!/usr/bin/python3 

# the purpose of doing this bundling is that we can just refer to everything by a friendly string

import sys
import argparse
import subprocess
import os
import os.path
import time

def find_images(source_dir, filetypes):
    out = []
    
    for ftype in filetypes:        
        fff = subprocess.run(["find", source_dir, "-type", "f", "-name", "*."+ftype],
                           stdout=subprocess.PIPE,
                           universal_newlines=True)\
            .stdout.strip().split(sep="\n")
        
        if fff != ['']:
            out += fff
                
    return out

def build_manifest(images, source_dir, mpath):
    l="require('"
    r="');"
        
    fnsource = """
const img = (props) => {
    var source = IMG[props.name];    
    var realprops = (typeof props !== 'undefined') ? props : {} ;
    realprops['source'] = source;
	return <Image  {... realprops} />;
}
"""    
 
    with open(mpath, 'w') as manifest:
        print("/* autogenerated by bundler.py at", time.strftime("%c %z", time.localtime(time.time())), "*/", file=manifest)
        print("import React from 'react';\nimport {Image} from 'react-native';\n", file=manifest)
        print("var IMG = {};", file=manifest)
        names = []
        for i in images:
        
            fname = os.path.splitext(os.path.basename(i))[0]
            name = fname[0].capitalize()    
            if len(fname) > 1:
                name += fname[1:]
            names.append(name)
            
            prefix = os.path.commonprefix([source_dir, i])            
            suffix = i.lstrip(prefix)
            
            print('IMG["'+name+'"] =', l+os.path.join('.', i)+r, file=manifest)
                        
        print(fnsource, file=manifest)
        print("export default img;", file=manifest)

if __name__ == "__main__":
    
    filetypes = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp',]
    source_dir = os.getcwd()
    
    parser = argparse.ArgumentParser(description="bundle up the images")
            
    parser.add_argument('--source_dir', dest='source_dir',
                    action='store', default=source_dir,
                    help="The directory containing the source files")

    parser.add_argument('--manifest', dest='manifest', help="where to put the manifest file (default: ./manifest.js)",
                    action='store', default=os.path.join(source_dir, "manifest.js"))
                    
    parser.add_argument('filetypes', nargs='*', default=filetypes, 
                    help="which files to consider as images to bundle (default: "+' '.join(filetypes)+")")

    arguments = parser.parse_args()

    build_manifest(find_images(arguments.source_dir, arguments.filetypes), arguments.source_dir, arguments.manifest)