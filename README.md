<p align=center>
  <b>You're probably looking for <a href="https://jcbhmr.me/astrian-chess/">jcbhmr.me/astrian-chess</a></b>
</p>

# Astrian Chess

> Part b in the illustration shows an amusing Astrian analogue of chess. On a linear board a bishop is meaningless and a queen is the same as a rook, and so the pieces are limited to kings, knights and rooks. The only rule modification needed is that a knight moves two cells in either direction and can jump an intervening piece of either color. If the game is played rationally, will either White or Black win or will the game end in a draw? The question is surprisingly tricky to answer.
>
> ![part b](https://i.imgur.com/XtPnNo7.png)

&mdash; [Scientific American Volume 243, Issue 1](https://www.scientificamerican.com/issue/sa/1980/07-01/)

## Development

### My Astrian Chess variant of the UCI protocol

[You can find a copy of the UCI protocol specification on GitHub Gist posted by @DOBRO.](https://gist.github.com/DOBRO/2592c6dad754ba67e6dcaec8c90165bf)

This variant uses JavaScript ES modules as the low-level API layer instead of a subprocess. That's just because it's easier to integrate with this JavaScript-only Astrian Chess webapp. This protocol isn't intended to be used anywhere besides this application 😉 so it's OK that it's highly coupled to this app. This protocol documentation is here to explain the chess engine and UI separation architecture to future me.

- The engine is in `engine.ts`
- The engine is a class
- Use methods to issue commands from the GUI to the engine class
- Listen for events on the engine instance to recieve responses

> On a linear board a bishop is meaningless and a queen is the same as a rook, and so the pieces are limited to kings, knights and rooks. The only rule modification needed is that a knight moves two cells in either direction and can jump an intervening piece of either color.

Moves are described in long algebraic notation, with null moves represented as 0000.

**GUI commands**

- **uci:** Signals the engine to switch to UCI mode, initializing communication.
- **debug [on|off]:** Toggles debug mode for enhanced communication.
- **isready:** Synchronizes the engine with the GUI, ensuring readiness.
- **setoption name <id> [value <x>]:** Adjusts internal engine parameters as needed.
- **register:** Facilitates engine registration or defers registration for later.
- **ucinewgame:** Indicates the start of a new game.
- **position [fen <fenstring> | startpos] moves <move1> .... <movei>:** Sets up the game position and plays specified moves.
- **go:** Initiates the engine's search on the current position.
- **stop:** Halts ongoing calculations.
- **ponderhit:** Informs the engine of a user move during pondering.
- **quit:** Terminates the program.

**Engine responses**

- **id:** Identifies the engine and its author.
- **uciok:** Acknowledges successful UCI mode activation.
- **readyok:** Signals engine readiness for further commands.
- **bestmove <move1> [ponder <move2>]:** Communicates the best move found by the engine.
- **copyprotection:** Handles copy protection status.
- **registration:** Manages engine registration.
- **info:** Provides search information and game statistics.
- **option:** Defines parameters customizable by the GUI.
