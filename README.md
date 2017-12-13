# 230-Project4

## Initial Proposal

### Description:
For my project, I want to do a few different visualizations. For the first page, I want to
incorporate what I have been working on in other classes to create some interesting AI
behaviour. I am going to have a group of objects that flock together and follow the user’s mouse
position. The objects will also move to avoid the mouse if they get to close to it. For my second
page, I want to have a kind of game where the user “slings” shapes around on the screen, and
when shapes collide they might break apart, combine, change colors, etc. For my third page, I
want to have an audio-visualization where the user can click around on the screen to generate a
sound effect depending on where they click as well as generating an animation to show that
they clicked.

### Needed Resources:
I will need to include libraries that can handle animations for each page, another library
that can handle SVG manipulation for page 2, since shapes will be moving around the screen
frequently, and also a library that can handle audio for page 3.
Possible Resources:
* jQuery (animation)
* Anime.js (animation)
* Velocity.js (animation)
* SVG.js (SVGs)
* Snap.svg (SVGs)
* Howler.js (audio)


## Final Product

### Description:
This project is a series of three similar interactive pages. The first page is a flocking group that follows the users mouse position. The flockers will eventually move about the center of the screen if the mouse becomes idle or disappears. The second page is another version of the first page where the user can click to place individual flocking objects around on the screen. The third and final page is similar in that there are shapes that are moving around the screen, but this time you can drag and flick the shapes around on the screen, sticking them to the edges of the screen.

I changed some pages from my initial proposal because I realized that I was too ambitious when thinking of ideas for the project, and so I tried to keep the basic interaction the same on each page, but I reduced the number of libraries I ultimately used and focused on making interesting interactive pages. Page 1 remained the same (flockers follow mouse), page 2 still requires the user to click around the screen, but now it just creates objects instead of creating a sound effect, and page 3 removes collisions between objects while keeping the "sling" interaction.

### Needed Resources:
The only required resource that I used was a library for handling vector math and calculations.
Used Resources:
* Victor.js (vector math)
