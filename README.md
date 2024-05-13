# Overview of NoEyeTest
**NoEyeTest** is a script designed for the browser-game: [BBGM](http://www.basketball-gm.com); The intention of the script is to create a realistic progression system by using simple formulas based on player's PER stat for the last season

## Preliminary Information
[**NoEyeTest**](src/NoEyeTest.js), or **NET** for short, identifies players who will have their progs affected by detecting the `watch` property on the player. This is also visually seen as a flag within BBGM.

For a visual, here's an example of a player who is flagged

![A player who's bar chart icon are colored red](https://i.imgur.com/m77zErh.png)

And a player who isn't

![A player who is not flagged](https://i.imgur.com/7CvLHUp.png)

- [**Worker Console**](src/WorkerConsole.js) is intended to be used **before** you run progs each season.
- The target age of players to be affected by NET is 26 and above.
 - When using [**Worker Console**](src/WorkerConsole.js), it will by default flag players 25 and above. This is because **NET is executed after normal BBGM progs**.

## Instructions 📓
1. Before progs, run [**Worker Console**](src/WorkerConsole.js) in the _Danger Zone_
2. After progs (aka, in the `Preseason` phase), run [**NET**](src/NoEyeTest.js) in the _Danger Zone_
3. Progs for 26+ players should be modified, check the *News Feed* section for information

**_News Feed Post-NET:_**
![Prog Range Information](https://i.imgur.com/TCjuz3E.png)
### Age Tierlist
Review the age tierlist along with how low and high a player can go in each tierlist **[here](tiers.md)**



## Additional Information



This Prog Script currently includes features that are intended to assist with balancing Leagues.

- Players who are 30 and above have an extremely low chance (<5%) to prog 'Physical' skills
- Players under 30 have a 9% chance to God Prog. The closer they are to 30, the lesser their chance
- Players cannot progress above 80 overall
- There are **hard caps** for each age groups prog ranges - restricting how high and how low players can go as they age
- You can view the specifics of who progged, god progged (from the prog script), etc by viewing the `News Feed` inside of BBGM.
  - This is where all NET information will be logged
  
## ❓ Why was this made?

By default in BBGM, at the age of 26, a player will have a great chance to regress that only gets higher and worse the more they age; Within one off-season, an elite player(s) on your team could be devastatingly weakened or some players that should be hitting their prime, do not. The motive behind this is to enable a system that reasonably progresses players while not being based on random chance. This prog script is especially beneficial to multiplayer BBGM leagues, which, if you are familiar with, you know how critical progs are for a team.

### 🧠 Logic Behind the Script

By taking into account the player's PER:

- We create a reference point for you to be informed of the potential 'Prog Range' of your player.
- There's nothing wrong with the progression system by default in BBGM - and it works wel for the casual player. This is intended for multiplayer Leagues, or users who would like to try out a more realistic approach. This prog script instills confidence in knowing your player will progress based on their performance. This means your all-star player who is coming off an amazing season; 19.50 PER will have a great chance to prog well, instead of randomly going -7.

# Todo

- Improve regression
- Create a random chance for players to regress past the limit in their prog range

#### Credits

The idea and certain elements derive from TheProgMaestro
