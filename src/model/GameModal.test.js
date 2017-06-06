import GameModal from "./GameModal";

it ("GameModal constructor works", () => {
   let gameModal = new GameModal();

   expect(gameModal !== null).toBe(true);
});

it ("GameModal.modal is not undefined", () => {
    let gameModal = new GameModal();

    expect(typeof(gameModal.modal) !== "undefined").toBe(true);
    expect(gameModal.modal !== null).toBe(true);
});