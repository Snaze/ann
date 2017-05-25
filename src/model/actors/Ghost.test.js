import Ghost from "./Ghost";
import Direction from "../../utils/Direction";
import Location from "../Location";
import Level from "../Level";

const moveInDirectionCallback_DoesNothing = function (newLocation) {
    // TO NOTHING
};

it ("Ghost constructor works", () => {

    let level = new Level();
    let ghost = new Ghost(Direction.LEFT, new Location(0, 0), level, Ghost.RED);


});

it ("Ghost set color works", () => {

    let level = new Level();
    let ghost = new Ghost(Direction.LEFT, new Location(0, 0), level, Ghost.RED);
    ghost.color = Ghost.BLUE;

    expect(ghost.color).toBe(Ghost.BLUE);

});

// TODO: Fill out movement unit tests (test timerTick(e))