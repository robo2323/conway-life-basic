# Flocking/Swarming Simulation (Boids)
## [Live Demo](https://robo2323.github.io/flocking-simulation-boids/)

### *See the live demo above, play around with all the settings, sliders and buttons and see what happens!*
An implementation of the classic artificial life program, [Boids](https://en.wikipedia.org/wiki/Boids) developed by Craig Reynolds. It simulates emergent flocking behaviour using three simple rules that each agent (boid) adheres to:
- **separation**: steer to avoid crowding local flockmates
- **alignment**: steer towards the average heading of local flockmates
- **cohesion**: steer to move toward the average position (center of mass) of local flockmates

For more information about the algorithm see the above wikipedia link. 

## Used in this project
- Vanilla JavaScript
- HTML5 Canvas
- custom CSS for UI

## TODO
- Code refactor to limit/eliminate use of global variables
- Separate logic and DOM stuff
- Refactor to adhere more to OOP principals
### License: *MIT*