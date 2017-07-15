import TimeRecorder from "./TimeRecorder";

it ("constructor", () => {
    let instance = new TimeRecorder();

    expect(instance !== null).toBe(true);
});

/**
 * I know this test sucks but it is just for visual inspection.
 */
it ("test it all", () => {
    // SETUP
    let timeRecorder = new TimeRecorder();
    let timeRecorder2 = new TimeRecorder();

    // CALL
    timeRecorder.recordStart("test");
    // for (let i = 0; i < 100; i++) {
    //     let temp = (5 + 5).toString();
    //     console.log(temp);
    // }
    timeRecorder.recordEnd("test");

    timeRecorder.recordStart("test");
    // for (let i = 0; i < 100; i++) {
    //     let temp = (5 + 5).toString();
    //     console.log(temp);
    // }
    timeRecorder.recordEnd("test");

    timeRecorder.recordStart("test");
    // for (let i = 0; i < 100; i++) {
    //     let temp = (5 + 5).toString();
    //     console.log(temp);
    // }
    timeRecorder.recordEnd("test");

    timeRecorder.recordStart("test");
    // for (let i = 0; i < 100; i++) {
    //     let temp = (5 + 5).toString();
    //     console.log(temp);
    // }
    timeRecorder.recordEnd("test");

    timeRecorder2.recordStart("test2");
    timeRecorder2.recordEnd("test2");

    timeRecorder2.recordStart("test2");

    timeRecorder.logSummary();
});