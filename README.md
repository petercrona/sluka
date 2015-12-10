# sluka
A simple JavaScript parser library. Suitable to use when building 
more complicated parsers. I use it in project Latmask, which is a project that
parses Spring REST endpoints and generates corresponding ngResources (Angular).

## Documentation
Currently the code and/or tests have to do. If it grows I will add docs of course.
Note that all exported functions are curried. This means nothing unless you want it to.
It simply means you can call function f : (x, y, z) as f(x,y,z) or f(x)(y,z) for example.

## Get going
npm install sluka

## Testing
Just type "npm test". It requires Mocha, but I added it as a dependency, so shouldn't be a problem.
