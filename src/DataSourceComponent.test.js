// import DataSourceComponent from "./DataSourceComponent";

it ("placeholder", () => {

});

// it ("shouldComponentUpdate works with propsToAccept = []", () => {
//     // SETUP
//     let dsc = new DataSourceComponent({
//         dataSource: {
//             one: "1",
//             two: "2"
//         }
//     });
//
//     // CALL
//     let result = dsc.shouldComponentUpdate({}, {
//         dataSource: {
//             one: "1",
//             two: "2"
//         }
//     });
//
//     // ASSERT
//     expect(result).toBe(true);
// });
//
// it ("shouldComponentUpdate works with propsToAccept = [\"one\"]", () => {
//     // SETUP
//     let dsc = new DataSourceComponent({
//         dataSource: {
//             one: "1",
//             two: "2"
//         }
//     });
//     dsc.propsToAccept.push("two");
//     dsc._dataSourceUpdated({
//         source: "one",
//         object: {
//             one: "1",
//             two: "2"
//         }
//     });
//
//     // CALL
//     let result = dsc.shouldComponentUpdate(null, null);
//
//
//     // ASSERT
//     expect(result).toBe(false);
// });
//
// it ("shouldComponentUpdate works with propsToAccept = [\"two\"]", () => {
//     // SETUP
//     let dsc = new DataSourceComponent({
//         dataSource: {
//             one: "1",
//             two: "2"
//         }
//     });
//     dsc.propsToAccept.push("one");
//     dsc._dataSourceUpdated({
//         source: "one",
//         object: {
//             one: "1",
//             two: "2"
//         }
//     });
//
//     // CALL
//     let result = dsc.shouldComponentUpdate(null, null);
//
//
//     // ASSERT
//     expect(result).toBe(true);
// });