async function game_main() {
    console.log("loading game");
    const GAME = await import("./game/game")
    console.log("loaded");
    let game = new GAME.Game(document.querySelector(".three_body")!);
    game.run();
}

game_main();