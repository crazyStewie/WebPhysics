async function game_main() {
    console.log("loading game");
    const GAME = await import("./game/game")
    console.log("loaded");
    let game = new GAME.mygame(document.querySelector(".three_body")!);
    function animate() {
        requestAnimationFrame(animate);
        game.step();
    }
    animate();
}


game_main();